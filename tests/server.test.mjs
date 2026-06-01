import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { __test } from '../server.mjs';

const { validateSchedule, validateCronInput, nextRun, createStore, toCronJobView, schedulerEnabled } = __test;

describe('validateSchedule', () => {
  it('accepts a valid 5-field cron expression', () => {
    expect(validateSchedule('0 9 * * *')).toBeNull();
    expect(validateSchedule('*/15 0-12 1 1 1-5')).toBeNull();
  });

  it('rejects expressions without five fields', () => {
    expect(validateSchedule('0 9 * *')).toMatch(/five fields/);
    expect(validateSchedule('0 9 * * * *')).toMatch(/five fields/);
  });

  it('rejects out-of-range fields with the offending field index', () => {
    expect(validateSchedule('99 9 * * *')).toMatch(/field 1/);
    expect(validateSchedule('0 99 * * *')).toMatch(/field 2/);
    expect(validateSchedule('0 9 32 * *')).toMatch(/field 3/);
    expect(validateSchedule('0 9 * 13 *')).toMatch(/field 4/);
    expect(validateSchedule('0 9 * * 9')).toMatch(/field 5/);
  });
});

describe('validateCronInput', () => {
  it('requires name, schedule and cwd', () => {
    expect(validateCronInput({})).toBe('name is required');
    expect(validateCronInput({ name: 'x' })).toBe('schedule is required');
    expect(validateCronInput({ name: 'x', schedule: '0 9 * * *' })).toBe('cwd is required');
  });

  it('passes a fully-specified valid job', () => {
    expect(validateCronInput({ name: 'x', schedule: '0 9 * * *', cwd: '/tmp' })).toBeNull();
  });

  it('surfaces schedule validation errors', () => {
    expect(validateCronInput({ name: 'x', schedule: 'bad', cwd: '/tmp' })).toMatch(/Invalid schedule/);
  });
});

describe('nextRun', () => {
  it('returns the next matching minute for a daily 9am job', () => {
    const from = new Date('2026-01-01T08:00:00Z');
    const next = nextRun('0 9 * * *', from);
    expect(next).toBeInstanceOf(Date);
    expect(next.getHours()).toBe(9);
    expect(next.getMinutes()).toBe(0);
    expect(next.getTime()).toBeGreaterThan(from.getTime());
  });

  it('rolls to the next day when the time has passed', () => {
    const from = new Date('2026-01-01T10:00:00');
    const next = nextRun('0 9 * * *', from);
    expect(next.getDate()).toBe(2);
  });

  it('returns null for an invalid schedule', () => {
    expect(nextRun('not a cron', new Date())).toBeNull();
  });
});

describe('toCronJobView', () => {
  it('normalises optional fields and attaches scheduleError for bad schedules', () => {
    const view = toCronJobView({ id: '1', name: 'n', schedule: 'bad', prompt: 'p', cwd: '/tmp', enabled: true });
    expect(view).toMatchObject({ id: '1', name: 'n', enabled: true, lastRun: null, nextRun: null, lastSessionId: null });
    expect(view.scheduleError).toMatch(/expected five fields/);
  });

  it('has no scheduleError for valid schedules', () => {
    const view = toCronJobView({ id: '1', name: 'n', schedule: '0 9 * * *', prompt: 'p', cwd: '/tmp', enabled: false });
    expect(view.scheduleError).toBeNull();
  });
});

describe('createStore', () => {
  let dir;
  let store;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sched-store-'));
    store = createStore(path.join(dir, 'cron-jobs.json'));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('returns an empty list when the file does not exist', async () => {
    expect(await store.list()).toEqual([]);
  });

  it('creates, reads, updates and deletes jobs', async () => {
    await store.create({ id: 'a', name: 'A', schedule: '0 9 * * *', prompt: '', cwd: '/tmp', enabled: true });
    expect((await store.list()).length).toBe(1);
    expect((await store.get('a')).name).toBe('A');

    const updated = await store.update('a', { name: 'A2', enabled: false });
    expect(updated.name).toBe('A2');
    expect(updated.enabled).toBe(false);

    expect(await store.update('missing', { name: 'x' })).toBeNull();
    expect(await store.delete('a')).toBe(true);
    expect(await store.delete('a')).toBe(false);
    expect(await store.list()).toEqual([]);
  });

  it('persists JSON in a stable { jobs: [...] } shape', async () => {
    await store.create({ id: 'a', name: 'A', schedule: '0 9 * * *', prompt: 'hi', cwd: '/tmp', enabled: true });
    const raw = JSON.parse(await fs.readFile(store.filePath, 'utf8'));
    expect(Array.isArray(raw.jobs)).toBe(true);
    expect(raw.jobs[0].id).toBe('a');
  });
});

describe('schedulerEnabled', () => {
  const original = { ...process.env };
  afterEach(() => {
    process.env.PI_CRUST_ENABLE_SCHEDULER = original.PI_CRUST_ENABLE_SCHEDULER;
    process.env.PI_CRUST_USE_MOCK = original.PI_CRUST_USE_MOCK;
  });

  it('honours explicit enable/disable env flags', () => {
    process.env.PI_CRUST_ENABLE_SCHEDULER = '1';
    expect(schedulerEnabled()).toBe(true);
    process.env.PI_CRUST_ENABLE_SCHEDULER = '0';
    expect(schedulerEnabled()).toBe(false);
  });

  it('disables under the mock harness', () => {
    delete process.env.PI_CRUST_ENABLE_SCHEDULER;
    process.env.PI_CRUST_USE_MOCK = '1';
    expect(schedulerEnabled()).toBe(false);
  });
});
