<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Nexlane motion and visual refresh (2026-11-05)

- Status: design and motion pass is complete across shared site chrome and all routes. Nexlane logo is integrated; Magic UI MCP is enabled in OpenCode config; Ponytail 5.3.3 plugin is installed.
- Current direction: preserve Nexlane's navy/blue/cyan palette and truthful existing copy; add restrained, useful interaction and scroll motion with reduced-motion support.
- Verification: `npm run build` and `npm run lint` pass; local homepage responds at `http://localhost:3000/`; desktop and phone-size previews reviewed.
- Resume only for requested design changes. Ponytail hooks and Magic UI MCP tools are available after restarting Codex/OpenCode.
