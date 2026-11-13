/**
 * Café Aurora — app.js
 * Handles: theme toggle, mobile menu, accessibility, footer year.
 */

(function () {
  'use strict';

  /* ── Helpers ── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ════════════════════════════════════
     1. THEME TOGGLE
     Persists user preference in localStorage.
     Respects prefers-color-scheme as the initial default.
  ════════════════════════════════════ */
  const THEME_KEY    = 'cafe-aurora-theme';
  const html         = document.documentElement;
  const themeToggle  = qs('#theme-toggle');

  /**
   * Apply a theme ('light' | 'dark') to the document and update the button's
   * aria-label and aria-pressed attributes.
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }
  }

  /**
   * Determine the initial theme:
   * 1. User's stored preference, if any.
   * 2. OS/browser preference via prefers-color-scheme.
   * 3. Fallback: light.
   */
  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Apply theme immediately (before first paint if possible).
  applyTheme(getInitialTheme());

  // Toggle on button click.
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Sync if the user changes the OS preference while the page is open.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only follow OS change if the user has no stored preference.
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* ════════════════════════════════════
     2. MOBILE MENU
     Toggles visibility and manages ARIA attributes correctly.
     Closes on: outside click, Escape key, nav-link click.
  ════════════════════════════════════ */
  const hamburger  = qs('#hamburger');
  const mobileMenu = qs('#mobile-menu');

  function openMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú de navegación');
    mobileMenu.setAttribute('aria-hidden', 'false');
    // Move focus to the first menu link for keyboard users.
    const firstLink = qs('a', mobileMenu);
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  function isMenuOpen() {
    return hamburger && hamburger.getAttribute('aria-expanded') === 'true';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      isMenuOpen() ? closeMenu() : openMenu();
    });
  }

  // Close when a nav link inside the mobile menu is clicked.
  qsa('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      if (hamburger) hamburger.focus(); // Return focus to the trigger.
    }
  });

  // Close when clicking outside the header.
  document.addEventListener('click', (e) => {
    if (!isMenuOpen()) return;
    const header = qs('.site-header');
    if (header && !header.contains(e.target)) {
      closeMenu();
    }
  });

  // Close mobile menu when the viewport grows beyond mobile breakpoint.
  if (window.matchMedia) {
    const mq = window.matchMedia('(min-width: 769px)');
    mq.addEventListener('change', (e) => {
      if (e.matches && isMenuOpen()) closeMenu();
    });
  }

  /* ════════════════════════════════════
     3. SMOOTH SCROLL — close mobile menu
     For nav links that target an anchor on the same page.
  ════════════════════════════════════ */
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId  = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = qs(targetId);
      if (!targetEl) return;

      // If reduced-motion is set, skip smooth-scroll and jump.
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        e.preventDefault();
        // Account for sticky header height.
        const headerH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
          10
        ) || 68;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });

        // Move focus to the target section for screen readers.
        if (!targetEl.hasAttribute('tabindex')) {
          targetEl.setAttribute('tabindex', '-1');
        }
        targetEl.focus({ preventScroll: true });
      }

      closeMenu();
    });
  });

  /* ════════════════════════════════════
     4. FOOTER — dynamic year
  ════════════════════════════════════ */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ════════════════════════════════════
     5. ACTIVE NAV LINK — highlight on scroll
     Uses IntersectionObserver when available.
  ════════════════════════════════════ */
  if ('IntersectionObserver' in window) {
    const sections  = qsa('main section[id]');
    const navLinks  = qsa('.nav-link, .mobile-nav-link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('nav-link--active', matches);
            link.setAttribute('aria-current', matches ? 'page' : 'false');
          });
        });
      },
      {
        rootMargin: `-${68}px 0px -60% 0px`,
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

})();
