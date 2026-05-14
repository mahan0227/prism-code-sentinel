# Prism Code Sentinel

A **security- and correctness-biased** code review assistant: headline verdict, ranked findings with exploit sketches where relevant, tests to add, and refactor hints—returned as JSON.

## What it is

A BYOK Next.js microtool for **pre-merge** or **pre-pen-test** triage. It is not a replacement for SAST/DAST or human review; it compresses “what should we look at first?” into a structured report.

## Why it’s useful

- Surfaces **threat-shaped thinking** (authn/z, injection, unsafe deserialization) alongside correctness.
- Proposes **concrete tests** so fixes stick.
- Calibrates severity and admits **unknowns** when code context is incomplete.
- Works on snippets from GitHub, paste from IDE, or log excerpts.

## Where you can use it

- **AppSec champions** in squads without dedicated reviewers every sprint.
- **Startups** before a SOC2 / customer security questionnaire cycle.
- **Open-source maintainers** triaging drive-by PRs.
- **Education** — teaching secure design patterns with suggested test names.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run start
```

## API

`POST /api/review` · Header `Authorization: Bearer <key>`

Body: `code` (required), optional `language`, `focus`, `model`.

## Suite brochure

[`docs/neuron-suite-brochure.html`](docs/neuron-suite-brochure.html) · [`docs/neuron-suite-ig-square.svg`](docs/neuron-suite-ig-square.svg)

## License

MIT
