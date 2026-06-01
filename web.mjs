export function renderActivity(props) {
  const React = props.React;
  return React.createElement(SchedulePanel, { hostProps: props });
}

const STYLE_ID = 'schedule-makeover-styles';
const STYLE_TEXT = `
/* ============================================================
   Schedule extension — redesign that lifts the Settings page
   visual language (topbar, page-head, section cards, rows,
   settings-style inputs/buttons, toggle switch). Self-contained:
   all rules are scoped under .sched-mk and use the host's design
   tokens so it stays consistent in light + dark themes.
   ============================================================ */
.external-schedule-panel.sched-mk {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  color: var(--text-primary);
}

/* ---- Top bar: breadcrumb + global action ---- */
.sched-mk .sched-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px clamp(20px, 4vw, 40px) 0;
  flex: 0 0 auto;
}
.sched-mk .sched-crumbs {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.sched-mk .sched-crumbs > span + span::before {
  content: "/";
  margin: 0 8px;
  opacity: 0.6;
}

/* ---- Page header ---- */
.sched-mk .sched-head {
  padding: 14px clamp(20px, 4vw, 40px) 18px;
  flex: 0 0 auto;
}
.sched-mk .sched-head h1 {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.025em;
  margin: 0;
  line-height: 1.1;
  color: var(--text-primary);
}
.sched-mk .sched-sub {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 6px;
  max-width: 64ch;
}
.sched-mk .sched-path {
  display: inline-block;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-secondary);
  background: var(--gray-060);
  border: 1px solid var(--hairline);
  border-radius: 6px;
  padding: 3px 8px;
  word-break: break-all;
}

/* ---- Scroll container ---- */
.sched-mk .sched-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 0 clamp(20px, 4vw, 40px) 80px;
  scroll-behavior: smooth;
}
.sched-mk .sched-inner { max-width: 920px; margin: 0 auto; }

/* ---- Error banner ---- */
.sched-mk .sched-error {
  margin: 0 0 16px;
  padding: 10px 12px;
  border: 1px solid var(--red-200);
  border-radius: 8px;
  background: var(--surface-1);
  color: var(--red-600);
  font-size: 13px;
}

/* ---- Sections ---- */
.sched-mk .sched-section { padding: 26px 0 30px; border-bottom: 1px solid var(--hairline); }
.sched-mk .sched-section:first-child { padding-top: 14px; }
.sched-mk .sched-section:last-child { border-bottom: none; }
.sched-mk .sched-section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}
.sched-mk .sched-section-head h2 {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}
.sched-mk .sched-count {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--gray-060);
  border: 1px solid var(--hairline);
  border-radius: 999px;
  padding: 1px 8px;
}
.sched-mk .sched-section-desc {
  color: var(--text-secondary);
  font-size: 13.5px;
  margin-top: 4px;
  max-width: 64ch;
}

/* ---- Form ---- */
.sched-mk .sched-form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
  gap: 16px 20px;
}
.sched-mk .sched-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.sched-mk .sched-field.wide { grid-column: 1 / -1; }
.sched-mk .sched-field > span {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.sched-mk .sched-hint {
  font-size: 11.5px;
  color: var(--text-secondary);
  font-weight: 400;
}
.sched-mk .sched-hint code {
  font-family: var(--font-mono);
  background: var(--gray-060);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  padding: 0 5px;
  font-size: 11px;
}

.sched-mk .sched-input,
.sched-mk .sched-textarea {
  width: 100%;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background: var(--surface-1);
  color: var(--text-primary);
  font: inherit;
  font-size: 13.5px;
  padding: 0 12px;
  height: 34px;
  outline: none;
  box-sizing: border-box;
}
.sched-mk .sched-input.mono { font-family: var(--font-mono); font-size: 12.5px; }
.sched-mk .sched-textarea {
  height: auto;
  min-height: 120px;
  padding: 10px 12px;
  line-height: 1.5;
  resize: vertical;
}
.sched-mk .sched-input::placeholder,
.sched-mk .sched-textarea::placeholder { color: var(--text-secondary); opacity: 0.7; }
.sched-mk .sched-input:focus,
.sched-mk .sched-textarea:focus {
  border-color: var(--blue-accent);
  box-shadow: 0 0 0 3px var(--blue-focus);
}
.sched-mk .sched-form-prompt { margin-top: 16px; }
.sched-mk .sched-form-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

/* ---- Buttons ---- */
.sched-mk .sched-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
  color: var(--text-primary);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}
.sched-mk .sched-btn:hover:not(:disabled) { background: var(--gray-080); border-color: var(--gray-200); }
.sched-mk .sched-btn:disabled { opacity: 0.55; cursor: default; }
.sched-mk .sched-btn.primary { background: var(--blue-accent); border-color: var(--blue-accent); color: #fff; }
.sched-mk .sched-btn.primary:hover:not(:disabled) { background: var(--blue-accent-dark); border-color: var(--blue-accent-dark); }
.sched-mk .sched-btn.ghost { border-color: transparent; }
.sched-mk .sched-btn.ghost:hover:not(:disabled) { background: var(--gray-080); border-color: var(--hairline); }
.sched-mk .sched-btn.danger { color: var(--red-600); }
.sched-mk .sched-btn.danger:hover:not(:disabled) { background: var(--red-050, var(--gray-080)); border-color: var(--red-200); }
.sched-mk .sched-btn.sm { height: 28px; padding: 0 11px; font-size: 12.5px; }

/* ---- Empty state ---- */
.sched-mk .sched-empty {
  border: 1px dashed var(--gray-200);
  border-radius: 8px;
  background: var(--gray-060);
  padding: 22px;
  color: var(--text-secondary);
  font-size: 13.5px;
  text-align: center;
}

/* ---- Job list / cards ---- */
.sched-mk .sched-jobs { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.sched-mk .sched-card {
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface-1);
  padding: 16px 18px;
  transition: border-color .12s ease;
}
.sched-mk .sched-card:hover { border-color: var(--gray-200); }
.sched-mk .sched-card.disabled { opacity: 0.62; }

.sched-mk .sched-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.sched-mk .sched-card-identity { min-width: 0; }
.sched-mk .sched-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.sched-mk .sched-card-title strong {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}
.sched-mk .sched-cron {
  font-family: var(--font-mono);
  font-size: 11.5px;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  padding: 2px 8px;
  color: var(--text-secondary);
  background: var(--gray-060);
}

/* ---- Meta line ---- */
.sched-mk .sched-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-top: 10px;
}
.sched-mk .sched-meta-item { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
.sched-mk .sched-meta-k {
  font-size: 10.5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.sched-mk .sched-meta-v {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-primary);
  word-break: break-all;
}

/* ---- Prompt (collapsible) ---- */
.sched-mk .sched-prompt-wrap { margin-top: 12px; }
.sched-mk .sched-prompt-label {
  font-size: 10.5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.sched-mk .sched-prompt {
  position: relative;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--gray-040, var(--gray-060));
  border: 1px solid var(--hairline);
  border-radius: 8px;
  padding: 12px 14px;
}
.sched-mk .sched-prompt.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sched-mk .sched-prompt.clamped::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 38px;
  border-radius: 0 0 8px 8px;
  background: linear-gradient(to bottom, transparent, var(--gray-040, var(--gray-060)));
  pointer-events: none;
}
.sched-mk .sched-prompt.empty { color: var(--text-secondary); font-style: italic; }
.sched-mk .sched-prompt-toggle {
  margin-top: 8px;
  border: none;
  background: none;
  padding: 0;
  color: var(--blue-accent);
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
}
.sched-mk .sched-prompt-toggle:hover { text-decoration: underline; }

/* ---- Card actions + toggle switch ---- */
.sched-mk .sched-card-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.sched-mk .sched-switch {
  --sw-w: 32px; --sw-h: 18px;
  appearance: none; -webkit-appearance: none;
  width: var(--sw-w); height: var(--sw-h);
  border-radius: 999px;
  background: var(--gray-200);
  position: relative;
  cursor: pointer;
  border: none; padding: 0;
  flex-shrink: 0;
  transition: background .12s ease;
}
.sched-mk .sched-switch::before {
  content: '';
  position: absolute; top: 2px; left: 2px;
  width: calc(var(--sw-h) - 4px); height: calc(var(--sw-h) - 4px);
  background: #fff; border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,.18);
  transition: transform .12s ease;
}
.sched-mk .sched-switch:checked { background: var(--blue-accent); }
.sched-mk .sched-switch:checked::before { transform: translateX(calc(var(--sw-w) - var(--sw-h))); }
.sched-mk .sched-switch:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--blue-focus); }
.sched-mk .sched-switch:disabled { opacity: 0.55; cursor: default; }

.sched-mk .sched-card-err {
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--red-600);
}

/* ---- Scrollbar polish ---- */
.sched-mk .sched-scroll::-webkit-scrollbar { width: 10px; }
.sched-mk .sched-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
.sched-mk .sched-scroll:hover::-webkit-scrollbar-thumb { background: var(--gray-200); }

/* ---- Modal ---- */
.sched-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 7vh 20px 40px;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(2px);
  overflow-y: auto;
}
.sched-modal {
  width: 100%;
  max-width: 640px;
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
  color: var(--text-primary);
  overflow: hidden;
}
.sched-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 14px;
  border-bottom: 1px solid var(--hairline);
}
.sched-modal-head h2 {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin: 0;
}
.sched-modal-head .sched-section-desc { margin-top: 4px; }
.sched-modal-close {
  flex-shrink: 0;
  width: 30px; height: 30px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid transparent;
  border-radius: 7px;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px; line-height: 1;
}
.sched-modal-close:hover { background: var(--gray-080); border-color: var(--hairline); color: var(--text-primary); }
.sched-modal-body { padding: 18px 22px 22px; }

@media (max-width: 720px) {
  .sched-mk .sched-form-grid { grid-template-columns: 1fr; }
  .sched-mk .sched-card-top { flex-direction: column; }
  .sched-mk .sched-card-actions { flex-wrap: wrap; }
}
`;

function useInjectedStyles(React) {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_TEXT;
    document.head.appendChild(style);
  }, []);
}

function SchedulePanel({ hostProps: props }) {
  const React = props.React;
  const { useEffect, useMemo, useState } = React;
  useInjectedStyles(React);

  const defaultCwd = props.api.getDefaultCwd ? undefined : '';
  const [state, setState] = useState({ loading: true, error: null, jobs: [], filePath: '', defaultCwd: defaultCwd ?? '' });
  const [draft, setDraft] = useState({ name: '', schedule: '0 9 * * *', prompt: '', cwd: '' });
  const [editing, setEditing] = useState(null);
  const [busyJob, setBusyJob] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const sortedJobs = useMemo(() => [...state.jobs].sort((a, b) => (a.nextRun ?? Number.MAX_SAFE_INTEGER) - (b.nextRun ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name)), [state.jobs]);
  const scheduleApi = createScheduleApi(props.api);

  const refresh = () => {
    if (!scheduleApi) {
      setState((current) => ({ ...current, loading: false, error: 'Schedule API is not available.' }));
      return Promise.resolve();
    }
    setState((current) => ({ ...current, loading: true, error: null }));
    return scheduleApi.list()
      .then((result) => setState((current) => ({ ...current, loading: false, error: null, jobs: result.jobs, filePath: result.filePath })))
      .catch((error) => setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : String(error) })));
  };

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(props.api.getDefaultCwd?.()).then((cwd) => {
      if (!cancelled && cwd) {
        setState((current) => ({ ...current, defaultCwd: cwd }));
        setDraft((current) => current.cwd ? current : { ...current, cwd });
      }
    }).catch(() => undefined);
    refresh();
    return () => { cancelled = true; };
  }, []);

  const resetDraft = () => {
    setEditing(null);
    setDraft({ name: '', schedule: '0 9 * * *', prompt: '', cwd: state.defaultCwd || '' });
  };

  const openCreate = () => {
    setEditing(null);
    setDraft({ name: '', schedule: '0 9 * * *', prompt: '', cwd: state.defaultCwd || '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetDraft();
  };

  useEffect(() => {
    if (!modalOpen || typeof document === 'undefined') return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const submit = (event) => {
    event.preventDefault();
    if (!scheduleApi) return;
    const input = {
      name: draft.name.trim(),
      schedule: draft.schedule.trim(),
      prompt: draft.prompt,
      cwd: draft.cwd.trim() || state.defaultCwd,
      enabled: true,
    };
    const op = editing ? scheduleApi.update(editing, input) : scheduleApi.create(input);
    setState((current) => ({ ...current, loading: true, error: null }));
    op.then(() => { setModalOpen(false); resetDraft(); return refresh(); })
      .catch((error) => setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : String(error) })));
  };

  const editJob = (job) => {
    setEditing(job.id);
    setDraft({ name: job.name, schedule: job.schedule, prompt: job.prompt, cwd: job.cwd });
    setModalOpen(true);
  };

  const updateJob = (job, patch) => {
    if (!scheduleApi) return;
    setBusyJob(job.id);
    scheduleApi.update(job.id, patch).then(refresh)
      .catch((error) => setState((current) => ({ ...current, error: error instanceof Error ? error.message : String(error) })))
      .finally(() => setBusyJob(null));
  };

  const runJob = (job) => {
    if (!scheduleApi) return;
    setBusyJob(job.id);
    scheduleApi.runNow(job.id)
      .then(async (result) => {
        if (result.sessionId && props.navigation?.openSession) await props.navigation.openSession(result.sessionId);
        return refresh();
      })
      .catch((error) => setState((current) => ({ ...current, error: error instanceof Error ? error.message : String(error) })))
      .finally(() => setBusyJob(null));
  };

  const deleteJob = (job) => {
    if (!scheduleApi) return;
    if (typeof window !== 'undefined' && !window.confirm(`Delete schedule "${job.name}"?`)) return;
    setBusyJob(job.id);
    scheduleApi.delete(job.id).then(refresh)
      .catch((error) => setState((current) => ({ ...current, error: error instanceof Error ? error.message : String(error) })))
      .finally(() => setBusyJob(null));
  };

  const toggleExpanded = (id) => setExpanded((current) => ({ ...current, [id]: !current[id] }));

  const h = React.createElement;

  return h('div', { className: 'cron-panel external-schedule-panel sched-mk' },
    // Top bar
    h('div', { className: 'sched-topbar' },
      h('div', { className: 'sched-crumbs' },
        h('span', null, 'Account'),
        h('span', null, 'Schedule')
      ),
      h('button', { type: 'button', className: 'sched-btn ghost', onClick: refresh, disabled: state.loading },
        h(ReloadIcon, { React }),
        state.loading ? 'Loading…' : 'Refresh'
      )
    ),
    // Page head
    h('header', { className: 'sched-head' },
      h('h1', null, 'Schedule'),
      h('div', { className: 'sched-sub' }, 'Cron-scheduled Pi prompts for this workspace. Each job spawns a session with its prompt on the given schedule.'),
      state.filePath ? h('code', { className: 'sched-path' }, state.filePath) : null
    ),
    // Body
    h('div', { className: 'sched-scroll' },
      h('div', { className: 'sched-inner' },
        state.error ? h('div', { role: 'alert', className: 'sched-error' }, state.error) : null,

        // ---- Jobs list ----
        h('section', { className: 'sched-section' },
          h('div', { className: 'sched-section-head' },
            h('div', null,
              h('h2', null, 'Scheduled jobs', sortedJobs.length ? h('span', { className: 'sched-count' }, String(sortedJobs.length)) : null),
              h('div', { className: 'sched-section-desc' }, 'All cron jobs configured for this workspace, sorted by next run.')
            ),
            h('button', { type: 'button', className: 'sched-btn primary', onClick: openCreate },
              h('span', { 'aria-hidden': true, style: { fontSize: '15px', lineHeight: 1, marginRight: '2px' } }, '+'),
              'New schedule'
            )
          ),
          (sortedJobs.length === 0 && !state.loading)
            ? h('div', { className: 'sched-empty' }, 'No scheduled jobs yet. Create one above to schedule a prompt.')
            : h('ul', { className: 'sched-jobs' }, sortedJobs.map((job) => h(JobCard, {
                key: job.id,
                React,
                job,
                busy: busyJob === job.id,
                expanded: !!expanded[job.id],
                onToggleExpanded: () => toggleExpanded(job.id),
                onRun: () => runJob(job),
                onEdit: () => editJob(job),
                onToggleEnabled: () => updateJob(job, { enabled: !job.enabled }),
                onDelete: () => deleteJob(job),
              })))
        )
      )
    ),
    // ---- Modal: create / edit ----
    modalOpen ? h('div', { className: 'sched-modal-overlay', onMouseDown: (e) => { if (e.target === e.currentTarget) closeModal(); } },
      h('div', { className: 'sched-modal', role: 'dialog', 'aria-modal': true },
        h('div', { className: 'sched-modal-head' },
          h('div', null,
            h('h2', null, editing ? 'Edit schedule' : 'New schedule'),
            h('div', { className: 'sched-section-desc' }, editing
              ? 'Update this scheduled job, then save your changes.'
              : 'Give the job a name, a cron expression, the working directory, and the prompt to run.')
          ),
          h('button', { type: 'button', className: 'sched-modal-close', onClick: closeModal, 'aria-label': 'Close' }, '\u00d7')
        ),
        h('div', { className: 'sched-modal-body' },
          h('form', { className: 'sched-form', onSubmit: submit },
            h('div', { className: 'sched-form-grid' },
              h('label', { className: 'sched-field' },
                h('span', null, 'Name'),
                h('input', { className: 'sched-input', value: draft.name, onChange: (e) => setDraft({ ...draft, name: e.target.value }), placeholder: 'Nightly summary', required: true, autoFocus: true })
              ),
              h('label', { className: 'sched-field' },
                h('span', null, 'Schedule ', h('span', { className: 'sched-hint' }, '\u2014 5-field cron, e.g. ', h('code', null, '0 9 * * *'))),
                h('input', { className: 'sched-input mono', value: draft.schedule, onChange: (e) => setDraft({ ...draft, schedule: e.target.value }), placeholder: '0 9 * * *', required: true })
              ),
              h('label', { className: 'sched-field wide' },
                h('span', null, 'Working directory'),
                h('input', { className: 'sched-input mono', value: draft.cwd, onChange: (e) => setDraft({ ...draft, cwd: e.target.value }), placeholder: state.defaultCwd || '/workspace', required: true })
              )
            ),
            h('label', { className: 'sched-field sched-form-prompt' },
              h('span', null, 'Prompt'),
              h('textarea', { className: 'sched-textarea', value: draft.prompt, onChange: (e) => setDraft({ ...draft, prompt: e.target.value }), placeholder: 'What should Pi do when this job fires?', rows: 6 })
            ),
            h('div', { className: 'sched-form-actions' },
              h('button', { type: 'submit', className: 'sched-btn primary', disabled: state.loading }, editing ? 'Save changes' : 'Add schedule'),
              h('button', { type: 'button', className: 'sched-btn', onClick: closeModal }, 'Cancel')
            )
          )
        )
      )
    ) : null
  );
}

function JobCard({ React, job, busy, expanded, onToggleExpanded, onRun, onEdit, onToggleEnabled, onDelete }) {
  const h = React.createElement;
  const prompt = job.prompt || '';
  const isLong = isLongPrompt(prompt);
  const clamp = isLong && !expanded;

  return h('li', { className: `sched-card ${job.enabled ? '' : 'disabled'}` },
    h('div', { className: 'sched-card-top' },
      h('div', { className: 'sched-card-identity' },
        h('div', { className: 'sched-card-title' },
          h('strong', null, job.name),
          h('code', { className: 'sched-cron' }, job.schedule)
        ),
        h('div', { className: 'sched-meta' },
          h('div', { className: 'sched-meta-item' }, h('span', { className: 'sched-meta-k' }, 'dir'), h('span', { className: 'sched-meta-v' }, job.cwd)),
          h('div', { className: 'sched-meta-item' }, h('span', { className: 'sched-meta-k' }, 'next'), h('span', { className: 'sched-meta-v' }, job.enabled ? formatTime(job.nextRun) : '—')),
          h('div', { className: 'sched-meta-item' }, h('span', { className: 'sched-meta-k' }, 'last'), h('span', { className: 'sched-meta-v' }, formatTime(job.lastRun)))
        )
      ),
      h('div', { className: 'sched-card-actions' },
        h('button', { type: 'button', className: 'sched-btn sm', onClick: onRun, disabled: busy, title: 'Run now (spawn a session)' }, busy ? 'Running…' : 'Run now'),
        h('button', { type: 'button', className: 'sched-btn sm', onClick: onEdit, disabled: busy }, 'Edit'),
        h('input', { type: 'checkbox', className: 'sched-switch', checked: job.enabled, disabled: busy, onChange: onToggleEnabled, title: job.enabled ? 'Disable' : 'Enable', 'aria-label': job.enabled ? 'Disable job' : 'Enable job' }),
        h('button', { type: 'button', className: 'sched-btn sm danger', onClick: onDelete, disabled: busy }, 'Delete')
      )
    ),
    h('div', { className: 'sched-prompt-wrap' },
      h('div', { className: 'sched-prompt-label' }, 'Prompt'),
      h('div', { className: `sched-prompt ${clamp ? 'clamped' : ''} ${prompt ? '' : 'empty'}` }, prompt || 'No prompt text'),
      isLong ? h('button', { type: 'button', className: 'sched-prompt-toggle', onClick: onToggleExpanded }, expanded ? 'Show less' : 'Show more') : null
    ),
    job.scheduleError ? h('div', { role: 'alert', className: 'sched-card-err' }, job.scheduleError) : null
  );
}

function ReloadIcon({ React }) {
  return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
    React.createElement('path', { d: 'M21 12a9 9 0 1 1-3-6.7' }),
    React.createElement('path', { d: 'M21 4v5h-5' })
  );
}

// Decide whether a prompt is long enough to warrant a collapse/expand toggle.
// Kept tiny + pure so it can be unit-tested without a DOM. Cards default to a
// 2-line clamp; anything past ~2 lines / 120 chars gets a "Show more" toggle.
export function isLongPrompt(prompt) {
  const text = prompt == null ? '' : String(prompt);
  return text.length > 120 || text.split('\n').length > 2;
}

export function createScheduleApi(hostApi) {
  if (hostApi.cron) return hostApi.cron;
  if (!hostApi.request) return null;
  return {
    list: () => hostApi.request('/api/cron'),
    create: (input) => hostApi.request('/api/cron', { method: 'POST', body: input }),
    update: (id, patch) => hostApi.request(`/api/cron/${encodeURIComponent(id)}`, { method: 'POST', body: patch }),
    delete: async (id) => { await hostApi.request(`/api/cron/${encodeURIComponent(id)}/delete`, { method: 'POST', body: {} }); },
    runNow: (id) => hostApi.request(`/api/cron/${encodeURIComponent(id)}/run`, { method: 'POST', body: {} }),
  };
}

export function formatTime(value) {
  if (value === null || value === undefined) return 'never';
  try { return new Date(value).toLocaleString(); } catch { return String(value); }
}

export const __test = { SchedulePanel, JobCard, STYLE_ID };
