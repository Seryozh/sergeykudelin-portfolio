# Machine entry point

Read `manifest.json` first and follow its `readOrder` exactly. The design system is locked at the version shown in the manifest.

Use `components.json` as the public visual vocabulary. Use `tokens.json` and `motion.json` rather than adding raw design values. Use `acceptance.json` as the handoff audit.

New cases are content-only additions under `content.flows`. Choose one of the closed EvidencePlate variants, and keep the linked evidence record public-safe. The validator includes non-rendered workflow and source-image fixtures so those extension paths cannot silently break.

The implementation on `/` is a living specimen with placeholder content. It is authoritative for combined feel, flow, motion, and responsive composition. Placeholder text is not approved portfolio copy.

Run:

```bash
npm run validate:design
npm run typecheck
npm run lint
npm run build
```

If a change requires a new visual pattern, follow the extension sequence in `../AGENTS.md` and increment the design-system version.
