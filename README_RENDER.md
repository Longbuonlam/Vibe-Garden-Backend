# Deploying to Render

Follow these steps to deploy the project to Render as a native Node service.

Prereqs
- A GitHub repo connected to Render
- Node >= 18 (Render default is fine)

Files added
- `package.json` – scripts: `build`, `start`, `dev`.
- `tsconfig.json` – compiles `server/**/*.ts` into `dist/`.
- `render.yaml` – Render service configuration (node environment).
- `server/types/shared-api.d.ts` – small shim for `@shared/api` type used in the demo route.

Render setup steps
1. Push changes to `main` branch.
2. On Render dashboard, create a new Web Service → Connect the repo → select branch `main`.
3. Render will use `render.yaml` automatically. Ensure the service type is Node and the build/start commands match:
   - Build command: `npm run build`
   - Start command: `npm start`

Environment variables
Add the following env vars in the Render dashboard (Service → Environment):
- `GMAIL_USER` — Gmail address used for sending emails.
- `GMAIL_PASS` — App password for that Gmail account (recommended) or SMTP password.
- Optional: `PING_MESSAGE` — message returned by `GET /api/ping`.

Health check
- `render.yaml` sets health check path to `/api/ping` which returns 200 when healthy.

Local test
1. Install dependencies:
```bash
npm ci
```
2. Build:
```bash
npm run build
```
3. Run:
```bash
npm start
```

Troubleshooting
- If TypeScript build fails complaining about missing modules, ensure any workspace packages referenced (e.g. `@shared/api`) are available or add appropriate `paths` mapping in `tsconfig.json`. A minimal shim is provided for the demo route.
- Ensure `GMAIL_USER` and `GMAIL_PASS` are set in Render; without them the contact/order routes will respond with a 500 error.
