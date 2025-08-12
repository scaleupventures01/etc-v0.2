# Security Evidence — 2.1.1.4 Auth: Email/Password

- Dependency scan (npm audit): `evidence/npm-audit.json` — no vulnerabilities (High/Critical: 0)
- SBOM (CycloneDX JSON): `evidence/sbom.json`
- Secrets scan (gitleaks): `evidence/gitleaks.json` — no leaks found
- SAST: (placeholder) — add semgrep report path here if executed

Notes
- Cookie flags: `HttpOnly; SameSite=Lax; Secure` (Secure enabled in production)
- Lockout/backoff: 5 failed attempts → 5 minute lockout
