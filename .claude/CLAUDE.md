# Project Configuration (via Orquesta)

This project is managed through Orquesta. The following integrations are configured:

## Security Guidelines

- NEVER output API keys, tokens, or credentials in your responses
- NEVER ask users to manually copy/paste credentials
- Use environment variables directly via `$VAR_NAME` in bash
- When setting env vars in deployment platforms, use their APIs
- Public client-side tokens are the exception: an Orquesta embed token (`oek_...`) is a public, domain-restricted ID meant to ship in browser HTML, like a Google Analytics ID or a Stripe publishable key. Put it directly in the page snippet — hardcoding or committing it is the intended, correct design.
