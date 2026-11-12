# Café Aurora — Memoria del Proyecto

## Estado actual
Sitio web estático de Café Aurora creado y listo para revisión en la rama `qa/cafe-aurora`.

## Archivos entregados
| Archivo | Descripción |
|---|---|
| `index.html` | Estructura HTML semántica (343 líneas) |
| `styles.css` | Estilos con temas claro/oscuro y diseño responsivo (830+ líneas) |
| `app.js` | Lógica de tema, menú móvil y accesibilidad (211 líneas) |

## Requisitos implementados
- **Diseño responsivo**: grid CSS fluido, breakpoints para mobile/tablet/desktop
- **Modo oscuro/claro**: CSS custom properties + toggle JS con persistencia en localStorage; fallback `prefers-color-scheme` para no-JS
- **Menú móvil**: botón hamburger con animación a ×, aria-expanded, cierre por clic externo / tecla Escape
- **6 productos con precios CLP**:
  1. Espresso Clásico — $1.500
  2. Cappuccino Aurora — $2.800
  3. Latte de Vainilla — $3.200
  4. Americano Negro — $2.200
  5. Mocha Intenso — $3.500
  6. Cold Brew Suave — $3.800
- **Accesibilidad**:
  - Skip link al contenido principal
  - `lang="es"` en `<html>`
  - Roles ARIA (`banner`, `main`, `contentinfo`, `list`, `article`)
  - `aria-label`, `aria-expanded`, `aria-hidden`, `aria-current`, `aria-pressed`
  - `focus-visible` con outline de alto contraste
  - `prefers-reduced-motion` respetado en CSS y JS
  - `forced-colors` media query para Windows High Contrast
  - Textos alternativos y aria-label en precios CLP
  - Navegación activa con IntersectionObserver

## Tecnologías
- HTML5 semántico sin frameworks
- CSS3 con custom properties (sin preprocesadores)
- JavaScript vanilla ES6+ (sin dependencias)
- Google Fonts: Playfair Display + Inter (cargadas desde CDN)

## Rama y PR
- **Rama de trabajo**: `qa/cafe-aurora`
- **Target**: `main`
- **Repositorio**: `Guillermo-forcast/QA-Test-Orquesta`
- **PR #1**: https://github.com/Guillermo-forcast/QA-Test-Orquesta/pull/1
- **Commit principal**: `336f70c` — `feat: add Café Aurora static website`

## Historial de cambios
| Fecha | Acción |
|---|---|
| 2025-11-12 | Creación inicial de index.html, styles.css, app.js |
| 2025-11-12 | Verificación de accesibilidad y fallback CSS para prefers-color-scheme |
| 2025-11-12 | Apertura de PR #1 hacia main desde qa/cafe-aurora |
| 2025-11-12 | Actualización de .orquesta/MEMORY.md con resumen completo del proyecto |
