# Orquesta Embed SDK Skill

This skill helps you install and configure the Orquesta Embed SDK in any web project.

## IMPORTANT: Token is Already Available

When running through Orquesta, the embed token is **already injected** into your environment as:

```
ORQUESTA_EMBED_TOKEN=oek_xxxxx
```

You do NOT need to ask the user for this token. It's automatically available via `process.env.ORQUESTA_EMBED_TOKEN`.

When configuring the embed in code, use:
- **Next.js**: Copy the value to `.env.local` as `NEXT_PUBLIC_ORQUESTA_EMBED_TOKEN`
- **Vite**: Copy to `.env` as `VITE_ORQUESTA_EMBED_TOKEN`
- **Server-side**: Use `process.env.ORQUESTA_EMBED_TOKEN` directly

## CRITICAL: CDN-only distribution

The Orquesta Embed SDK is distributed **exclusively via CDN** at `https://orquesta.live/embed/v1/`.
There is **no npm package** — do not run `npm install orquesta-embed` and do not add it to `package.json`.
The same script tag works in plain HTML, Next.js, Vite, React, Vue, WordPress, Shopify, etc.

The SDK connects **directly to orquesta.live** - CORS is enabled on the backend.

**DO NOT:**
- Install `orquesta-embed` from npm (it is not published)
- Create API routes or proxy endpoints
- Create custom fetch calls to validate tokens

The SDK handles everything automatically.

## What is Orquesta Embed?

Orquesta Embed is a widget that adds a floating panel to any website, allowing users to:
- Submit prompts directly to the Orquesta agent
- See real-time execution output
- Right-click elements to prompt about them
- Auto-capture console logs and network errors
- View prompt history (timeline)
- Check deployment status

## Environment Variable

The embed token should be stored in an environment variable:

```
NEXT_PUBLIC_ORQUESTA_EMBED_TOKEN=oek_xxxxx
# or for non-Next.js projects:
VITE_ORQUESTA_EMBED_TOKEN=oek_xxxxx
REACT_APP_ORQUESTA_EMBED_TOKEN=oek_xxxxx
ORQUESTA_EMBED_TOKEN=oek_xxxxx
```

**IMPORTANT**: The token prefix is `oek_` (Orquesta Embed Key), not `oat_` (which is for agent tokens).

## Installation (CDN)

Add the script and stylesheet to your page. That's it — no build step, no package install.

```html
<link rel="stylesheet" href="https://orquesta.live/embed/v1/orquesta.css">
<script src="https://orquesta.live/embed/v1/orquesta.min.js"></script>
<script>
  Orquesta.init({
    token: 'oek_xxxxx', // Your embed token
    position: 'bottom-right',
    captureConsole: true,
    captureNetwork: true
  })
</script>
```

### Next.js App Router

Use the `next/script` component in your root layout so the CDN script loads once across every route.

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="https://orquesta.live/embed/v1/orquesta.css" />
      </head>
      <body>
        {children}
        <Script
          src="https://orquesta.live/embed/v1/orquesta.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            // @ts-ignore
            window.Orquesta.init({
              token: process.env.NEXT_PUBLIC_ORQUESTA_EMBED_TOKEN,
              position: 'bottom-right',
              captureConsole: true,
              captureNetwork: true,
            })
          }}
        />
      </body>
    </html>
  )
}
```

### Vite / Create React App / Vue / Svelte

Add the `<link>` and `<script>` tags directly to `index.html`, or load them dynamically from a
component's `useEffect` / `onMount` hook. The global `window.Orquesta` object is available once
the script finishes loading.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | string | required | Your Orquesta embed token (oek_xxx) |
| `position` | string | 'bottom-right' | Panel position: 'bottom-right', 'bottom-left', 'top-right', 'top-left' |
| `defaultOpen` | boolean | false | Whether panel starts open |
| `theme` | string | 'dark' | Theme: 'dark', 'light', 'auto' |
| `captureConsole` | boolean | true | Auto-capture console.log/error |
| `captureNetwork` | boolean | true | Auto-capture failed network requests |
| `hotkey` | string | 'ctrl+shift+o' | Keyboard shortcut to toggle panel |
| `mode` | string | 'widget' | `'widget'` (floating panel) or `'builder'` (full-screen IDE) |
| `features` | string[] | all | Features to enable: 'prompts', 'timeline', 'deployments', 'elements', 'captures' |

## Features

### Element Selection
Users can right-click any element on the page and select "Prompt about this" to automatically include the element's context (selector, tag, text content) in their prompt.

### Console Capture
When enabled, the widget captures `console.log`, `console.warn`, `console.error`, and unhandled exceptions. Users can include recent logs in their prompts.

### Network Capture
When enabled, the widget intercepts `fetch` and `XMLHttpRequest` to capture failed requests (4xx, 5xx errors). Users can include these errors in prompts for debugging.

### Timeline
Shows history of prompts submitted through the embed, with status and timestamps.

### Deployments
Shows current deployment status from Vercel (if integrated).

## Programmatic API

```javascript
const widget = Orquesta.init({ token: 'oek_xxxxx' })

// Control the widget
widget.open()
widget.close()
widget.toggle()

// Switch between widget and builder modes
widget.setMode('builder')

// Start element selection mode
widget.startElementSelection()

// Submit a prompt programmatically
widget.submitPrompt('Fix this bug', {
  includeConsole: true,
  includeNetwork: true
})

// Destroy the widget
widget.destroy()
```

## Generating Embed Tokens

Embed tokens are generated from the Orquesta dashboard:
1. Go to your project
2. Click the "Embed" tab
3. Go to "Tokens" section
4. Click "Generate Token"
5. Copy the token (shown only once!)

**Auto-added to Environment Variables**: When you generate a token, it's automatically added to your project's environment variables as `ORQUESTA_EMBED_TOKEN`. The local agent can access this through the project credentials.

Tokens can have domain restrictions to limit which websites can use them.

## Updating

CDN files at `orquesta.live/embed/v1/` are updated automatically whenever the Orquesta team
ships a new version. There is nothing to install, upgrade, or rebuild on your side.

If you're not seeing the latest features:
- Hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R) to bypass cache
- Redeploy your site to clear CDN / edge caches
- Check browser DevTools Network tab to verify `orquesta.min.js` and `orquesta.css` are loading

## Troubleshooting

### Widget not appearing
- Check that the token is valid and not revoked
- Ensure the CSS `<link>` tag is present alongside the `<script>` tag
- Check browser console for errors
- Verify `window.Orquesta` exists after the script loads

### CORS errors
- Embed tokens can have domain restrictions — make sure your domain is allowed
- The embed connects to orquesta.live — ensure it's not blocked by a firewall or CSP

### Console/Network capture not working
- Make sure `captureConsole: true` and `captureNetwork: true` are set
- The captures must be initialized before other code runs (add the script early in `<head>` or use `strategy="beforeInteractive"` in Next.js)

### Old version showing after update
- Hard refresh with Ctrl+Shift+R / Cmd+Shift+R
- Redeploy your site to clear edge caches
- Inspect the loaded script URL in DevTools Network tab to confirm it's `v1/orquesta.min.js`
