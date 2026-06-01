// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';
import { renderActivity, isLongPrompt, formatTime, createScheduleApi, __test } from '../web.mjs';

afterEach(() => cleanup());

const SHORT_PROMPT = 'Do a quick thing.';
const LONG_PROMPT = Array.from({ length: 8 }, (_, i) => `Line ${i + 1}: ` + 'x'.repeat(40)).join('\n');

function makeJobs() {
  return [
    { id: 'long', name: 'home briefing', schedule: '0 13 * * *', prompt: LONG_PROMPT, cwd: '/home/coder', enabled: true, nextRun: Date.now() + 3600_000, lastRun: Date.now() - 3600_000, scheduleError: null },
    { id: 'short', name: 'quick job', schedule: '0 9 * * *', prompt: SHORT_PROMPT, cwd: '/home/coder', enabled: false, nextRun: null, lastRun: null, scheduleError: null },
  ];
}

function makeApi(jobs = makeJobs()) {
  const cron = {
    list: vi.fn().mockResolvedValue({ jobs, filePath: '/tmp/cron-jobs.json' }),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(undefined),
    runNow: vi.fn().mockResolvedValue({ sessionId: 's1' }),
  };
  return { cron, getDefaultCwd: vi.fn().mockResolvedValue('/home/coder') };
}

function renderPanel(api = makeApi()) {
  const props = { React, api, navigation: { openSession: vi.fn() } };
  const utils = render(renderActivity(props));
  return { ...utils, api };
}

describe('isLongPrompt', () => {
  it('treats short single-line prompts as not long', () => {
    expect(isLongPrompt(SHORT_PROMPT)).toBe(false);
    expect(isLongPrompt('')).toBe(false);
    expect(isLongPrompt(null)).toBe(false);
  });

  it('treats >120 chars or >2 lines as long', () => {
    expect(isLongPrompt('x'.repeat(121))).toBe(true);
    expect(isLongPrompt('a\nb\nc')).toBe(true);
    expect(isLongPrompt(LONG_PROMPT)).toBe(true);
  });
});

describe('formatTime', () => {
  it('returns "never" for null/undefined', () => {
    expect(formatTime(null)).toBe('never');
    expect(formatTime(undefined)).toBe('never');
  });
  it('formats numeric timestamps', () => {
    expect(formatTime(new Date('2026-01-01T00:00:00Z').getTime())).toMatch(/2026/);
  });
});

describe('createScheduleApi', () => {
  it('prefers a host-provided cron object', () => {
    const cron = { list: () => {} };
    expect(createScheduleApi({ cron })).toBe(cron);
  });

  it('falls back to request() based REST calls', async () => {
    const request = vi.fn().mockResolvedValue({ ok: true });
    const api = createScheduleApi({ request });
    await api.list();
    expect(request).toHaveBeenCalledWith('/api/cron');
    await api.create({ name: 'n' });
    expect(request).toHaveBeenCalledWith('/api/cron', { method: 'POST', body: { name: 'n' } });
    await api.runNow('abc');
    expect(request).toHaveBeenCalledWith('/api/cron/abc/run', { method: 'POST', body: {} });
  });

  it('returns null when neither cron nor request is available', () => {
    expect(createScheduleApi({})).toBeNull();
  });
});

describe('SchedulePanel rendering', () => {
  it('renders the jobs list with a count and a New schedule button', async () => {
    renderPanel();
    expect(await screen.findByText('home briefing')).toBeTruthy();
    expect(screen.getByText('quick job')).toBeTruthy();
    expect(screen.getByText('Scheduled jobs')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy(); // count badge
    expect(screen.getByRole('button', { name: /New schedule/ })).toBeTruthy();
  });

  it('injects its scoped stylesheet exactly once', async () => {
    renderPanel();
    await screen.findByText('home briefing');
    expect(document.querySelectorAll(`#${__test.STYLE_ID}`).length).toBe(1);
  });

  it('does not render the form/modal by default', async () => {
    renderPanel();
    await screen.findByText('home briefing');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows an empty state when there are no jobs', async () => {
    renderPanel(makeApi([]));
    expect(await screen.findByText(/No scheduled jobs yet/)).toBeTruthy();
  });
});

describe('long prompt collapse/expand', () => {
  it('clamps long prompts by default and offers Show more, but not for short prompts', async () => {
    const { container } = renderPanel();
    await screen.findByText('home briefing');

    const cards = container.querySelectorAll('.sched-card');
    const longCard = cards[0];
    const shortCard = cards[1];

    expect(longCard.querySelector('.sched-prompt.clamped')).toBeTruthy();
    expect(within(longCard).getByRole('button', { name: 'Show more' })).toBeTruthy();

    // Short prompt: no clamp, no toggle.
    expect(shortCard.querySelector('.sched-prompt.clamped')).toBeNull();
    expect(within(shortCard).queryByRole('button', { name: /Show (more|less)/ })).toBeNull();
  });

  it('expands and collapses on toggle click', async () => {
    const { container } = renderPanel();
    await screen.findByText('home briefing');
    const longCard = container.querySelectorAll('.sched-card')[0];

    fireEvent.click(within(longCard).getByRole('button', { name: 'Show more' }));
    expect(longCard.querySelector('.sched-prompt.clamped')).toBeNull();
    expect(within(longCard).getByRole('button', { name: 'Show less' })).toBeTruthy();

    fireEvent.click(within(longCard).getByRole('button', { name: 'Show less' }));
    expect(longCard.querySelector('.sched-prompt.clamped')).toBeTruthy();
  });
});

describe('create/edit modal', () => {
  it('opens the modal from the New schedule button and closes via Cancel', async () => {
    renderPanel();
    await screen.findByText('home briefing');

    fireEvent.click(screen.getByRole('button', { name: /New schedule/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('New schedule')).toBeTruthy();
    expect(within(dialog).getByPlaceholderText('Nightly summary')).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('opens a pre-filled modal in edit mode when Edit is clicked', async () => {
    const { container } = renderPanel();
    await screen.findByText('home briefing');
    const longCard = container.querySelectorAll('.sched-card')[0];

    fireEvent.click(within(longCard).getByRole('button', { name: 'Edit' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Edit schedule')).toBeTruthy();
    expect(within(dialog).getByDisplayValue('home briefing')).toBeTruthy();
    expect(within(dialog).getByDisplayValue('0 13 * * *')).toBeTruthy();
  });

  it('submits a new job through the schedule API and refreshes', async () => {
    const { api } = renderPanel();
    await screen.findByText('home briefing');

    fireEvent.click(screen.getByRole('button', { name: /New schedule/ }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByPlaceholderText('Nightly summary'), { target: { value: 'nightly' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Add schedule' }));

    await waitFor(() => expect(api.cron.create).toHaveBeenCalledTimes(1));
    expect(api.cron.create.mock.calls[0][0]).toMatchObject({ name: 'nightly', enabled: true });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

describe('job actions', () => {
  it('toggles enabled via the switch', async () => {
    const { container, api } = renderPanel();
    await screen.findByText('home briefing');
    const longCard = container.querySelectorAll('.sched-card')[0];
    const sw = longCard.querySelector('.sched-switch');
    fireEvent.click(sw);
    await waitFor(() => expect(api.cron.update).toHaveBeenCalledWith('long', { enabled: false }));
  });

  it('runs a job now', async () => {
    const { container, api } = renderPanel();
    await screen.findByText('home briefing');
    const longCard = container.querySelectorAll('.sched-card')[0];
    fireEvent.click(within(longCard).getByRole('button', { name: 'Run now' }));
    await waitFor(() => expect(api.cron.runNow).toHaveBeenCalledWith('long'));
  });
});
