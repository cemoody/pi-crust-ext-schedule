# @cemoody/pi-crust-ext-schedule

Cron-scheduled prompts for pi-crust, with a sidebar activity view.

**Provides:** the `/api/cron` REST surface + a sidebar activity view (`web.mjs`) for managing recurring prompts

## Install

```bash
npm install @cemoody/pi-crust-ext-schedule
```

Or use [`pi-crust-full`](https://www.npmjs.com/package/pi-crust-full), which installs this together with [`pi-crust`](https://www.npmjs.com/package/pi-crust) and the other official extensions:

```bash
npx pi-crust-full
```

## What it is

This is an official extension for [pi-crust](https://github.com/cemoody/pi-crust) — the self-hosted web control plane for [pi.dev](https://pi.dev/) coding-agent sessions. Pi-crust discovers any installed package whose `package.json` carries a `piRemoteControl` (or `piCrust`) field, so dropping this package into `node_modules` is enough — no configuration required.

See the [pi-crust extensions docs](https://github.com/cemoody/pi-crust/tree/main/extensions) for the extension API and worked examples.

## License

MIT.
