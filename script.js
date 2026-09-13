(() => {
  'use strict';

  const doc = document;
  const win = window;
  const reduceMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = win.matchMedia('(min-width: 768px)');
  const finePointer = win.matchMedia('(pointer: fine)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const qs = (selector, root = doc) => root.querySelector(selector);
  const qsa = (selector, root = doc) => Array.from(root.querySelectorAll(selector));

  function onReady(callback) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
  }

  function initPreloader() {
    const loader = qs('.preloader');
    if (!loader) return;

    let seen = false;
    try { seen = sessionStorage.getItem('lucy-liu-preloader') === 'seen'; } catch (_) { /* Storage may be blocked. */ }
    if (seen || reduceMotion.matches) {
      loader.hidden = true;
      loader.remove();
      return;
    }

    loader.setAttribute('aria-hidden', 'true');
    doc.documentElement.classList.add('is-loading');
    const panels = qsa('.preloader-panel', loader);
    const counter = qs('[data-loader-progress], [data-preloader-count], .preloader-count, .preloader-percent', loader);
    const word = qs('[data-preloader-word], .preloader-word, .preloader-label', loader);
    const started = performance.now();
    const duration = 760;

    function count(now) {
      const progress = clamp((now - started) / duration, 0, 1);
      if (counter) counter.textContent = `${Math.round(progress * 100)}%`;
      if (progress < 1) win.requestAnimationFrame(count);
    }
    win.requestAnimationFrame(count);

    win.setTimeout(() => {
      counter?.classList.add('is-hidden');
      word?.classList.add('is-hidden');
      panels.forEach((panel, index) => {
        win.setTimeout(() => panel.classList.add('is-open'), index * 65);
      });
      loader.classList.add('is-leaving');
      loader.classList.add('is-done');
    }, 820);

    win.setTimeout(() => {
      loader.remove();
      doc.documentElement.classList.remove('is-loading');
      try { sessionStorage.setItem('lucy-liu-preloader', 'seen'); } catch (_) { /* Storage may be blocked. */ }
    }, 1800);
  }

  function initNavigation() {
    const header = qs('.site-header');
    const shell = qs('.nav-shell', header || doc);
    let toggle = qs('.mobile-menu-toggle', header || doc);
    let menu = qs('.mobile-menu', header || doc);
    const progress = qs('.scroll-progress');
    const unifiedProjectHeader = doc.body.matches('.case-page, .web-case-page, .projects-gallery-page');

    if (header && shell && unifiedProjectHeader) {
      const desktopNav = qs('.nav-links', shell);
      if (desktopNav && !qs('[data-lang-toggle]', desktopNav)) {
        const language = doc.createElement('button');
        language.className = 'lang-toggle nav-lang-toggle';
        language.type = 'button';
        language.dataset.langToggle = '';
        language.setAttribute('aria-label', 'Switch language');
        language.textContent = 'EN / 中文';
        desktopNav.appendChild(language);
      }
      if (!toggle) {
        toggle = doc.createElement('button');
        toggle.className = 'menu-toggle mobile-menu-toggle';
        toggle.type = 'button';
        toggle.dataset.menuToggle = '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'mobile-menu');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.innerHTML = '<span></span><span></span>';
        shell.appendChild(toggle);
      }
      if (!menu) {
        menu = doc.createElement('div');
        menu.className = 'mobile-menu';
        menu.id = 'mobile-menu';
        menu.dataset.mobileMenu = '';
        menu.setAttribute('aria-hidden', 'true');
        menu.innerHTML = '<a href="index.html#work">Work</a><a href="index.html#playground">AI Visual Experiments</a><a href="about.html">About</a><a href="resume/Xin_Liu_Resume_Product_Design.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><button class="lang-toggle mobile-lang-toggle" type="button" data-lang-toggle aria-label="Switch language">EN / 中文</button>';
        header.appendChild(menu);
      } else if (!qs('[data-lang-toggle]', menu)) {
        const language = doc.createElement('button');
        language.className = 'lang-toggle mobile-lang-toggle';
        language.type = 'button';
        language.dataset.langToggle = '';
        language.setAttribute('aria-label', 'Switch language');
        language.textContent = 'EN / 中文';
        const meta = qs('.mobile-menu__meta', menu);
        menu.insertBefore(language, meta || null);
      }
      let socials = qs('.nav-socials', header);
      if (!socials) {
        socials = doc.createElement('div');
        socials.className = 'nav-socials';
        shell.insertBefore(socials, toggle || null);
      }
      if (!qs('a[href*="linkedin.com"]', socials)) {
        const linkedin = doc.createElement('a');
        linkedin.className = 'icon-link';
        linkedin.href = 'https://www.linkedin.com/in/xinliu2001';
        linkedin.target = '_blank';
        linkedin.rel = 'noreferrer';
        linkedin.setAttribute('aria-label', 'Lucy Xin Liu on LinkedIn');
        linkedin.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 8.1H3.3V19h3.3V8.1ZM5 3A2 2 0 1 0 5 7a2 2 0 0 0 0-4Zm7 5.1H8.8V19H12v-5.4c0-1.4.3-2.8 2-2.8 1.8 0 1.8 1.7 1.8 2.9V19h3.3v-6c0-3-1-5.2-4.1-5.2-1.5 0-2.6.8-3 1.6V8.1Z"/></svg>';
        socials.appendChild(linkedin);
      }
      if (!qs('a[href^="mailto:"]', socials)) {
        const email = doc.createElement('a');
        email.className = 'icon-link gmail-icon';
        email.href = 'mailto:liuxin20011206@gmail.com';
        email.setAttribute('aria-label', 'Email Lucy Xin Liu with Gmail');
        email.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285f4" d="M3 18.5h3.2V9.2L3 6.8z"/><path fill="#34a853" d="M17.8 18.5H21V6.8l-3.2 2.4z"/><path fill="#fbbc04" d="M3 6.8l3.2 2.4L12 13.5l5.8-4.3L21 6.8V5.5c0-1.4-1.6-2.2-2.7-1.4L12 8.8 5.7 4.1C4.6 3.3 3 4.1 3 5.5z"/><path fill="#ea4335" d="M6.2 9.2V18.5H9V11.3L6.2 9.2zm8.8 2.1v7.2h2.8V9.2z"/></svg>';
        socials.appendChild(email);
      }
      if (menu && !qs('.mobile-menu__meta', menu)) {
        const mobileMeta = doc.createElement('div');
        mobileMeta.className = 'mobile-menu__meta';
        mobileMeta.innerHTML = '<a href="https://www.linkedin.com/in/xinliu2001" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="mailto:liuxin20011206@gmail.com">Email</a>';
        menu.appendChild(mobileMeta);
      }
    }

    const closeMenu = () => {
      if (!toggle || !menu) return;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', doc.documentElement.lang.startsWith('zh') ? '打开菜单' : 'Open menu');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('is-open');
      header?.classList.remove('menu-open');
    };

    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const opening = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(opening));
        const isChinese = doc.documentElement.lang.startsWith('zh');
        toggle.setAttribute('aria-label', opening ? (isChinese ? '关闭菜单' : 'Close menu') : (isChinese ? '打开菜单' : 'Open menu'));
        menu.setAttribute('aria-hidden', String(!opening));
        menu.classList.toggle('is-open', opening);
        header?.classList.toggle('menu-open', opening);
      });
      qsa('a', menu).forEach((link) => link.addEventListener('click', closeMenu));
      doc.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
      doc.addEventListener('click', (event) => {
        if (menu.classList.contains('is-open') && !header?.contains(event.target)) closeMenu();
      });
    }

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const y = win.scrollY || doc.documentElement.scrollTop;
      const max = Math.max(1, doc.documentElement.scrollHeight - win.innerHeight);
      const ratio = clamp(y / max, 0, 1);
      header?.classList.remove('is-compact', 'show-three-dot', 'is-scrolled');
      shell?.classList.remove('is-compact');
      if (unifiedProjectHeader) {
        const hero = qs('.case-hero, .web-case-hero, .projects-gallery-hero');
        const trigger = hero ? Math.min(560, hero.offsetHeight * 0.55) : 240;
        header?.classList.toggle('case-scrolled', y > trigger);
      }
      if (progress) {
        progress.style.setProperty('--scroll-progress', String(ratio));
        progress.style.transformOrigin = 'left center';
        progress.style.transform = `scaleX(${ratio})`;
        progress.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
      }
    };
    const requestUpdate = () => {
      if (!scheduled) {
        scheduled = true;
        win.requestAnimationFrame(update);
      }
    };
    win.addEventListener('scroll', requestUpdate, { passive: true });
    win.addEventListener('resize', requestUpdate, { passive: true });
    update();
  }

  function initHeroCanvas() {
    const canvas = qs('#hero-canvas');
    if (!canvas || reduceMotion.matches) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const hero = canvas.closest('.hero') || canvas.parentElement;
    const palette = ['#f7b7d2', '#b7a7ff', '#8be6dc', '#ffd07c', '#89b9ff'];
    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    const pointer = { x: 0.5, y: 0.45, active: false };
    let particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, win.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.round((width * height) / 18000), 28, 92);
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: 1.2 + Math.random() * 3.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0006,
        color: palette[index % palette.length]
      }));
    };

    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      pointer.active = true;
    };
    hero?.addEventListener('pointermove', move, { passive: true });
    hero?.addEventListener('pointerleave', () => { pointer.active = false; });

    const draw = (time) => {
      if (!visible) { frame = 0; return; }
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      particles.forEach((particle) => {
        const waveX = Math.sin(time * particle.speed + particle.phase) * 14;
        const waveY = Math.cos(time * particle.speed * 0.8 + particle.phase) * 11;
        const targetX = particle.baseX + waveX + (pointer.x - 0.5) * (pointer.active ? 34 : 9);
        const targetY = particle.baseY + waveY + (pointer.y - 0.5) * (pointer.active ? 28 : 7);
        particle.x += (targetX - particle.x) * 0.025;
        particle.y += (targetY - particle.y) * 0.025;
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 5);
        gradient.addColorStop(0, `${particle.color}a8`);
        gradient.addColorStop(0.3, `${particle.color}50`);
        gradient.addColorStop(1, `${particle.color}00`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        context.fill();
      });
      context.globalCompositeOperation = 'source-over';
      frame = win.requestAnimationFrame(draw);
    };

    const observer = 'IntersectionObserver' in win ? new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !frame) frame = win.requestAnimationFrame(draw);
      else if (!visible && frame) win.cancelAnimationFrame(frame);
    }) : null;
    observer?.observe(canvas);
    win.addEventListener('resize', resize, { passive: true });
    resize();
    frame = win.requestAnimationFrame(draw);
  }

  function initImageTrail() {
    const layer = qs('.trail-layer');
    const hero = layer?.closest('.hero') || qs('.hero');
    if (!layer || !hero || reduceMotion.matches || !finePointer.matches) return;
    const sources = [
      'images/lucy/geeellink-cover-optimized.jpg',
      'images/lucy/case-studies/geeellink/hifi/home.png',
      'images/lucy/case-studies/geeellink/hifi/storyboard.png',
      'images/lucy/case-studies/geeellink/hifi/script-planning.png',
      'images/lucy/case-studies/geeellink/hifi/video-generation.png',
      'images/lucy/case-studies/geeellink/hifi/final-edit.png',
      'images/lucy/case-studies/ide/ide-desktop-home.png',
      'images/lucy/case-studies/ide/ide-desktop-services.png',
      'images/lucy/case-studies/ourjourneyman/ourjourneyman-mockup.png',
      'images/lucy/case-studies/ourjourneyman/client-discover.png',
      'images/lucy/case-studies/ourjourneyman/client-review.png',
      'images/lucy/case-studies/ourjourneyman/artisan-workspace.png',
      'images/lucy/case-studies/ourjourneyman/artisan-alternatives.png',
      'images/lucy/case-studies/ourjourneyman/iterations/01/before.png',
      'images/lucy/case-studies/ourjourneyman/iterations/01/after.png',
      'images/lucy/case-studies/snapbudget/snapbudget-mockup.jpg',
      'images/lucy/case-studies/snapbudget/hifi/dashboard.png',
      'images/lucy/case-studies/snapbudget/hifi/entry-methods.png',
      'images/lucy/case-studies/snapbudget/hifi/voice-entry.png',
      'images/lucy/case-studies/snapbudget/hifi/review-confirm.png',
      'images/lucy/case-studies/snapbudget/user-journey.png',
      'images/lucy/case-studies/snapbudget/research-brainstorm.png',
      'images/lucy/case-studies/hiyogurt/hiyogurt-campaign-cover.png',
      'images/lucy/case-studies/hiyogurt/source/audience-positioning.png',
      'images/lucy/case-studies/hiyogurt/source/campaign-concept.png',
      'images/lucy/case-studies/hiyogurt/source/strategy-direction.png',
      'images/lucy/about/diary-aurora.jpg',
      'images/lucy/about/diary-canyon.jpg',
      'images/lucy/about/diary-cat.jpg',
      'images/lucy/about/diary-forest-window.jpg',
      'images/lucy/about/diary-mountain.jpg',
      'images/lucy/about/diary-orca.jpg',
      'images/lucy/about/diary-reflection.jpg',
      'images/lucy/about/diary-sea-lions.jpg',
      'images/lucy/about/baking-cake.jpg',
      'images/lucy/about/crochet-basket.jpg',
      'images/lucy/about/puzzle-carnival.jpg',
      'images/lucy/about/sewing-bag-front.jpg',
      'images/lucy/beyond/blood-rose.jpg',
      'images/lucy/beyond/time-travel-horizontal.jpg',
      'images/lucy/beyond/folded-screenprints.jpg',
      'images/lucy/beyond/lanterns-one.jpg',
      'images/lucy/beyond/fish-sculpture.jpg',
      'images/lucy/beyond/jellyfish-sculpture-vertical.jpg',
      'images/lucy/drawing/cozy-animals.jpg',
      'images/lucy/drawing/fish-glory.jpg',
      'images/lucy/drawing/garden-path.jpg',
      'images/lucy/drawing/moon-gate.jpg',
      'images/lucy/drawing/waterfront.jpg',
      'images/lucy/posters/01-blueberry-tart.png',
      'images/lucy/posters/03.png',
      'images/lucy/posters/05.png',
      'images/lucy/posters/07-purple-donut.png',
      'images/lucy/ai-posters/time-poster.png',
      'images/lucy/ai-posters/imax-poster.png'
    ];
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let imageIndex = 0;
    let imageDeck = [];
    const tiles = [];

    const refillDeck = () => {
      imageDeck = [...sources];
      for (let index = imageDeck.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [imageDeck[index], imageDeck[swapIndex]] = [imageDeck[swapIndex], imageDeck[index]];
      }
    };
    refillDeck();

    const spawn = (event) => {
      const now = performance.now();
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (now - lastTime < 75 || distance < 36) return;
      lastTime = now;
      lastX = event.clientX;
      lastY = event.clientY;
      const rect = layer.getBoundingClientRect();
      const tile = doc.createElement('img');
      if (imageIndex >= imageDeck.length) {
        imageIndex = 0;
        refillDeck();
      }
      tile.src = imageDeck[imageIndex++];
      tile.alt = '';
      tile.className = 'trail-image trail-tile';
      tile.setAttribute('aria-hidden', 'true');
      tile.addEventListener('load', () => {
        const ratio = tile.naturalWidth / tile.naturalHeight;
        if (ratio < 0.82) tile.classList.add('is-portrait');
        else if (ratio < 1.18) tile.classList.add('is-square');
        else if (ratio > 1.65) tile.classList.add('is-wide');
      }, { once: true });
      tile.style.left = `${event.clientX - rect.left}px`;
      tile.style.top = `${event.clientY - rect.top}px`;
      tile.style.setProperty('--rotation', `${(Math.random() - 0.5) * 12}deg`);
      layer.appendChild(tile);
      tiles.push(tile);
      win.requestAnimationFrame(() => tile.classList.add('is-visible'));
      win.setTimeout(() => tile.classList.add('is-fading'), 420);
      win.setTimeout(() => {
        tile.remove();
        const index = tiles.indexOf(tile);
        if (index >= 0) tiles.splice(index, 1);
      }, 900);
      while (tiles.length > 8) tiles.shift()?.remove();
    };
    hero.addEventListener('pointermove', spawn, { passive: true });
  }

  function initAudienceTabs() {
    const section = qs('#about');
    const tabs = qsa('.audience-tabs [data-audience]', section || doc);
    const copy = qs('#audience-copy', section || doc);
    if (!tabs.length || !copy) return;
    const audienceCopy = {
      en: {
        anyone: "I’m Lucy — an AI Product Designer who turns complex workflows into clear, controllable, and trustworthy human experiences.",
        recruiters: "I work across research, product strategy, interaction design, and validation — translating ambiguity into evidence, decisions, and product direction.",
        'product-designers': "I care about the invisible structure behind an interface: hierarchy, system states, feedback, and the moments that help people understand and guide AI.",
        designers: "I care about the invisible structure behind an interface: hierarchy, system states, feedback, and the moments that help people understand and guide AI.",
        teams: "I make complex product decisions visible through workflow maps, prototypes, testable states, and clear documentation that product and engineering teams can act on."
      },
      zh: {
        anyone: '我是 Lucy，一名 AI 产品设计师。我擅长将复杂工作流程梳理成清晰、可控且值得信任的体验。',
        recruiters: '我贯穿用户研究、产品策略、交互设计与验证，将模糊问题转化为可靠证据、清晰决策与可执行的产品方向。',
        'product-designers': '我关注界面背后不易被看见的结构：信息层级、系统状态、反馈，以及帮助人们理解并掌控 AI 的关键时刻。',
        designers: '我关注界面背后不易被看见的结构：信息层级、系统状态、反馈，以及帮助人们理解并掌控 AI 的关键时刻。',
        teams: '我通过工作流地图、原型、可测试状态与清晰文档，让复杂的产品决策变得可见，帮助产品与工程团队高效推进。'
      }
    };

    let transitionTimer = 0;
    const activate = (tab, immediate = false) => {
      const key = (tab.dataset.audience || tab.textContent || '').trim().toLowerCase().replace(/\s+/g, '-');
      const language = doc.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.classList.toggle('is-active', selected);
        item.tabIndex = selected ? 0 : -1;
      });
      copy.classList.add('is-changing');
      win.clearTimeout(transitionTimer);
      transitionTimer = win.setTimeout(() => {
        copy.textContent = audienceCopy[language][key] || audienceCopy[language].anyone;
        copy.classList.remove('is-changing');
      }, immediate || reduceMotion.matches ? 0 : 170);
    };

    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        activate(tabs[next]);
      });
    });
    doc.addEventListener('portfolio-language-change', () => {
      const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
      activate(selected, true);
    });
    activate(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
  }

  function initFeaturedWork() {
    const section = qs('#work');
    if (!section) return;
    const image = qs('[data-featured-image]', section);
    const mockup = qs('[data-featured-mockup]', section);
    const mockupPrimary = qs('[data-mockup-primary]', section);
    const mockupSecondary = qs('[data-mockup-secondary]', section);
    const mockupTertiary = qs('[data-mockup-tertiary]', section);
    const mockupLabel = qs('[data-mockup-label]', section);
    const title = qs('[data-featured-title]', section);
    const description = qs('[data-featured-description]', section);
    const count = qs('[data-featured-count]', section);
    const link = qs('[data-featured-link]', section);
    const stage = qs('[data-featured-stage]', section);
    const tabs = qsa('[data-featured-tab]', section);
    const prev = qs('[data-featured-prev]', section);
    const next = qs('[data-featured-next]', section);
    if (!image && !mockup && !title && !tabs.length) return;
    const fallbackSlides = [
      { label: 'First Movers', title: 'AI Learning Platform', description: 'Designed personalized learning journeys and AI-powered experiences for professional education.', image: 'images/cs/first-mover/00-1gxmw8jD2K7expU4lIEX7iJjY04.png', href: '#first-movers' },
      { label: 'FosterHealth AI', title: 'AI Healthcare Learning Product', description: 'An approachable AI learning experience that helps foster-care teams build knowledge and confidence.', image: 'images/sw-fosterhealth.png', href: '#fosterhealth' },
      { label: 'Sourcing', title: 'Crypto Wallet Experience', description: 'A clearer, more human wallet experience for discovering, understanding, and managing digital assets.', image: 'images/sw-crypto.png', href: '#sourcing' },
      { label: 'Salona', title: 'Beauty-Service Experience', description: 'A warm, streamlined booking journey connecting clients with beauty services that fit their needs.', image: 'images/sw-salona.png', href: '#salona' }
    ];
    const slides = (tabs.length ? tabs : fallbackSlides).map((tabOrFallback, slideIndex) => {
      const tab = tabs.length ? tabOrFallback : null;
      const fallback = fallbackSlides[slideIndex % fallbackSlides.length];
      if (!tab) return tabOrFallback;
      return {
        label: tab.textContent.trim() || fallback.label,
        title: tab.dataset.title || fallback.title,
        description: tab.dataset.description || fallback.description,
        image: tab.dataset.image || fallback.image,
        mockup: tab.dataset.mockup || '',
        primary: tab.dataset.primary || tab.dataset.image || fallback.image,
        secondary: tab.dataset.secondary || tab.dataset.image || fallback.image,
        tertiary: tab.dataset.tertiary || tab.dataset.image || fallback.image,
        primaryFallback: tab.dataset.primaryFallback || '',
        secondaryFallback: tab.dataset.secondaryFallback || '',
        tertiaryFallback: tab.dataset.tertiaryFallback || '',
        primaryRemote: tab.dataset.primaryRemote || '',
        secondaryRemote: tab.dataset.secondaryRemote || '',
        tertiaryRemote: tab.dataset.tertiaryRemote || '',
        mockupLabel: tab.dataset.mockupLabel || tab.textContent.trim(),
        alt: tab.dataset.alt || tab.dataset.title || fallback.title,
        href: tab.dataset.link || fallback.href
      };
    });
    let index = 0;
    let transitionTimer = 0;
    let autoplayTimer = 0;
    let autoplayPaused = false;
    const featuredChinese = {
      'Designing control into AI video production': '为 AI 视频制作建立清晰可控的工作流',
      'Designing trust into custom furniture commissions': '为定制家具委托建立透明与信任',
      'Designing a clearer digital home for an education consultancy': '为教育咨询机构打造清晰可信的数字门户',
      'Reducing the friction of everyday expense logging': '降低日常记账的操作负担',
      'Building a clearer digital acquisition strategy': '构建更清晰的数字获客策略',
      'Geeelink · Production workspace': '极灵 · 制作工作台',
      'OurJourneyMan · Two-sided service': 'OurJourneyMan · 双边服务体验',
      'iDE · Education company website': 'iDE · 教育机构网站',
      'SnapBudget · High-fidelity prototype': 'SnapBudget · 高保真原型',
      'Hi Yogurt · Acquisition strategy': 'Hi Yogurt · 获客策略',
      '4-month product design internship · 9 internal user interviews · 3 real-project workflow tests · High-fidelity interface shipped': '4 个月产品设计实习 · 9 次内部真实用户访谈 · 3 轮真实项目工作流测试 · 高保真界面已上线',
      '12-week course project · Dual-sided service flow, interaction design, usability testing, and a reusable Figma component system.': '12 周课程项目 · 双边服务流程、交互设计、可用性测试与可复用 Figma 组件系统。',
      '2-month commissioned website for iDriveCareer Canada Consulting Ltd. · Three-person team · Team lead and UI designer': '为 iDriveCareer Canada Consulting Ltd. 完成的 2 个月委托项目 · 3 人团队 · 团队负责人兼 UI 设计师',
      '12-week, five-person course project · Team lead · 10 interviews · 10 usability sessions · Instructor score 93/100': '12 周五人课程项目 · 团队负责人 · 10 次访谈 · 10 次可用性测试 · 课程成绩 93/100',
      '4-week team strategy project · Funnel diagnosis, channel roles, seasonal campaign direction, and a phased roadmap.': '4 周团队策略项目 · 漏斗诊断、渠道定位、季节性活动方向与分阶段路线图。'
    };
    const carousel = qs('[data-work-carousel]', section);
    const progress = qs('.carousel-progress', section);

    const render = (nextIndex, immediate = false) => {
      index = (nextIndex + slides.length) % slides.length;
      const slide = slides[index];
      const nodes = [stage, image, mockup, title, description].filter(Boolean);
      nodes.forEach((node) => node.classList.add('is-changing'));
      win.clearTimeout(transitionTimer);
      transitionTimer = win.setTimeout(() => {
        if (image) { image.src = slide.image; image.alt = slide.alt || slide.title; }
        if (mockup) {
          mockup.className = `featured-mockup is-${slide.mockup || 'geeellink'}`;
          if (!reduceMotion.matches) {
            void mockup.offsetWidth;
            mockup.classList.add('is-entering');
          }
        }
        const setMockupImage = (node, source, fallbackSource, remoteSource) => {
          if (!node) return;
          node.onerror = fallbackSource ? () => { node.onerror = null; node.src = fallbackSource; } : null;
          node.src = source;
          if (remoteSource) {
            const remote = new Image();
            remote.onload = () => { if (slides[index] === slide) node.src = remoteSource; };
            remote.src = remoteSource;
          }
        };
        setMockupImage(mockupPrimary, slide.primary, slide.primaryFallback, slide.primaryRemote);
        setMockupImage(mockupSecondary, slide.secondary, slide.secondaryFallback, slide.secondaryRemote);
        setMockupImage(mockupTertiary, slide.tertiary, slide.tertiaryFallback, slide.tertiaryRemote);
        const isChinese = doc.documentElement.lang.startsWith('zh');
        if (mockupLabel) mockupLabel.textContent = isChinese ? (featuredChinese[slide.mockupLabel] || slide.mockupLabel) : slide.mockupLabel;
        if (title) title.textContent = isChinese ? (featuredChinese[slide.title] || slide.title) : slide.title;
        if (description) description.textContent = isChinese ? (featuredChinese[slide.description] || slide.description) : slide.description;
        if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        if (link) { link.href = slide.href; link.setAttribute('aria-label', `View ${slide.label}: ${slide.title}`); }
        tabs.forEach((tab, tabIndex) => {
          const selected = tabIndex === index;
          tab.classList.toggle('is-active', selected);
          tab.setAttribute('aria-selected', String(selected));
          tab.setAttribute('aria-label', `${String(tabIndex + 1).padStart(2, '0')}: ${slides[tabIndex].label}`);
        });
        win.requestAnimationFrame(() => nodes.forEach((node) => node.classList.remove('is-changing')));
      }, immediate || reduceMotion.matches ? 0 : 250);
    };
    doc.addEventListener('portfolio-language-change', () => render(index, true));
    const stopAutoplay = () => {
      win.clearTimeout(autoplayTimer);
      progress?.classList.remove('is-playing');
    };
    const scheduleAutoplay = () => {
      stopAutoplay();
      if (autoplayPaused || reduceMotion.matches || doc.hidden) return;
      if (progress) {
        void progress.offsetWidth;
        progress.classList.add('is-playing');
      }
      autoplayTimer = win.setTimeout(() => {
        render(index + 1);
        scheduleAutoplay();
      }, 3000);
    };
    const select = (nextIndex) => { render(nextIndex); scheduleAutoplay(); };
    tabs.forEach((tab, tabIndex) => tab.addEventListener('click', () => select(tabIndex)));
    prev?.addEventListener('click', () => select(index - 1));
    next?.addEventListener('click', () => select(index + 1));
    carousel?.addEventListener('pointerenter', () => { autoplayPaused = true; stopAutoplay(); });
    carousel?.addEventListener('pointerleave', () => { autoplayPaused = false; scheduleAutoplay(); });
    carousel?.addEventListener('focusin', () => { autoplayPaused = true; stopAutoplay(); });
    carousel?.addEventListener('focusout', (event) => {
      if (carousel.contains(event.relatedTarget)) return;
      autoplayPaused = false;
      scheduleAutoplay();
    });
    doc.addEventListener('visibilitychange', scheduleAutoplay);
    render(0, true);
    scheduleAutoplay();
  }

  function initPlayground() {
    const section = qs('#playground');
    const sticky = qs('.playground__sticky', section || doc);
    const track = qs('.playground-track', section || doc);
    if (!section || !sticky || !track) return;
    const horizontalViewport = win.matchMedia('(min-width: 600px)');
    let offset = 0;
    let maxOffset = 0;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;

    const apply = (nextOffset) => {
      offset = clamp(nextOffset, 0, maxOffset);
      track.style.transform = `translate3d(${-offset}px,0,0)`;
      section.style.setProperty('--playground-progress', String(maxOffset ? offset / maxOffset : 0));
    };

    const measure = () => {
      const endPadding = Number.parseFloat(win.getComputedStyle(track).paddingRight) || 0;
      maxOffset = Math.max(0, track.scrollWidth - win.innerWidth - endPadding);
      if (!horizontalViewport.matches || reduceMotion.matches) {
        section.style.height = '';
        section.style.minHeight = '';
        track.style.transform = '';
        return;
      }
      section.style.height = `${sticky.offsetHeight}px`;
      section.style.minHeight = '0';
      apply(offset);
    };

    section.addEventListener('wheel', (event) => {
      if (!horizontalViewport.matches || reduceMotion.matches || maxOffset <= 0) return;
      const rect = section.getBoundingClientRect();
      const visibleThreshold = Math.min(sticky.clientHeight, win.innerHeight) * 0.5;
      const isPinned = rect.top <= 64 && rect.bottom >= visibleThreshold;
      if (!isPinned) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const nextOffset = clamp(offset + delta, 0, maxOffset);
      if (nextOffset === offset) return;
      event.preventDefault();
      apply(nextOffset);
    }, { passive: false });

    track.addEventListener('pointerdown', (event) => {
      if (!horizontalViewport.matches || reduceMotion.matches || event.button !== 0) return;
      if (event.target.closest('button, a')) return;
      dragging = true;
      startX = event.clientX;
      startOffset = offset;
      track.setPointerCapture?.(event.pointerId);
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      apply(startOffset - (event.clientX - startX));
    });
    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      track.releasePointerCapture?.(event.pointerId);
      track.classList.remove('is-dragging');
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    sticky.tabIndex = 0;
    sticky.addEventListener('keydown', (event) => {
      if (!horizontalViewport.matches || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const cardWidth = qs('.playground-card', track)?.getBoundingClientRect().width || win.innerWidth * 0.42;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? maxOffset : offset + (event.key === 'ArrowRight' ? cardWidth : -cardWidth);
      apply(next);
    });
    win.addEventListener('resize', measure, { passive: true });
    horizontalViewport.addEventListener?.('change', measure);
    measure();
  }

  function initWebPreview() {
    const section = qs('#creative');
    const preview = qs('#web-preview', section || doc);
    const rows = qsa('.web-row[data-preview]', section || doc);
    if (!section || !preview || !rows.length || !finePointer.matches) return;
    const image = qs('img', preview) || preview;
    let pointerX = win.innerWidth / 2;
    let pointerY = win.innerHeight / 2;
    let raf = 0;
    const position = () => {
      raf = 0;
      const rect = preview.getBoundingClientRect();
      const x = clamp(pointerX + 24, 12, win.innerWidth - rect.width - 12);
      const y = clamp(pointerY + 24, 12, win.innerHeight - rect.height - 12);
      preview.style.setProperty('--preview-x', `${x}px`);
      preview.style.setProperty('--preview-y', `${y}px`);
    };
    const move = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!raf) raf = win.requestAnimationFrame(position);
    };
    const show = (row) => {
      const source = row.dataset.preview;
      if (source && image instanceof HTMLImageElement) image.src = source;
      preview.classList.add('is-visible');
      row.classList.add('is-active');
      position();
    };
    const hide = (row) => {
      preview.classList.remove('is-visible');
      row?.classList.remove('is-active');
    };
    rows.forEach((row) => {
      row.addEventListener('pointerenter', (event) => { move(event); show(row); });
      row.addEventListener('pointermove', move, { passive: true });
      row.addEventListener('pointerleave', () => hide(row));
      row.addEventListener('focusin', () => show(row));
      row.addEventListener('focusout', () => hide(row));
    });
  }

  function initVisualGallery() {
    const gallery = qs('[data-visual-gallery]');
    const cards = qsa('[data-gallery-card]', gallery || doc);
    if (!gallery || cards.length < 2) return;
    let index = Math.max(0, cards.findIndex((card) => card.classList.contains('is-active')));
    let timer = 0;
    let paused = false;
    let dragging = false;
    let suppressClick = false;
    let startX = 0;

    const render = (nextIndex) => {
      index = (nextIndex + cards.length) % cards.length;
      cards.forEach((card, cardIndex) => {
        const delta = (cardIndex - index + cards.length) % cards.length;
        card.classList.toggle('is-active', delta === 0);
        card.classList.toggle('is-right', delta === 1);
        card.classList.toggle('is-left', delta === cards.length - 1);
        card.setAttribute('aria-hidden', String(delta !== 0));
        card.setAttribute('aria-pressed', String(delta === 0));
        card.tabIndex = delta === 0 ? 0 : -1;
      });
    };
    const stop = () => win.clearTimeout(timer);
    const schedule = () => {
      stop();
      if (paused || reduceMotion.matches || doc.hidden) return;
      timer = win.setTimeout(() => { render(index + 1); schedule(); }, 3000);
    };
    gallery.addEventListener('pointerenter', () => { paused = true; stop(); });
    gallery.addEventListener('pointerleave', () => { paused = false; dragging = false; gallery.classList.remove('is-dragging'); schedule(); });
    gallery.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      gallery.setPointerCapture?.(event.pointerId);
      gallery.classList.add('is-dragging');
    });
    gallery.addEventListener('pointerup', (event) => {
      if (!dragging) return;
      const distance = event.clientX - startX;
      const didSwipe = Math.abs(distance) > 42;
      dragging = false;
      gallery.releasePointerCapture?.(event.pointerId);
      gallery.classList.remove('is-dragging');
      if (didSwipe) {
        suppressClick = true;
        render(index + (distance < 0 ? 1 : -1));
        win.setTimeout(() => { suppressClick = false; }, 0);
      }
      schedule();
    });
    gallery.addEventListener('pointercancel', () => { dragging = false; gallery.classList.remove('is-dragging'); schedule(); });
    cards.forEach((card, cardIndex) => {
      card.addEventListener('click', () => {
        if (dragging || suppressClick || cardIndex === index) return;
        render(cardIndex);
        schedule();
      });
      card.addEventListener('keydown', (event) => {
        if (!['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        render(cardIndex);
        schedule();
      });
    });
    gallery.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      render(index + (event.key === 'ArrowRight' ? 1 : -1));
      schedule();
    });
    doc.addEventListener('visibilitychange', schedule);
    render(index);
    schedule();
  }

  function initPhotoDiary() {
    const diary = qs('[data-photo-diary]');
    const stage = qs('.photo-diary__stage', diary || doc);
    const image = qs('[data-diary-image]', diary || doc);
    const peek = qs('.photo-diary__peek img', diary || doc);
    const caption = qs('[data-diary-caption]', diary || doc);
    const count = qs('[data-diary-count]', diary || doc);
    const progress = qs('[data-diary-progress]', diary || doc);
    const thumbs = qsa('[data-diary-thumb]', diary || doc);
    if (!diary || !stage || !image || thumbs.length < 2) return;

    let index = 0;
    let timer = 0;
    let paused = false;
    let dragging = false;
    let startX = 0;

    const preload = (button) => {
      const source = button?.dataset.src;
      if (!source) return;
      const nextImage = new Image();
      nextImage.src = source;
    };
    const resetProgress = () => {
      if (!progress) return;
      progress.classList.remove('is-running');
      void progress.offsetWidth;
      if (!reduceMotion.matches && !paused) progress.classList.add('is-running');
    };
    const render = (nextIndex, immediate = false) => {
      index = (nextIndex + thumbs.length) % thumbs.length;
      const current = thumbs[index];
      const following = thumbs[(index + 1) % thumbs.length];
      const commit = () => {
        image.src = current.dataset.src || '';
        image.alt = current.dataset.alt || '';
        if (peek) peek.src = following.dataset.src || '';
        if (caption) caption.textContent = current.dataset.caption || '';
        if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(thumbs.length).padStart(2, '0')}`;
        thumbs.forEach((button, buttonIndex) => {
          const active = buttonIndex === index;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-selected', String(active));
          button.tabIndex = active ? 0 : -1;
        });
        stage.classList.remove('is-changing');
        preload(following);
        resetProgress();
      };
      if (immediate || reduceMotion.matches) commit();
      else {
        stage.classList.add('is-changing');
        win.setTimeout(commit, 220);
      }
    };
    const stop = () => win.clearTimeout(timer);
    const schedule = () => {
      stop();
      resetProgress();
      if (paused || reduceMotion.matches || doc.hidden) return;
      timer = win.setTimeout(() => { render(index + 1); schedule(); }, 5000);
    };
    const select = (nextIndex) => { render(nextIndex); schedule(); };

    thumbs.forEach((button, buttonIndex) => button.addEventListener('click', () => select(buttonIndex)));
    qs('[data-diary-prev]', diary)?.addEventListener('click', () => select(index - 1));
    qs('[data-diary-next]', diary)?.addEventListener('click', () => select(index + 1));
    stage.addEventListener('pointerenter', () => { paused = true; stop(); resetProgress(); });
    stage.addEventListener('pointerleave', () => { paused = false; dragging = false; schedule(); });
    stage.addEventListener('focusin', () => { paused = true; stop(); resetProgress(); });
    stage.addEventListener('focusout', () => { paused = false; schedule(); });
    stage.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener('pointerup', (event) => {
      if (!dragging) return;
      const distance = event.clientX - startX;
      dragging = false;
      stage.releasePointerCapture?.(event.pointerId);
      if (Math.abs(distance) > 48) select(index + (distance < 0 ? 1 : -1));
    });
    stage.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      select(index + (event.key === 'ArrowRight' ? 1 : -1));
    });
    doc.addEventListener('visibilitychange', schedule);
    render(0, true);
    schedule();
  }

  function initInterestJourney() {
    const journey = qs('[data-interest-journey]');
    const timeline = qs('[data-interest-timeline]', journey || doc);
    const progress = qs('[data-interest-progress]', journey || doc);
    const items = qsa('[data-interest-item]', journey || doc);
    if (!journey || !timeline || !items.length) return;

    if (reduceMotion.matches) {
      items.forEach((item) => item.classList.add('is-active'));
      timeline.style.setProperty('--interest-progress', '1');
    } else {
      const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
      }, { threshold: 0, rootMargin: '-38% 0px -38% 0px' });
      items.forEach((item) => itemObserver.observe(item));

      let scheduled = false;
      const updateProgress = () => {
        scheduled = false;
        const rect = timeline.getBoundingClientRect();
        const start = win.innerHeight * .55;
        const end = win.innerHeight * .25;
        const travel = Math.max(1, rect.height - start + end);
        const ratio = clamp((start - rect.top) / travel, 0, 1);
        timeline.style.setProperty('--interest-progress', String(ratio));
        progress?.setAttribute('data-progress', String(Math.round(ratio * 100)));
      };
      const requestProgress = () => {
        if (scheduled) return;
        scheduled = true;
        win.requestAnimationFrame(updateProgress);
      };
      win.addEventListener('scroll', requestProgress, { passive: true });
      win.addEventListener('resize', requestProgress, { passive: true });
      updateProgress();
    }

    qsa('[data-interest-gallery]', journey).forEach((gallery, galleryIndex) => {
      const images = qsa('.interest-gallery__stage img', gallery);
      const dots = qs('.interest-gallery__dots', gallery);
      if (images.length < 2 || !dots) return;
      let index = 0;
      let timer = 0;
      let paused = false;
      let visible = false;

      images.forEach((image, imageIndex) => {
        const button = doc.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Show image ${imageIndex + 1} of ${images.length}`);
        button.addEventListener('click', () => { render(imageIndex); schedule(); });
        dots.appendChild(button);
      });
      const buttons = qsa('button', dots);
      const render = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        images.forEach((image, imageIndex) => image.classList.toggle('is-active', imageIndex === index));
        buttons.forEach((button, buttonIndex) => {
          const active = buttonIndex === index;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-current', active ? 'true' : 'false');
        });
      };
      const stop = () => win.clearTimeout(timer);
      const schedule = () => {
        stop();
        if (paused || !visible || reduceMotion.matches || doc.hidden) return;
        timer = win.setTimeout(() => { render(index + 1); schedule(); }, 4000 + galleryIndex * 180);
      };
      gallery.addEventListener('pointerenter', () => { paused = true; stop(); });
      gallery.addEventListener('pointerleave', () => { paused = false; schedule(); });
      gallery.addEventListener('focusin', () => { paused = true; stop(); });
      gallery.addEventListener('focusout', () => { paused = false; schedule(); });
      gallery.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        render(index + 1);
        schedule();
      });
      gallery.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        render(index + (event.key === 'ArrowRight' ? 1 : -1));
        schedule();
      });
      if ('IntersectionObserver' in win) {
        const galleryObserver = new IntersectionObserver(([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          if (visible) schedule(); else stop();
        }, { threshold: .25 });
        galleryObserver.observe(gallery);
      } else { visible = true; }
      doc.addEventListener('visibilitychange', schedule);
      render(0);
      schedule();
    });
  }

  function initPosterGallery() {
    qsa('[data-poster-gallery]').forEach((gallery) => {
    const galleryName = gallery.dataset.posterGallery;
    const openButton = qs(`[data-poster-gallery-open="${galleryName}"]`);
    const viewport = qs('[data-poster-gallery-viewport]', gallery);
    const images = qsa('.poster-gallery__viewport img', gallery);
    const count = qs('[data-poster-gallery-count]', gallery);
    const caption = qs('[data-poster-gallery-caption]', gallery);
    const progress = qs('[data-poster-gallery-progress]', gallery);
    if (!openButton || !viewport || !images.length) return;
    doc.body.appendChild(gallery);

    let index = 0;
    let timer = 0;
    let closeTimer = 0;
    let lastFocus = null;

    const stop = () => win.clearTimeout(timer);
    const restartProgress = () => {
      if (!progress) return;
      progress.classList.remove('is-running');
      void progress.offsetWidth;
      if (!reduceMotion.matches && gallery.classList.contains('is-open') && !doc.hidden) progress.classList.add('is-running');
    };
    const schedule = () => {
      stop();
      restartProgress();
      if (reduceMotion.matches || !gallery.classList.contains('is-open') || doc.hidden) return;
      timer = win.setTimeout(() => { render(index + 1); schedule(); }, 3000);
    };
    const render = (nextIndex, immediate = false) => {
      const previous = images[index];
      index = (nextIndex + images.length) % images.length;
      const next = images[index];
      if (previous !== next && !immediate && !reduceMotion.matches) previous.classList.add('is-leaving');
      images.forEach((image) => image.classList.toggle('is-active', image === next));
      win.setTimeout(() => previous?.classList.remove('is-leaving'), reduceMotion.matches ? 0 : 740);
      if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
      if (caption) caption.textContent = next.dataset.caption || next.alt || '';
    };
    const open = () => {
      win.clearTimeout(closeTimer);
      lastFocus = doc.activeElement;
      gallery.hidden = false;
      doc.documentElement.style.overflow = 'hidden';
      render(0, true);
      win.requestAnimationFrame(() => {
        gallery.classList.add('is-open');
        viewport.focus({ preventScroll: true });
        schedule();
      });
    };
    const close = () => {
      stop();
      gallery.classList.remove('is-open');
      doc.documentElement.style.overflow = '';
      closeTimer = win.setTimeout(() => { gallery.hidden = true; }, 450);
      lastFocus?.focus?.({ preventScroll: true });
    };
    const select = (nextIndex) => { render(nextIndex); schedule(); };

    openButton.addEventListener('click', open);
    qsa('[data-poster-gallery-close]', gallery).forEach((button) => button.addEventListener('click', close));
    qs('[data-poster-gallery-prev]', gallery)?.addEventListener('click', () => select(index - 1));
    qs('[data-poster-gallery-next]', gallery)?.addEventListener('click', () => select(index + 1));
    gallery.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); select(index - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); select(index + 1); }
    });
    doc.addEventListener('visibilitychange', schedule);
    });
  }

  function initArtworkLightbox() {
    const triggers = qsa('[data-artwork]');
    if (!triggers.length) return;
    const lightbox = doc.createElement('div');
    lightbox.className = 'art-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded artwork');
    lightbox.innerHTML = '<div class="art-lightbox__stage"><button type="button" aria-label="Close artwork">×</button><img alt=""><div><strong></strong><span></span></div></div>';
    doc.body.appendChild(lightbox);
    const image = qs('img', lightbox);
    const title = qs('strong', lightbox);
    const meta = qs('.art-lightbox__stage div span', lightbox);
    const closeButton = qs('button', lightbox);
    let returnFocus = null;

    const close = () => {
      lightbox.classList.remove('is-open');
      doc.body.classList.remove('lightbox-open');
      returnFocus?.focus?.();
    };
    const open = (trigger) => {
      returnFocus = trigger;
      if (image) { image.src = trigger.dataset.src || qs('img', trigger)?.src || ''; image.alt = qs('img', trigger)?.alt || ''; }
      if (title) title.textContent = trigger.dataset.title || '';
      if (meta) meta.textContent = trigger.dataset.meta || '';
      lightbox.classList.add('is-open');
      doc.body.classList.add('lightbox-open');
      closeButton?.focus();
    };
    triggers.forEach((trigger) => trigger.addEventListener('click', () => open(trigger)));
    closeButton?.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
    doc.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close(); });
  }

  function initPerformanceStage() {
    const section = qs('#performance');
    const stage = qs('.performance-stage', section || doc);
    if (!section || !stage) return;
    let offset = 0;
    let maxOffset = 0;
    let spacing = 340;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;

    const cards = qsa('.performance-card', stage);
    const measure = () => {
      if (!desktop.matches || reduceMotion.matches) {
        offset = 0;
        stage.style.removeProperty('--stage-shift');
        stage.style.transform = '';
        return;
      }
      const cardWidth = cards[0]?.getBoundingClientRect().width || 420;
      spacing = Math.max(320, cardWidth + 36);
      maxOffset = Math.max(0, (cards.length - 1) * spacing);
      offset = clamp(offset, 0, maxOffset);
      apply();
    };
    const apply = () => {
      stage.style.setProperty('--stage-shift', `${-offset}px`);
      cards.forEach((card, cardIndex) => {
        card.style.setProperty('--card-x', `${cardIndex * spacing - offset}px`);
        card.style.setProperty('--card-rotate', `${(cardIndex % 2 ? 1 : -1) * 1.2}deg`);
      });
    };
    stage.addEventListener('wheel', (event) => {
      if (!desktop.matches || reduceMotion.matches || maxOffset <= 0) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const next = clamp(offset + delta, 0, maxOffset);
      if (next === offset) return;
      event.preventDefault();
      offset = next;
      apply();
    }, { passive: false });
    stage.addEventListener('pointerdown', (event) => {
      if (!desktop.matches || reduceMotion.matches || event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startOffset = offset;
      stage.setPointerCapture?.(event.pointerId);
      stage.classList.add('is-dragging');
    });
    stage.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      offset = clamp(startOffset - (event.clientX - startX), 0, maxOffset);
      apply();
    });
    const end = (event) => {
      if (!dragging) return;
      dragging = false;
      stage.releasePointerCapture?.(event.pointerId);
      stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('keydown', (event) => {
      if (!desktop.matches || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') offset = 0;
      else if (event.key === 'End') offset = maxOffset;
      else offset = clamp(offset + (event.key === 'ArrowRight' ? spacing : -spacing), 0, maxOffset);
      apply();
    });
    win.addEventListener('resize', measure, { passive: true });
    measure();
  }

  function initReveal() {
    const items = qsa('.reveal');
    if (!items.length) return;
    if (reduceMotion.matches || !('IntersectionObserver' in win)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function initProcessAnimation() {
    const process = qs('[data-process]');
    const steps = qsa('[data-process-step]', process || doc);
    if (!process || !steps.length) return;
    let hasPlayed = false;
    const duration = 3000;
    const completeThrough = (index) => {
      steps.forEach((step, stepNumber) => {
        step.classList.remove('is-active');
        step.classList.toggle('is-complete', stepNumber <= index);
      });
    };
    const playOnce = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      process.classList.add('is-process-visible');
      if (reduceMotion.matches) {
        completeThrough(steps.length - 1);
        process.classList.add('is-progress-complete');
        return;
      }
      completeThrough(0);
      process.classList.add('is-progress-running');
      steps.slice(1).forEach((_, index) => {
        win.setTimeout(() => completeThrough(index + 1), duration * (index + 1) / (steps.length - 1));
      });
      win.setTimeout(() => {
        process.classList.add('is-progress-complete');
        process.classList.remove('is-progress-running');
      }, duration);
    };
    if (!('IntersectionObserver' in win)) {
      playOnce();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      playOnce();
      observer.unobserve(process);
    }, { threshold: 0.32 });
    observer.observe(process);
  }

  function initFooterSpotlight() {
    const footer = qs('#contact');
    if (!footer || reduceMotion.matches || !finePointer.matches) return;
    footer.addEventListener('pointermove', (event) => {
      const rect = footer.getBoundingClientRect();
      footer.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
      footer.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
      footer.classList.add('spotlight-active');
    }, { passive: true });
    footer.addEventListener('pointerleave', () => footer.classList.remove('spotlight-active'));
  }

  function initContactWords() {
    const section = qs('#contact');
    const left = qs('.cta-word-left', section || doc);
    const right = qs('.cta-word-right', section || doc);
    if (!section || !left || !right) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduceMotion.matches) {
        left.style.transform = 'translate3d(0,0,0)';
        right.style.transform = 'translate3d(0,0,0)';
        section.classList.add('cta-words-complete');
        return;
      }
      const rect = section.getBoundingClientRect();
      const start = win.innerHeight * 1.15;
      const end = 0;
      const rawProgress = clamp((start - rect.top) / (start - end), 0, 1);
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      const distance = (1 - progress) * 120;
      left.style.transform = `translate3d(${-distance}%,0,0)`;
      right.style.transform = `translate3d(${distance}%,0,0)`;
      section.classList.toggle('cta-words-complete', progress >= 0.995);
    };
    const requestUpdate = () => {
      if (!frame) frame = win.requestAnimationFrame(update);
    };
    win.addEventListener('scroll', requestUpdate, { passive: true });
    win.addEventListener('resize', requestUpdate, { passive: true });
    reduceMotion.addEventListener?.('change', requestUpdate);
    update();
  }

  function initLanguageToggle() {
    let toggles = qsa('[data-lang-toggle]');
    if (!toggles.length) {
      qsa('.nav-links').forEach((nav) => {
        const toggle = doc.createElement('button');
        toggle.className = 'lang-toggle nav-lang-toggle';
        toggle.type = 'button';
        toggle.dataset.langToggle = '';
        toggle.setAttribute('aria-label', 'Switch language');
        toggle.textContent = 'EN / 中文';
        nav.appendChild(toggle);
      });
      toggles = qsa('[data-lang-toggle]');
    }
    if (!toggles.length) return;
    const english = {};
    qsa('[data-i18n]').forEach((node) => { english[node.dataset.i18n] = node.textContent; });
    const chinese = {
      heroEyebrow: 'AI 产品设计师 · 用户研究 · 系统思维',
      heroIntro: '多伦多 AI 产品设计师，专注于将复杂的 AI 工作流转化为清晰、可控、以人为本的产品体验。',
      education: '多伦多大学信息学硕士 — 用户体验设计',
      selectedWork: '查看精选项目 ↓',
      aboutMe: '关于我',
      proofTitle: '研究 → 定义 → 设计 → 验证',
      proofCopy: '我的工作横跨用户研究、产品策略、交互设计与验证，帮助用户更清楚地理解、引导和信任新兴技术。',
      workIntro: '这些精选项目呈现我在复杂 AI 工作流、双边服务平台、移动端自动化体验、真实客户网站与数字品牌策略中的设计能力。',
      playIntro: '一组持续更新的 AI 视觉实验：通过制作、测试与迭代，探索电影海报、编辑构图、图像系统与视觉叙事。',
      creativeCopy: '版画、雕塑与材料实验让我的视觉实践保持触觉，也训练我观察对比、重复、留白与每一道痕迹承载的意义。',
      visualCopy: '通过摄影、绘画和 AI 辅助实验，探索真实与想象中的世界如何被观察、构成和记忆。',
      storyTitle: '从视觉观察到复杂系统设计',
      storyIntro: '艺术与艺术史及 CCIT 的学习塑造了我的观察与表达方式。UX 设计让我将观察转化为产品，而 AI 系统实践让我学会为不确定性、控制与信任而设计。',
      aboutHeroEyebrow: '设计师 · 创作者 · 观察者',
      aboutHeroTitle: '我喜欢找到那块让一切严丝合缝的拼图。',
      aboutHeroCopy: '我是 Lucy，一名产品设计师。我既喜欢梳理复杂工作流，也喜欢研究缝纫图解，或沉浸在一本推理小说里。我在意细节如何彼此连接，也享受把不确定性慢慢变成清晰、有用、完整的东西。',
      aboutHeroMaking: '看看我做的东西 ↓',
      aboutHeroWork: '查看我的设计项目 ↗',
      aboutBeliefEyebrow: '让我安定下来的事',
      aboutBeliefTitle: '亲手制作，让忙碌的思绪有一个安静落脚的地方。',
      aboutBeliefCopy: '无论是拼合上千块拼图、把布料做成包、钩织一朵朵花，还是为喜欢的人烘焙，我享受的都是同一种感觉：许多微小决定，最终成为一个完整成品。',
      aboutMystery: '推理小说——因为循着线索接近真相，也是另一种理解世界的方式。',
      makingEyebrow: '亲手制作',
      makingTitle: '从零散片段，到一个完整成品。',
      puzzleTitle: '每一块都有唯一而精确的位置。',
      puzzleCopy: '我喜欢完整图案一点点浮现的过程。每块拼图的形状、方向、颜色和细节都必须被仔细观察，一幅大拼图才能最终完成。',
      sewingTitle: '看到、理解，然后亲手做出来。',
      sewingCopy: '当我看到喜欢的包包，第一反应常常是寻找图解，弄明白自己能否把它做出来。把一个参考变成手中真实的物件，会让我很有成就感。',
      crochetTitle: '柔软而重复的节奏，让其他声音慢下来。',
      crochetCopy: '烦躁时，摸到毛线并重复每一针，会让我逐渐平静。一圈变成一朵花，许多花最终变成完整的作品。',
      bakingTitle: '普通原料，变成可以分享的幸福。',
      bakingCopy: '我享受鸡蛋和面粉在手中变成温暖食物的过程。最幸福的时刻，是看到家人朋友吃到我做的东西时开心的表情。',
      diaryEyebrow: '影像日记',
      diaryTitle: '那些让我停下来多看一眼的瞬间。',
      diaryCopy: '旅行、动物、变化的光线，以及一路上偶然遇见的安静构图。',
      artLinkEyebrow: '屏幕之外',
      artLinkTitle: '艺术先教会我观察，设计再教会我组织。',
      artLinkCopy: '版画、雕塑与视觉研究都属于同一套实践：仔细观察、主动选择，并通过材料学习。',
      artLinkCta: '查看精选艺术作品 ↗',
      aboutHeroLabel: '关于我',
      aboutHeroGreeting: '嗨！谢谢你来这里看看',
      aboutHeroStatement: '我是 Lucy，一名由艺术、技术和长期动手创作经历共同塑造的产品设计师。我将用户研究、视觉创作、交互设计与代码结合，把复杂想法变成人们能够理解和使用的体验。',
      aboutScroll: '向下滚动',
      journeyKicker: '从亲手制作物件，到塑造数字体验',
      journeyTitle: '我走向设计的过程',
      journeyIntro: '我走进 UX 并非来自某个单一决定。它来自多年的手工创作、视觉文化学习、交互作品开发，以及希望自己创造的东西真正帮人解决问题。',
      journeyOneMeta: '深圳 → 温哥华',
      journeyOneTitle: '在动手制作中学习',
      journeyOneCopy: '我在深圳长大，高中时前往温哥华。缝纫、烘焙和手工制作让我很早就发现一个反复出现的偏好：我喜欢理解一件东西如何被做出来，再把零散部分组合成自己的完整作品。',
      journeyTwoMeta: '多伦多大学 + Sheridan College',
      journeyTwoTitle: '艺术与技术相遇',
      journeyTwoCopy: '艺术与艺术史专业通过版画、丝网印刷、铜版雕刻和橡皮章雕刻训练了我的视觉判断。同时，CCIT——传播、文化、信息与技术——让我接触到网页和游戏设计。看着一行行代码变成漂亮、可交互的页面，让我意识到技术也可以是创作材料。',
      journeyThreeTitle: '为人而设计',
      journeyThreeCopy: '2025 年，我在多伦多大学开始信息学硕士用户体验设计方向的学习。我的重心从创作具有表现力的作品，变成理解人们的需求、测试想法是否有效，以及设计能够减少真实阻力的界面。用户体验设计让我的视觉和技术背景获得了更明确的人本目的。',
      journeyFourTitle: '与 AI 一起构建',
      journeyFourCopy: '2026 年，随着 AI 辅助编程进入设计流程，我开始构建自己的实验项目。我借助自然语言协作编程，更快地把产品问题变成可运行原型，并在过程中理解 AI 如何帮助人、它在哪里需要更清晰的边界，以及设计师如何与实现保持紧密联系。',
      strengthsKicker: '这条路径让我能够带来什么',
      strengthsTitle: '三种实践，一种设计方式',
      strengthOneTitle: '视觉创作',
      strengthOneCopy: '艺术和版画训练我观察构图、材料、对比、节奏，以及小细节所承载的意义。',
      strengthOneLink: '查看屏幕之外的作品 ↗',
      strengthTwoTitle: '交互系统',
      strengthTwoCopy: '网页、游戏和界面设计让我学会把流程、状态、组件和反馈变成人们能够顺利理解和操作的体验。',
      strengthTwoLink: '查看 UI 系统案例 ↗',
      strengthThreeTitle: '以人为本的清晰度',
      strengthThreeCopy: 'UX 研究帮助我把人们说的和做的，转化为具体的产品决策、原型、测试和改进。',
      strengthThreeLink: '查看端到端 UX 案例 ↗',
      offscreenKicker: '离开 Figma 之后',
      offscreenTitle: '让我保持好奇的事',
      offscreenIntro: '我的兴趣与设计有着相同的节奏：观察细节，理解各个部分如何连接，再耐心地把它们塑造成完整的成果。',
      offscreenMakingTitle: '动手制作',
      offscreenMakingCopy: '缝纫、编织和烘焙让我享受把原材料变成实用、温暖且完整的东西。',
      offscreenPatternTitle: '寻找模式',
      offscreenPatternCopy: '拼图和推理小说让我循着线索、验证不同可能，并享受零散细节最终形成意义的时刻。',
      offscreenObservingTitle: '仔细观察',
      offscreenObservingCopy: '旅行、自然、动物和摄影提醒我多看一会儿，记住那些原本可能消失的安静瞬间。',
      journeyEnd: '我依然受到最初动手制作时的本能引导：理解各个部分，认真对待细节，并创造出能够作为一个整体顺利运作的东西。',
      journeyWorkLink: '看看这些特点如何出现在我的项目中 ↗',
      interestTitle: '我喜欢投入其中的事',
      interestIntro: '这些爱好看起来不同，却带给我相同的感受：深度投入、安静下来的内心，以及看着许多微小决定最终成为完整作品的满足感。',
      interestPuzzleTitle: '拼图 — 每一块都有它的位置',
      interestPuzzleCopy: '我喜欢完整图案一点点浮现的过程。每一块拼图都有精确的位置；方向、颜色和最小的细节都需要被考虑，大幅图案才能最终完成。',
      interestSewingTitle: '缝纫 — 看到、理解、亲手做出来',
      interestSewingCopy: '看到喜欢的包包时，我会立刻想去寻找图解，理解怎样自己把它做出来。我喜欢把一个参考转化成手中真实、实用的成品。',
      interestCrochetTitle: '钩织 — 让我平静下来的节奏',
      interestCrochetCopy: '烦躁时，摸到毛线并重复每一针会让我慢下来。材料本身让我安定：一个线圈成为一朵花，许多花最终成为完整的作品。',
      interestBakingTitle: '烘焙 — 原料变成关心',
      interestBakingCopy: '我享受鸡蛋、面粉和其他普通原料在手中变成温暖食物的过程。看到家人朋友品尝后露出开心的表情，是最让我幸福的部分。',
      interestTravelTitle: '旅行与摄影 — 学会多看一会儿',
      interestTravelCopy: '旅行、自然和小动物会提醒我更仔细地观察。我喜欢记录变化的光线、意外出现的构图，以及那些原本会消失的小瞬间。',
      interestMysteryTitle: '推理小说 — 循着线索接近真相',
      interestMysteryCopy: '我喜欢收集细小线索、检验不同可能，并逐渐解开真相的过程。当我沉浸在一本好的推理小说里，周围的世界会慢慢安静下来。',
      interestEnd: '无论是哪一种爱好，当双手和思绪完全投入、碎片开始彼此连接、完整形态逐渐出现时，我都会感到最快乐。',
      interestArtLink: '看看我在屏幕之外创作的作品 ↗'
    };
    const genericChinese = {
      'Work':'项目','AI Visual Experiments':'AI 视觉实验','About':'关于我','Résumé':'简历','Résumé ↗':'简历 ↗','Home':'首页','Projects':'作品','Menu':'导航','Connect':'联系','Email':'邮箱','Say hello':'和我聊聊','Back to top ↑':'返回顶部 ↑','Back to top':'返回顶部','Selected Case Studies':'精选案例','Selected Work · 2024–2026':'精选项目 · 2024–2026','View project ↗':'查看项目 ↗','View project':'查看项目','View Series':'查看系列','Always in progress':'持续探索中','Scroll →':'滑动浏览 →','Scroll to unpack the work ↓':'向下了解完整过程 ↓','Curious to see more?':'还想看看其他项目吗？','Open to Product Design and UX Design opportunities.':'期待产品设计与 UX 设计相关机会。','Open to Toronto and Shanghai.':'目前可在多伦多与上海寻找工作机会。','Let’s':'一起','Collaborate!':'合作吧！',
      'Film Poster Series':'电影海报系列','An AI-assisted exploration of cinematic composition, atmosphere, type hierarchy, and visual storytelling across two imagined films.':'借助 AI 探索电影构图、氛围、字体层级与视觉叙事，为两部虚构电影建立各自的世界。','Film Poster':'电影海报','AI Art Direction':'AI 艺术指导','Food Poster Series':'美食海报系列','A seven-poster study in food photography, Japanese editorial composition, color systems, and AI-assisted visual direction.':'一组七张的视觉练习，结合美食摄影、日式编辑构图、色彩系统与 AI 辅助视觉指导。','Poster Design':'海报设计','Art Direction':'艺术指导','Selected disciplines':'创作领域','A wider view of how I make—from responsive interfaces to printed matter and physical form. Hover to preview, then open a category to explore the work.':'从响应式界面到印刷与实体创作，这里收录了我更广泛的实践。悬停可预览，点击即可进入对应作品。','Web Design':'网页设计','App Design':'应用设计','Print Media':'印刷媒介','Sculpture':'雕塑','Drawing':'绘画','My Process':'我的设计过程','Understand':'理解','Frame':'定义','Design':'设计','Validate':'验证',
      'Designing control into AI video production':'为 AI 视频制作建立清晰可控的工作流','Designing trust into custom furniture commissions':'为定制家具委托建立透明与信任','Designing a clearer digital home for an education consultancy':'为教育咨询机构打造清晰可信的数字门户','Reducing the friction of everyday expense logging':'降低日常记账的操作负担','Building a clearer digital acquisition strategy':'构建更清晰的数字获客策略','Geeelink · Production workspace':'极灵 · 制作工作台','OurJourneyMan · Two-sided service':'OurJourneyMan · 双边服务体验','iDE · Education company website':'iDE · 教育机构网站','SnapBudget · High-fidelity prototype':'SnapBudget · 高保真原型','Hi Yogurt · Acquisition strategy':'Hi Yogurt · 获客策略',
      'AI VIDEO PRODUCTION WORKFLOW':'AI 视频制作工作流','Seven connected stages. One visible production state.':'七个相互衔接的阶段，一个始终清晰可见的制作状态。','DUAL-SIDED COMMISSION EXPERIENCE':'双边定制服务体验','One material decision, seen from both sides.':'同一个材料决策，让客户与工匠都能看清。','END-TO-END MOBILE UX':'端到端移动体验','Capture, confirm, and understand the change.':'快速记录、轻松确认，并看懂每一次变化。','DIGITAL ACQUISITION STRATEGY':'数字获客策略','Turning seasonal discovery into a connected path to store.':'把季节性兴趣转化为连贯的到店路径。',
      'What this project demonstrates':'这个项目体现了什么','Product definition':'产品定义','Requirements thinking':'需求思维','Cross-functional clarity':'跨职能协作','Validation':'验证','The challenge':'挑战','Research':'研究','Discovery':'洞察','Prototyping':'原型设计','Final design':'最终设计','Achievement':'成果','Testing to iteration':'从测试到迭代','UI system':'界面系统','Two-sided journey':'双边旅程','Evidence to iteration':'从证据到迭代','Usability sessions':'可用性测试','Key iterations':'关键迭代','Outcome':'成果','Reflection':'反思','Next: OurJourneyMan':'下一个：OurJourneyMan','Next: Hi Yogurt':'下一个：Hi Yogurt','Strategy + growth →':'策略与增长 →','UI + systems →':'界面与系统 →',
      'Responsive interfaces · 02 projects':'响应式界面 · 2 个项目','Product UI · 02 case studies':'产品界面 · 2 个案例','Printmaking · Poster design':'版画 · 海报设计','Mixed media · Material studies':'混合媒介 · 材料实验','Illustration · Observation':'插画 · 观察','Two responsive web products shaped around clear information architecture, purposeful visual systems, and real user journeys.':'两个响应式网页项目，以清晰的信息架构、有目的的视觉系统和真实用户路径为核心。','Two mobile product experiences built around real workflows, visible decisions, and usability-led iteration.':'两个移动端产品体验，围绕真实工作流、可见的决策过程与可用性测试驱动的迭代展开。','Screen print, intaglio, linocut, artist books, and poster systems—work where material, rhythm, and negative space carry the idea.':'丝网印刷、凹版、凸版、艺术家书与海报系统——让材料、节奏与留白共同承载想法。','Physical studies built through texture, suspension, repetition, and the expressive possibilities of ordinary materials.':'通过质感、悬挂、重复与日常材料的表现力展开的实体创作。','A growing collection of observational and botanical drawing focused on structure, line, and patient looking.':'持续积累的观察与植物绘画，关注结构、线条，以及耐心观看的过程。',
      'Education website · 2026':'教育机构网站 · 2026','AI production platform · 2026':'AI 制作平台 · 2026','Two-sided service app · 2026':'双边服务应用 · 2026','Personal finance app · 2025':'个人财务应用 · 2025','Screen printing · 2024':'丝网印刷 · 2024','Linocut · 2022':'凸版雕刻 · 2022','Intaglio · 2023':'凹版印刷 · 2023','Mixed-media sculpture':'混合媒介雕塑','Watercolor · Personal practice':'水彩 · 个人练习','Watercolor · Sketchbook':'水彩 · 速写本','Graphite · Observational drawing':'铅笔 · 观察绘画','Graphite · Architectural study':'铅笔 · 建筑研究','Watercolor Sketchbook':'水彩速写本','Cozy Animals':'温暖动物','Fish Glory':'鱼之荣耀','Garden Path':'园林小径','Waterfront':'滨水风景','Courtyard House':'庭院建筑','Moon Gate':'月洞门','Zodiac Accordion Booklet':'生肖折页册','Lantern Intaglio I':'灯笼主题凹版印刷 I','Lantern Intaglio II':'灯笼主题凹版印刷 II',
      'Visit the site ↗':'访问网站 ↗','Back to projects':'返回作品','Previous poster':'上一张海报','Next poster':'下一张海报','Close poster gallery':'关闭海报画廊','Close film poster gallery':'关闭电影海报画廊','AI Art Direction · Film Posters':'AI 艺术指导 · 电影海报','Poster Design · 2026':'海报设计 · 2026'
    };
    Object.assign(genericChinese, {
      'Skip to content':'跳到主要内容','LinkedIn ↗':'LinkedIn ↗','Scroll':'向下滚动','Intro':'简介','For anyone':'写给每一位访客','Recruiters':'招聘者','Product Designers':'产品设计师','PMs & Engineers':'产品经理与工程师',
      'Toronto-based AI Product Designer turning complex AI workflows into clear, controllable human experiences.':'坐标多伦多的 AI 产品设计师，致力于将复杂的 AI 工作流程转化为清晰、可控、以人为本的体验。','Master of Information — UX Design, University of Toronto':'多伦多大学信息学硕士 — UX 设计方向','AI Product Design':'AI 产品设计','UX Research':'用户研究','Complex Workflows':'复杂工作流','B2B Systems':'B2B 系统','Product Strategy':'产品策略','Interaction Design':'交互设计','Prototyping':'原型设计',
      'I’m Lucy — an AI Product Designer who turns complex workflows into clear, controllable, and trustworthy human experiences.':'我是 Lucy，一名 AI 产品设计师。我擅长将复杂工作流程梳理成清晰、可控且值得信任的体验。','Selected projects across AI production, service platforms, personal finance, and digital brand experience. Each case study focuses on a different design challenge.':'这些精选项目涵盖 AI 生产工作流、服务平台、个人财务与数字品牌体验，每个案例都聚焦一类不同的设计挑战。','ACQUISITION SYSTEM':'获客系统','Discover → Evaluate → Visit':'发现 → 了解 → 到店',
      'A working lab for AI-assisted products, prototypes, and visual systems—where I learn by making, testing, and iterating in public.':'这是一个持续更新的 AI 视觉实验集合：我在制作、测试和迭代中探索新的视觉表达。','Open the film poster series':'打开电影海报系列','Open the food poster series':'打开美食海报系列','02 projects · Responsive systems':'2 个项目 · 响应式系统','02 case studies · Product UI':'2 个案例 · 产品界面','Watercolor · Illustration':'水彩 · 插画','Understand the real system, frame the right problem, make decisions visible, and validate before assuming.':'理解真实系统，定义正确问题，让设计决策可见，并用验证取代假设。','A Little More About Me':'再多了解我一点','I enjoy designing systems and making things by hand.':'我喜欢设计系统，也喜欢亲手把想法做出来。','Outside product work, I sew, crochet, bake, read mystery novels, travel, and photograph small moments that make me stop and look.':'在产品设计之外，我喜欢缝纫、钩织、烘焙、阅读推理小说和旅行，也喜欢用镜头留住那些让我停下来多看一眼的瞬间。','Still making':'持续创作中','More is on the way.':'新的作品，正在路上。','I’m always experimenting, learning, and adding new work. Come back soon to see what takes shape next.':'我会持续实验、学习和更新作品。欢迎再回来看看，下一个想法会成长成什么模样。','© 2026 Lucy Xin Liu. All rights reserved.':'© 2026 Lucy Xin Liu。保留所有权利。',

      '← All work':'← 全部项目','Context':'项目背景','Evidence':'研究证据','My activities':'我的贡献','Output':'交付成果','Timeline & team':'周期与团队','Timeline & role':'周期与角色','Before':'优化前','After':'优化后','Previous poster':'上一张','Next poster':'下一张',
      'AI Product Design · Product Strategy · Internship Case':'AI 产品设计 · 产品策略 · 实习案例','Transforming a fragmented AI video-generation process into a trackable, reviewable, and editable production workflow.':'将碎片化的 AI 视频生成过程，设计成可追踪、可审核、可编辑的完整制作流程。','B2B AI video production workflow':'B2B AI 视频制作工作流','9 interviews · 3 workflow tests':'9 次访谈 · 3 轮工作流测试','Problem framing, workflow definition, requirements, interaction design, validation':'问题定义、工作流梳理、需求分析、交互设计与验证','Product workflow, high-fidelity UI system, interactive prototype':'产品工作流、高保真界面系统与交互原型',
      '01 · Workflow problem':'01 · 工作流问题','Generation was only one part of the job.':'生成，只是整个工作的一环。','Professional AI-video production requires teams to move across prompting, generation, asset selection, review, revision, and delivery. When those states are fragmented, people lose context and struggle to understand what changed.':'专业 AI 视频制作要经历提示词、生成、素材筛选、审核、修改和交付。当这些状态被分散在不同工具里，团队很容易丢失上下文，也难以追踪改了什么。','The product challenge was to make the whole production state visible, not simply add another generation control.':'这个项目的核心不是再加一个“生成”按钮，而是让整个制作状态变得可见。','Workflow model':'工作流模型','The interface treats AI video as a production chain, not a single prompt box.':'界面将 AI 视频视为一条生产链，而不是单一的提示词输入框。','Brief':'创意简报','Production plan':'制作计划','Script':'脚本','Assets':'素材','Storyboard':'分镜','Generate & edit':'生成与编辑',
      '02 · Research':'02 · 用户研究','Make hidden coordination work observable.':'让隐形的协作工作变得可见。','Professional interviews and workflow tests surfaced repeated needs around version awareness, review context, editable states, and hand-offs. I translated these observations into a shared workflow model the product and engineering teams could discuss.':'专业用户访谈与工作流测试反复指向版本识别、审核上下文、可编辑状态和交接问题。我将这些观察转化为产品与工程团队可以共同讨论的工作流模型。','Track where an output came from and which inputs shaped it.':'追踪每个输出的来源，以及影响它的输入。','Keep review comments connected to the exact version and state.':'让审核意见始终对应准确的版本与状态。','Make the next action clear without hiding system uncertainty.':'不隐藏系统不确定性，同时让下一步行动一目了然。','Public evidence boundary':'公开证据边界','Interview artifacts remain confidential; the public prototype shows how findings became product states.':'访谈原始材料保持保密；公开原型重点展示研究发现如何转化为产品状态。','REDACTED':'已隐去','Raw transcripts, client details, and production data are intentionally omitted. The screens preserve the decision logic: stage, source, review context, quality status, and next action.':'原始访谈、客户信息与制作数据已主动隐去；界面保留了关键决策逻辑：阶段、来源、审核上下文、质量状态与下一步行动。',
      '03 · Product direction':'03 · 产品方向','From isolated outputs to a controllable production system.':'从孤立的输出，走向可控的制作系统。','I defined the product around one persistent production model: each stage has an owner, completion state, review gate, version context, and explicit hand-off. The interface is the visible expression of that product logic—not the starting point.':'我围绕一个持续存在的制作模型定义产品：每个阶段都有负责人、完成状态、审核节点、版本上下文和明确交接。界面是这套产品逻辑的可视化表达，而不是起点。','Final high-fidelity system · Figma + working prototype':'最终高保真系统 · Figma + 可运行原型','Seven connected stages carry context from a creative brief to an editable final cut.':'七个连续阶段，将上下文从创意简报一直传递到可编辑的最终成片。','PRODUCT MODEL':'产品模型','One staged workflow':'一条分阶段工作流','Production plan, script, assets, storyboard, generation, and editing share one progress model.':'制作计划、脚本、素材、分镜、生成与编辑共用同一套进度模型。','CONTROL MODEL':'控制模型','Review before advancing':'审核后再进入下一阶段','Approval gates prevent unfinished work from silently moving downstream.':'审批节点防止未完成内容悄然流入下游。','AI MODEL':'AI 模型','Agent assists; user decides':'AI 辅助，用户决定','Quality findings and recommendations remain visible, reviewable, and dismissible.':'质量检查与建议始终可见、可审核，也可被用户拒绝。',
      '04 · Validation':'04 · 验证','Test the workflow, not just the screens.':'测试工作流，而不只是界面。','Three workflow tests and roughly twenty feedback items were used to refine terminology, state visibility, review hand-offs, and interaction priority. I then encoded the decisions in a working browser prototype so the sequence, edge cases, and review behavior could be tested—not merely viewed.':'我通过 3 轮工作流测试和约 20 条反馈，优化术语、状态可见性、审核交接与交互优先级。随后把这些决策实现为可运行的浏览器原型，使流程顺序、边缘情况与审核行为真正可以被测试。','Validation focus':'验证重点','Feedback became product rules and working interaction states.':'反馈被转化为产品规则与真实的交互状态。','TERMINOLOGY':'术语','Stage names match production language.':'阶段名称与真实制作语言保持一致。','Navigation describes work people already recognize instead of internal system labels.':'导航使用用户熟悉的工作语言，而非内部系统标签。','STATE VISIBILITY':'状态可见性','Version and QA status stay in view.':'版本与 QA 状态始终可见。','Users can compare versions, see what passed, and know which result is selected.':'用户可以对比版本、查看通过项，并清楚知道当前选中的结果。','HAND-OFF':'交接','Review gates protect downstream work.':'审核节点保护下游工作。','The prototype blocks premature approval and carries the current context into the next stage.':'原型会阻止过早批准，并将当前上下文带入下一阶段。','WORKING PROTOTYPE':'可运行原型','Open interactive prototype ↗':'打开交互原型 ↗','AI becomes usable when uncertainty, control, and system state are designed explicitly.':'只有当不确定性、用户控制和系统状态被明确设计，AI 才真正变得可用。','Custom Commission Platform':'定制委托平台','Low-effort Expense Capture':'低负担支出记录',

      'Graduate UI Design · Course Project':'研究生 UI 设计 · 课程项目','Designing and testing a traceable, dual-sided commission experience for high-stakes decisions between clients and artisans.':'为客户与工匠的重要决策，设计并测试一套可追踪的双边定制委托体验。','12-week graduate course project for custom furniture commissions':'12 周研究生课程项目，聚焦定制家具委托','6 participant records · peer designer critique':'6 份用户测试记录 · 同行设计师评审','Interaction design, prototyping, usability testing and synthesis, visual exploration':'交互设计、原型、可用性测试与归纳、视觉探索','Dual-sided high-fidelity Figma prototype, key iterations, and reusable UI system':'双边高保真 Figma 原型、关键迭代与可复用界面系统','Trust breaks in the invisible middle.':'信任，往往断在看不见的过程里。','Custom furniture is not a simple checkout. Clients commit to a costly process they cannot fully see, while artisans explain material trade-offs, changing timelines, and approvals through scattered email or chat.':'定制家具并非一次简单结账。客户要承担高昂成本，却无法完整看见过程；工匠则在零散邮件和聊天中解释材料取舍、时间变化与批准事项。','The design opportunity was not to make the process feel instant. It was to make expertise, trade-offs, and decisions visible.':'设计的机会不是让过程显得“即时”，而是让专业判断、取舍与决策真正可见。','Clients need to understand what changed, why it matters, and what they are approving.':'客户需要理解发生了什么变化、为何重要，以及自己正在批准什么。','Artisans need structure for documenting issues without adding more administrative work.':'工匠需要有结构地记录问题，又不能增加额外行政负担。','Both sides need one continuous record across requests, recommendations, approvals, cost, and timeline.':'双方都需要一份贯穿需求、建议、批准、费用与时间的连续记录。','Current-state breakdown':'现状拆解','One commission, scattered across disconnected touchpoints':'一次委托，却散落在彼此割裂的接触点中','01 · REQUEST':'01 · 提交需求','Client describes the piece':'客户描述定制作品','Preferences, references, timing, and budget arrive through a long, unstructured message.':'偏好、参考、时间与预算被塞进一条冗长且无结构的消息。','02 · COMPLICATION':'02 · 问题发生','Artisan explains a material issue':'工匠解释材料问题','Photos, recommendations, alternatives, and trade-offs compete inside a message thread.':'照片、建议、备选方案与取舍都挤在同一段对话中。','03 · DECISION':'03 · 做出决策','Approval loses its context':'批准与上下文脱节','The final choice is separated from the evidence, cost, timeline, and project record it changes.':'最终选择与支持它的证据、费用、时间以及被它改变的项目记录相互脱节。',
      'One decision, two different jobs.':'同一个决策，两种完全不同的任务。','I mapped the client journey first, then the artisan workflow behind it. The shared scenario was deliberately difficult: an artisan discovers beetle damage in walnut reserved for a client’s dining table.':'我先梳理客户旅程，再追踪背后的工匠工作流。共同情境被刻意设置得较为棘手：工匠发现为客户餐桌预留的胡桃木遭到虫蛀。','The client needs a calm comparison and a confident approval path. The artisan needs to document evidence, frame alternatives, explain a recommendation, and show downstream cost and timing effects.':'客户需要平静地比较并有信心地批准；工匠则需记录证据、组织备选方案、解释建议，并展示对成本与时间的连锁影响。','CLIENT · 01':'客户 · 01','Understand the issue':'理解问题','See evidence and a plain-language explanation before evaluating options.':'在评估选项前，先看到证据与清楚易懂的解释。','SHARED · 02':'双方共享 · 02','Compare trade-offs':'比较取舍','Review source, risk, price, timing, and the artisan’s rationale in one model.':'在同一模型中查看来源、风险、价格、时间与工匠的判断依据。','ARTISAN · 03':'工匠 · 03','Record the decision':'记录决策','Turn the approved option into a traceable project update instead of another message thread.':'将批准的选项变成可追踪的项目更新，而不是又一条聊天记录。','Prototype walkthroughs':'原型演示','Two roles, one continuous record.':'两种角色，一份连续记录。','CLIENT SIDE':'客户端','ARTISAN SIDE':'工匠端','Discover, request, compare, and approve':'发现、提需求、比较与批准','Document, recommend, and update':'记录、建议与更新',
      '03 · Usability evidence':'03 · 可用性证据','Testing showed exactly where trust broke.':'测试准确暴露了信任在哪里断裂。','The first request felt too heavy.':'首次提交需求的负担过重。','Responsibility was ambiguous.':'决策责任不明确。','“Recommended” lacked a reason.':'“推荐”缺少理由。','Cost and time felt disconnected.':'成本与时间影响彼此脱节。','The flow behaved like separate screens.':'流程像一组割裂的界面。','PRIORITY 01':'优先级 01','Clarify the decision owner':'明确决策者','PRIORITY 02':'优先级 02','Trace the consequence':'追踪决策影响','PRIORITY 03':'优先级 03','Reduce first-step load':'降低首步负担','04 · Evidence to iteration':'04 · 从证据到迭代','Three changes, each tied to observed friction.':'三项改进，每一项都对应真实观察到的阻力。','Evidence:':'证据：','Response:':'设计应对：','IMPROVEMENT 01':'改进 01','Choosing vs. proposing':'代替客户选择 vs. 为客户提供方案','IMPROVEMENT 02':'改进 02','Message vs. recommendation':'普通消息 vs. 有依据的建议','IMPROVEMENT 03':'改进 03','Long form vs. guided request':'冗长表单 vs. 分步引导','05 · Visual direction + UI system':'05 · 视觉方向与界面系统','One visual language had to work for both sides.':'一套视觉语言，需要同时服务两端。','Three style explorations':'三种视觉方向','Warm Craft Heritage':'温暖手工传统','Precision Workshop':'精密工坊系统','Editorial Provenance':'编辑式来源叙事','ACTION REQUIRED':'需要行动','SUCCESS':'已完成','DELAYED':'已延迟','CAUSE':'原因','COMPARISON':'对比','CONSEQUENCE':'影响','Designing for trust means giving consequential decisions enough structure.':'为信任而设计，意味着为重要决策提供足够清晰的结构。','Evidence-led iteration':'证据驱动的迭代','Systems thinking':'系统思维','UI craft':'界面细节',

      'End-to-end UX · Academic Project':'端到端 UX · 课程项目','Reducing expense-logging friction through a scan-first flow that automates the tedious parts without taking correction and control away from the user.':'通过扫描优先的流程降低记账阻力：把繁琐步骤交给自动化，同时保留用户修正与控制的权利。','Course project exploring lighter alternatives to complex finance tools':'探索轻量化财务工具的课程项目','12 weeks · Team of five':'12 周 · 5 人团队','Research synthesis, interaction design, prototyping, usability-led iteration':'研究归纳、交互设计、原型与可用性验证驱动的迭代','High-fidelity interactive mobile prototype in Figma':'Figma 高保真移动端交互原型','01 · Problem framing':'01 · 问题定义','Budgeting was a friction problem.':'记账的问题，其实是日复一日的操作阻力。','For university students managing fluctuating income, textbooks, daily purchases, and tight schedules, the perceived benefit of logging an expense often did not justify the effort of entering amount, date, merchant, and category.':'对于同时应对浮动收入、教材、日常开销与紧张课表的大学生，记录一笔支出的价值，往往抵不过输入金额、日期、商户和类别的麻烦。','Reduce effort first. Budgeting follows.':'先降低操作负担，理财才有可能持续。','Discovery evidence · 10 semi-structured interviews':'探索性研究 · 10 次半结构式访谈','02 · Research to decision':'02 · 从研究到决策','Turn evidence into a design principle.':'把研究证据变成明确的设计原则。','Prioritize capture speed over dashboard complexity.':'捕捉速度优先于仪表盘复杂度。','Use the camera or voice to bypass keyboard-heavy entry.':'通过摄像头或语音，减少繁琐键盘输入。','Keep automation visible so users can verify and correct what the system inferred.':'让自动化过程可见，使用户能够核对并修正系统推断。','FINDING':'研究发现','PRINCIPLE':'设计原则','DESIGN MOVE':'设计应对','03 · Core interaction':'03 · 核心交互','Capture without a form.':'不用填长表单，也能完成记录。','Match the moment':'适配当下情境','Reduce typing':'减少输入','Make inference visible':'让系统推断可见','Close the loop':'完成反馈闭环','Overview':'总览','Choose input':'选择输入方式','Review & confirm':'检查并确认','See the result':'查看结果','Low effort still needs high confidence.':'低负担体验，仍然需要高信心感。','Make the real actions dominant.':'让真正的操作成为视觉主角。','Show what useful input looks like.':'让用户提前知道什么是有效输入。','Replace symbols with explicit choices.':'用明确选项取代需要猜测的图标。','End-to-end UX is the chain from evidence to a testable interaction.':'端到端 UX，是从研究证据到可测试交互的完整链条。','Problem definition':'问题定义','Research synthesis':'研究归纳','Automation with control':'可控的自动化','Usability-led refinement':'可用性测试驱动的优化',

      'Digital Acquisition Strategy · Course Project':'数字获客策略 · 课程项目','Diagnosing a fragmented acquisition journey and defining clearer roles for social, search, web, and seasonal campaigns for a growing beverage brand.':'诊断断裂的获客旅程，并为成长中的饮品品牌明确社交媒体、搜索、官网与季节性活动的各自职责。','Strategy study of a real Canadian beverage brand':'针对加拿大真实饮品品牌的策略研究','4 weeks · Lead strategist in a team project':'4 周 · 团队项目策略负责人','Business diagnosis, audience mapping, funnel and channel strategy, seasonal campaign concept':'业务诊断、人群映射、漏斗与渠道策略、季节性活动概念','Strategic report, channel framework, campaign direction, phased roadmap':'策略报告、渠道框架、活动方向与分阶段路线图','01 · Business challenge':'01 · 业务挑战','Strong products, weak acquisition structure.':'产品有特色，获客结构却不够完整。','The visible symptom was winter sales decline. The deeper issue was a fragmented digital acquisition system.':'表面症状是冬季销量下降，更深层的问题是数字获客系统彼此割裂。','Current-state diagnosis':'现状诊断','SEASONALITY':'季节性','FRAGMENTATION':'品牌割裂','HAND-OFF':'链路衔接','DIFFERENTIATION':'差异化','02 · Audience + positioning':'02 · 人群与定位','Move beyond a generic “bubble tea customer.”':'不再停留在笼统的“奶茶顾客”。','Audience map · Strategic input':'人群地图 · 策略输入','03 · Funnel direction':'03 · 漏斗方向','Give every channel one clear job.':'让每个渠道只承担一个清晰任务。','DISCOVER':'发现','EVALUATE':'了解','Search + Web':'搜索 + 官网','CONVERT':'转化','Store visit':'到店','04 · Seasonal campaign':'04 · 季节性活动','Reframe winter, not just discount it.':'重新定义冬天，而不只是打折。','Seasonal concept · Proposed creative direction':'季节性概念 · 创意方向提案','Turn a weather constraint into a product choice.':'把天气限制转化为新的产品选择。','05 · Roadmap':'05 · 路线图','Make recommendations executable.':'让策略建议可以真正执行。','Foundation:':'基础搭建：','Connection:':'链路连接：','Activation:':'活动启动：','Evaluation:':'效果评估：','Strategy becomes useful when the diagnosis, channel logic, and next actions connect.':'当问题诊断、渠道逻辑与下一步行动被连起来，策略才真正有用。','Business diagnosis':'业务诊断','Funnel thinking':'漏斗思维','Campaign direction':'活动方向','Practical planning':'可执行规划','Digital Acquisition Strategy':'数字获客策略',

      '← Web Design':'← 网页设计','iDE Web Design':'iDE 网页设计','An education website that helps high school students explore future study and career directions, understand available guidance services, and take the next step with confidence.':'一个为教育辅导机构定制的网站，帮助中学生探索未来学习与职业方向、了解可获得的指导服务，并更有信心地迈出下一步。','01 · Homepage':'01 · 首页','Future-path discovery':'未来方向探索','02 · Services':'02 · 服务','Educational pathways':'教育成长路径','← Back to Web Design':'← 返回网页设计','← Projects':'← 作品分类','← Drawing':'← 绘画','App Design →':'应用设计 →','← Web Design':'← 网页设计','Print Media →':'印刷媒介 →','iDE Education':'iDE 教育网站'
    });
    Object.assign(genericChinese, {
      'Implemented: stage navigation · version selection · AI quality actions · review progress · approval gates · asset consistency settings · export states':'已实现：阶段导航 · 版本选择 · AI 质量操作 · 审核进度 · 批准节点 · 素材一致性设置 · 导出状态','Turned an ambiguous AI-video opportunity into a staged product model with owners, states, and gates.':'将模糊的 AI 视频机会定义为具有负责人、状态与阶段节点的产品模型。','Defined versioning, QA visibility, approval behavior, asset consistency, and downstream hand-offs.':'定义版本管理、QA 可见性、批准行为、素材一致性与下游交接。','Made product decisions visible through flows, prototypes, states, and documentation.':'通过流程、原型、状态与文档，让产品决策可见。','Tested the workflow, refined priorities, and implemented a working high-fidelity prototype.':'测试工作流、调整优先级，并实现可运行的高保真原型。','Workflow problem':'工作流问题','Product direction':'产品方向',
      '01 · The challenge':'01 · 设计挑战','02 · Two-sided journey':'02 · 双边旅程','Final prototype · Client first, artisan second':'最终原型 · 先看客户端，再看工匠端','Long screens are framed as tasks—hover or focus to inspect the complete screen.':'长界面按任务呈现；悬停或聚焦即可查看完整页面。','CLIENT FLOW':'客户流程','Discover → define → track':'发现 → 定义 → 追踪','ARTISAN FLOW':'工匠流程','Document → compare → update':'记录 → 比较 → 更新','These high-fidelity walkthroughs show how the same commission moves through two different interfaces. Watch either role independently, or compare them to see how evidence, recommendations, approval, cost, and timing stay connected.':'两段高保真演示呈现同一委托如何经过两个不同界面。可以分别查看两个角色，也可对照理解证据、建议、批准、成本与时间如何始终相连。','High-fidelity prototype · Client and artisan':'高保真原型 · 客户端与工匠端','From an initial request to a documented, traceable decision.':'从最初需求，到有记录、可追踪的决策。','The client experience keeps evidence, alternatives, price, timing, and approval in one continuous journey.':'客户端将证据、备选方案、价格、时间与批准保留在一条连续旅程中。','The artisan experience turns a material complication into a structured recommendation and traceable project update.':'工匠端将材料问题转化为有结构的建议和可追踪的项目更新。',
      'I tested the two core journeys—starting a commission and responding to a material complication—across six participant records (P1–P6), then compared the patterns with a peer-designer critique.':'我基于 6 份参与者记录（P1–P6）测试了“发起委托”与“处理材料问题”两条核心旅程，并将模式与同行设计师评审相互印证。','The prototype could move people through the task. It did not yet explain who was making the decision, why an option was recommended, or how that choice changed cost and time.':'原型已能帮助用户完成任务，却还没有解释清楚由谁决策、为何推荐某个选项，以及选择如何改变成本与时间。','Participants understood where to begin, but the number of required fields made first contact feel demanding and easy to abandon.':'参与者知道从哪里开始，但大量必填字段让第一次联系显得沉重，容易中途放弃。','Clients and artisans were unsure whether the artisan was choosing one material or preparing several options for client approval.':'客户与工匠都不确定，工匠是直接选定一种材料，还是提供多个方案由客户批准。','Participants valued the recommendation, but wanted the artisan’s rationale and its connection to the client’s original goal.':'参与者重视专业推荐，但也希望看到工匠的理由，以及该理由与客户原始目标的联系。','The later price change was not visibly tied to the material decision that caused it, weakening the project’s transparency promise.':'后续价格变化没有明确关联到导致它的材料决策，削弱了项目对透明度的承诺。','Messaging, approval, delivery, and review transitions felt abrupt instead of reading as one continuous commission record.':'消息、批准、交付与评价之间的过渡过于突兀，没有读起来像一份连续委托记录。','Make it unmistakable that artisans prepare alternatives and clients approve one.':'清楚表明：工匠准备备选方案，客户批准其中一个。','Connect recommendation rationale to cost, timing, and the project record.':'将推荐理由与成本、时间及项目记录相连。','Break the client request into understandable stages with a visible next step.':'将客户需求拆成易于理解的阶段，并明示下一步。','These are three independent improvements, not three chronological versions. The visual now isolates only the interface change; the evidence and design response stay readable beside it.':'这是三项相互独立的改进，而非三个按时间排列的版本。图像只聚焦界面变化，证据与设计应对则在旁边清晰呈现。',
      'I explored three art directions before committing to the interface system: warm craft, precision workshop, and editorial provenance. This made visual style a product decision—how should the service communicate expertise, traceability, and human craft?':'在确定界面系统前，我探索了“温暖手工传统”、“精密工坊”与“编辑式来源叙事”三个艺术方向。这让视觉风格成为产品决策：服务应如何传达专业性、可追踪性与人的手工温度？','I then reused only the patterns that protect comprehension at consequential moments, rather than treating every navigation bar and button as portfolio evidence.':'之后，我只复用那些能在关键决策中保护理解的模式，而不是把每个导航栏和按钮都当成作品集证据。','Different balances of warmth, precision, and provenance; click to inspect.':'三种方向在温度、精密感与来源感之间取得不同平衡；点击可放大查看。','DIRECTION 01':'方向 01','DIRECTION 02':'方向 02','DIRECTION 03':'方向 03','Reusable interface system · Actual Figma components':'可复用界面系统 · 真实 Figma 组件','Six patterns selected for the product decisions they make visible—not because they are generic UI parts.':'六类模式之所以被选中，是因为它们让关键产品决策可见，而不是因为它们是通用 UI 部件。','FAMILY 01 · PROJECT STATES':'组件族 01 · 项目状态','One card model, three moments that need different action.':'同一卡片模型，对应三种需要不同行动的时刻。','Brings the unresolved decision and next action forward.':'将未解决决策与下一步操作提到最前。','Confirms that a shared decision has been recorded.':'确认双方共同决策已被记录。','Surfaces risk without losing the project context.':'暴露风险，同时不丢失项目上下文。','FAMILY 02 · DECISION EVIDENCE':'组件族 02 · 决策证据','Cause, comparison, and consequence stay connected.':'原因、比较与影响始终相连。','Photo evidence makes the material issue inspectable.':'照片证据让材料问题可以被查看与判断。','Alternatives use the same criteria before approval.':'备选方案在批准前使用相同标准进行比较。','Budget and timeline effects remain attached to the choice.':'预算与时间影响始终与该选择相连。','I translated a complex service process into clear stages, roles, comparisons, approvals, and state changes.':'我将复杂服务流程转化为清晰的阶段、角色、比较、批准和状态变化。','I connected usability findings to specific interface improvements instead of presenting research and UI as separate stories.':'我将可用性发现直接连接到具体界面改进，而不是把研究与 UI 讲成两个孤立故事。','I designed continuity across client and artisan flows rather than optimizing isolated screens.':'我设计了跨客户端与工匠端的连续性，而不是只优化孤立界面。','I built reusable patterns for comparison, recommendation, status, and decision history in Figma.':'我在 Figma 中搭建了用于比较、推荐、状态与决策历史的可复用模式。','Usability evidence':'可用性证据','Visual direction + UI system':'视觉方向与界面系统'
    });
    Object.assign(genericChinese, {
      'Interaction design':'交互设计','Workflow problem':'工作流问题','Product direction':'产品方向','Problem framing':'问题定义','Research to decision':'从研究到决策','Core interaction':'核心交互',
      'This principle narrowed the project: instead of adding more financial features, we focused on the smallest repeated action that caused people to disengage.':'这条原则帮助团队缩小了范围：不再增加更多财务功能，而是聚焦那个不断让用户放弃的最小重复操作。','Raw conversations became one repeated breakdown: effort outweighed perceived value.':'原始访谈反复指向同一个断点：操作成本高于用户感知到的价值。','Interview notes, team synthesis, and early sketches':'访谈笔记、团队归纳与早期草图','Journey map locating friction at scan, manual entry, and return':'用户旅程图：定位扫描、手动输入与返回时的阻力','Research indicated that manual entry felt disproportionate to the value students received. Competitive products often assumed sustained attention and financial discipline, while our opportunity was a lightweight capture tool that could fit into a busy day.':'研究表明，手动输入的负担与学生获得的价值不成比例。竞品普遍默认用户会长期专注且具备财务纪律，而我们的机会是一个能融入忙碌日常的轻量记录工具。','Evidence → decision':'证据 → 决策','The research changed the interaction model—not just the interface style.':'研究改变的是交互模型，而不只是界面风格。','Manual entry felt heavier than the purchase.':'手动记录甚至比消费本身更累。','Reduce effort before adding budgeting features.':'先减少操作负担，再考虑添加理财功能。','Capture first; keep inference reviewable.':'先快速记录，同时让系统推断始终可检查。',
      'The high-fidelity prototype replaces one long expense form with three entry choices: photograph a receipt, describe the expense by voice, or edit it manually. Photo and voice reduce typing; manual entry remains available when automation is not the right fit.':'高保真原型用三种入口取代冗长支出表单：拍摄收据、语音描述或手动编辑。照片与语音减少输入；自动化不合适时，手动方式仍可用。','The key product decision is the review step. SnapBudget shows what it inferred—merchant, category, amount, and date—before anything changes the budget, so speed never removes user control.':'关键产品决策是“检查”。SnapBudget 在预算发生改变前，先呈现系统识别的商户、类别、金额与日期，让速度不会牺牲用户控制。','01 · CHOOSE':'01 · 选择','02 · CAPTURE':'02 · 记录','03 · REVIEW':'03 · 检查','04 · FEEDBACK':'04 · 反馈','Photo, voice, and manual entry are presented as equal starting points.':'照片、语音与手动输入被作为同等入口呈现。','Receipt guidance or a spoken sentence gathers the needed information.':'收据拍摄引导或一句口述，即可收集所需信息。','Parsed details stay editable before the user explicitly confirms them.':'用户明确确认前，识别结果始终可编辑。','Updated expenses and savings make the result of the action immediately visible.':'更新后的支出与储蓄数据，让操作结果立即可见。','Prototype: Final · High-fidelity Figma frames':'最终原型 · Figma 高保真界面','One short story: overview → input choice → review → updated balance.':'一条简洁流程：总览 → 选择输入 → 检查 → 余额更新。','Interactive prototype walkthrough · 00:40':'交互原型演示 · 00:40','Watch both low-effort routes and the explicit confirmation loop in context.':'在完整情境中查看两种低负担记录路径与明确确认闭环。','Usability testing shifted attention from speed alone to comprehension. The refined flow makes system status, the next action, and successful completion clearer, while preserving an obvious correction path.':'可用性测试让重心从单纯追求速度，转向理解与信心。优化后的流程让系统状态、下一步和完成反馈更清楚，同时保留明确修正路径。','Clarify what the camera is looking for before capture.':'拍摄前说清摄像头需要捕捉的内容。','Show parsed details in a stable, editable confirmation state.':'在稳定、可编辑的确认状态中呈现识别详情。','Use feedback to distinguish system processing from successful logging.':'通过反馈明确区分“系统处理中”与“记录成功”。','10 moderated think-aloud sessions':'10 次主持式出声思考测试','Each comparison now shows only the interface change; findings stay readable underneath.':'每组对比只展示界面变化，研究发现则在下方独立阅读。','01 · HIERARCHY':'01 · 层级','02 · EXPECTATION':'02 · 预期','03 · CONFIDENCE':'03 · 信心','Make the real actions dominant.':'让真正的操作成为视觉主角。','Show what useful input looks like.':'让用户提前知道什么是有效输入。','Replace symbols with explicit choices.':'用明确选项取代需要猜测的图标。','I reframed low budgeting engagement as repeated interaction friction rather than a lack of discipline.':'我将理财参与度低重新定义为反复出现的交互阻力，而不是用户缺少自律。','I connected user evidence and competitor patterns to one focused product principle.':'我将用户证据与竞品模式收束为一条聚焦的产品原则。','I designed a lightweight flow that reduces input without hiding inference or correction.':'我设计了轻量流程，在减少输入的同时，不隐藏系统推断与修正。','I used testing to improve expectations, feedback, and confidence across the core task.':'我通过测试改善了核心任务中的预期、反馈与信心感。'
    });
    Object.assign(genericChinese, {
      'Hi Yogurt had expanded across the GTA and Los Angeles with distinctive yogurt drinks, Halal options, pet-friendly products, and local partnerships. Yet growth had produced separate social accounts, inconsistent messaging, and a weak bridge from discovery to product information and store action.':'Hi Yogurt 在大多伦多地区和洛杉矶持续扩张，拥有特色酸奶饮品、清真选项、宠物友好产品与本地合作。但增长也带来了分散的社交账号、不一致的信息，以及从发现品牌到了解产品、进入门店之间的断层。','I separated four signals from the diagnosis so the project would not jump from a broad business problem straight to campaign execution.':'我从诊断中拆出四个信号，避免项目从宽泛的商业问题直接跳到活动执行。','Four signals pointed to one structural acquisition problem.':'四个信号，共同指向一个结构性获客问题。','01 · SEASONALITY':'01 · 季节性','Cold drinks lost relevance in winter.':'冷饮在冬季失去了相关性。','The issue required repositioning, not only another discount.':'这需要重新定位，而不只是再做一次打折。','02 · FRAGMENTATION':'02 · 品牌割裂','Location accounts diluted one brand voice.':'多个门店账号稀释了统一品牌声音。','Separate content systems weakened consistency and reach.':'分散内容系统降低了一致性与触达。','03 · HAND-OFF':'03 · 链路衔接','Discovery did not lead clearly to action.':'用户发现品牌后，不知道下一步怎么做。','Social, web, search, and store information behaved like separate touchpoints.':'社交媒体、官网、搜索与门店信息像彼此割裂的接触点。','04 · DIFFERENTIATION':'04 · 差异化','Distinctive products were under-explained.':'特色产品没有被充分解释。','Halal, pet-friendly, and local partnership value was not consistently communicated online.':'清真、宠物友好与本地合作的价值，没有在线上得到一致传达。','I mapped four audience groups—students, fitness-conscious consumers, pet owners, and culturally diverse local communities—to identify what genuinely connected them.':'我梳理了学生、关注健康的消费者、宠物主人和文化多元的本地社区四类人群，寻找真正连接它们的共性。','The shared opportunity was not age alone. It was a preference for distinctive, approachable, and experience-led products.':'共同机会并不只来自年龄，而是对有特色、无距离感且以体验驱动产品的偏好。','This framing made the later channel decisions more specific: social could create discovery and cultural relevance, while web and search needed to explain ingredients, inclusivity, products, and locations.':'这一定位让后续渠道决策更具体：社交媒体负责带来发现与文化相关性，网站与搜索则要解释原料、包容性、产品与门店信息。','Four segments, connected by lifestyle, values, and feel-good product experiences.':'四类人群，由生活方式、价值观与轻松愉悦的产品体验连接起来。',
      'The strategy organized the digital journey around intent. Social introduces product appeal and seasonal stories. Search captures people already looking for a product or location. The website explains the menu and brand, while store information turns interest into a visit.':'策略围绕用户意图组织数字旅程：社交媒体展示产品吸引力与季节故事；搜索承接已在寻找产品或地点的用户；网站解释菜单与品牌，门店信息再把兴趣转化为到访。','This shifted the recommendation away from isolated content ideas and toward a connected acquisition funnel.':'因此，建议不再是孤立的内容点子，而是一条相互连接的获客漏斗。','01 · DISCOVER':'01 · 发现','Consolidate the brand voice and use visual storytelling to create product curiosity.':'统一品牌声音，用视觉叙事激发用户对产品的好奇。','02 · EVALUATE':'02 · 了解','Capture direct intent, explain differentiation, and make menu and location details easy to find.':'承接明确意图，讲清差异化，并让菜单与门店信息容易查找。','03 · CONVERT':'03 · 转化','Connect digital information to a confident location and purchase decision.':'将数字信息连接到明确的门店选择与购买决策。','Acquisition system · Channel roles':'获客系统 · 渠道职责','Awareness → consideration → intent → conversion → loyalty.':'认知 → 考虑 → 意图 → 转化 → 忠诚。','The campaign direction “Warm bubble tea or cool yogurt?” reframed the brand as a choice rather than a cold-only product. Familiar yogurt flavours could be experienced in a warm or cold bubble tea format, with a trial promotion supporting the seasonal message.':'活动主题“温暖珍珠奶茶，还是清凉酸奶？”将品牌重新定义为一种选择，而不是只属于冷饮。熟悉的酸奶风味可以用冷或热珍珠奶茶的形式体验，再由试饮促销支持季节信息。','The creative is a concept proposal, not a launched campaign or a measured business result.':'该创意是概念提案，不代表已上线活动或经测量的商业结果。','The promotion supports trial, but the strategic move is the contrast between warm familiarity and cool product distinctiveness.':'促销用于推动尝试，更核心的策略是建立“温暖熟悉”与“清凉特色”的对比。','The final roadmap moves from structural fixes to campaign execution: consolidate social presence, clarify the brand’s digital narrative, strengthen search and website connections, then activate seasonal messaging with a consistent measurement plan.':'最终路线图从结构修复走向活动执行：统一社交媒体形象，讲清品牌数字叙事，加强搜索与官网衔接，再用一致的衡量计划启动季节性沟通。','Phased roadmap · Proposed measurement framework':'分阶段路线图 · 建议的衡量框架','Recommended actions and success indicators—not realized growth results.':'这里呈现的是建议行动与成功指标，而不是已实现的增长数据。','I separated the seasonal symptom from the structural acquisition problem underneath it.':'我将季节性表象与其下的结构性获客问题区分开。','I defined distinct roles for discovery, evaluation, intent capture, and store conversion.':'我为发现、了解、意图承接与到店转化定义了清晰分工。','I translated a seasonal constraint into a focused message platform without presenting projected impact as realized.':'我将季节限制转化为聚焦的信息平台，同时没有把预测影响包装成已实现成果。','I organized recommendations into phased actions and an evaluation framework.':'我将建议整理为分阶段行动与评估框架。','Business challenge':'业务挑战','Audience + positioning':'人群与定位','Funnel direction':'漏斗方向','Seasonal campaign':'季节性活动','Roadmap':'路线图'
    });
    Object.assign(genericChinese, {
      'Meet the person behind the work':'认识作品背后的我','In-context examples and capture guidance clarify what photo and audio entry expect before the user begins.':'情境化示例与捕捉引导，让用户在开始前就理解照片与语音需要什么内容。','Clear Yes/No language replaces icons whose meaning participants had to infer.':'用明确的“是 / 否”文字，取代需要用户猜测含义的图标。'
    });
    Object.assign(genericChinese, {
      'Gilded Goddesses of Olympus':'奥林匹斯鎏金女神',
      'A six-piece AI-assisted illustration series reimagining Olympian goddesses through gilded ornament, symbolic attributes, and contemporary portrait composition.':'一组六幅 AI 辅助插画，以鎏金装饰、女神象征物与当代肖像构图，重新诠释奥林匹斯女神。',
      'AI Illustration':'AI 插画',
      'Visual Direction':'视觉指导',
      'Open Gilded Goddesses of Olympus':'打开《奥林匹斯鎏金女神》',
      'AI Illustration · Mythology Series':'AI 插画 · 神话系列',
      'Education Consultancy Website':'教育咨询机构网站',
      'AI Video Production Workflow':'AI 视频制作工作流',
      '05 · Visual direction':'05 · 视觉方向',
      'Visual direction':'视觉方向',
      'I explored three art directions before committing to the final interface: warm craft, precision workshop, and editorial provenance. This made visual style a product decision—how should the service communicate expertise, traceability, and human craft?':'在确定最终界面前，我探索了“温暖手工传统”、“精密工坊”与“编辑式来源叙事”三种艺术方向。由此，视觉不再只是风格选择，而成为产品决策：这项服务该如何传达专业性、可追踪性与手工温度？',
      'The chosen direction balances the warmth of custom making with the precision needed for evidence, comparison, and approval.':'最终方向在定制手作的温度，与证据、比较和确认所需的严谨之间取得平衡。',
      'I translated craft, provenance, and decision clarity into one visual language for both sides of the service.':'我把手工质感、来源信息与决策清晰度整合为一套同时服务客户与工匠的视觉语言。'
    });
    Object.assign(genericChinese, {
      'Time Travel':'《时间旅行》','Blood Rose':'《血色玫瑰》','Jellyfish':'《水母》','Material Creature':'《材料生物》',
      '← App Design':'← 应用设计','Sculpture →':'雕塑 →','← Print Media':'← 印刷媒介','Drawing →':'绘画 →','← Sculpture':'← 雕塑','Web Design →':'网页设计 →'
    });
    Object.assign(genericChinese, {
      'AI Product Design Internship · Shipped Product':'AI 产品设计实习 · 已上线产品',
      '4-month internship on a B2B AI video production platform':'为期 4 个月的 B2B AI 视频生产平台实习',
      'Product managers, engineers, designers, and general manager':'产品经理、工程师、设计师与总经理共同参与',
      'Product design intern · Independent owner of the high-fidelity UI':'产品设计实习生 · 独立负责高保真界面',
      'Interaction model adopted, engineered, and launched':'交互方案获采纳、完成开发并正式上线',
      'Make hidden coordination work observable.':'让隐藏的协作过程变得可见。',
      'I interviewed nine internal production specialists who also use AI tools to make short-form dramas. Their work spanned project management, art, storyboarding, post-production, and direction, giving me a view of the hand-offs behind a complete production rather than feedback on isolated screens.':'我访谈了 9 位内部制作成员，他们本身也是 AI 短剧生产的真实用户，覆盖项目管理、美术、分镜、后期与导演等岗位。由此我看到的不只是单个界面的反馈，而是一条完整制作链路中的协作与交接。',
      'Three real-project workflow tests and structured competitor testing exposed recurring problems with version awareness, review context, editable states, and hand-offs. I translated the evidence into a shared workflow model that product and engineering could evaluate together.':'3 轮真实项目工作流测试与结构化竞品测试，暴露出版本辨识、审核上下文、可编辑状态和交接中的反复问题。我将这些证据转化为产品与工程可以共同评估的工作流模型。',
      '03 · MVP decision':'03 · MVP 范围决策',
      'Protect the core workflow from premature audio scope.':'先保护核心工作流，不让尚未成熟的音频功能拖慢交付。',
      'The team considered standalone AI voice and BGM generation. I recommended moving both out of the MVP after reviewing production constraints. Character voices could not yet remain consistent across a complete video, while music generated for short clips could not reliably sustain narrative continuity.':'团队曾考虑加入独立的 AI 配音与 BGM 生成功能。评估真实制作限制后，我建议将两者移出 MVP：人物音色尚难在完整视频中保持一致，而面向短片段生成的音乐也难以支撑长剧情的连续性。',
      'The production workflow needed stability and control before it needed another generation tool.':'在增加新的生成工具之前，产品首先需要稳定、可控的生产流程。',
      'Generated clips kept their existing audio, which was usually strong and matched the scene. Creators could add a complete soundtrack after editing by uploading their own music or importing music made in a dedicated AI platform.':'生成片段保留原有且通常与剧情氛围匹配的音频；完成剪辑后，创作者仍可上传完整配乐，或导入在专业 AI 音乐平台生成的音乐。',
      'Scope decision':'范围决策','A smaller MVP protected delivery without closing the door on future audio tools.':'更聚焦的 MVP 保障了交付，也为未来音频能力保留空间。',
      'Long-form consistency was not reliable.':'长视频的一致性尚不可靠。','Stabilize the video production chain.':'优先稳定视频生产链路。','Import complete BGM after editing.':'剪辑完成后再导入完整 BGM。',
      'From isolated outputs to a controllable production system.':'从零散生成结果，走向可控的生产系统。',
      'I defined the product around one persistent production model: each stage has an owner, completion state, review gate, version context, and explicit hand-off. I independently translated that model into the final high-fidelity interface.':'我围绕一套持续贯穿项目的生产模型定义产品：每个阶段都有负责人、完成状态、审核节点、版本上下文与明确交接。我随后独立将这套模型转化为最终高保真界面。',
      'Final high-fidelity system · Shipped interface':'最终高保真系统 · 已上线界面',
      '05 · Validation and launch':'05 · 验证与上线','Test the workflow, then carry it into production.':'先验证工作流，再推动方案进入真实产品。',
      'Three real-project workflow tests and roughly twenty feedback items refined terminology, state visibility, review hand-offs, and interaction priority. I encoded the decisions in a working browser prototype, then worked with the team as engineering implemented the approved interface.':'3 轮真实项目工作流测试和约 20 条反馈，帮助我优化术语、状态可见性、审核交接与交互优先级。我将决策做成可运行的浏览器原型，并在工程团队实现已批准界面的过程中持续协作。',
      'The related interaction model and UI are now live in Geeelink.':'相关交互模型与界面现已在极灵产品中上线。',
      'Validation and delivery':'验证与交付','Feedback became product rules, working states, and a shipped interface.':'反馈最终转化为产品规则、可运行状态与正式上线的界面。',
      'Scope judgment':'范围判断','Protected the MVP by separating core production needs from audio ideas that were not yet reliable.':'将核心生产需求与尚不可靠的音频设想分开，保护 MVP 的交付节奏。',
      'Cross-functional delivery':'跨职能交付','Made decisions visible through flows, requirements, prototypes, and implementation-ready states.':'通过流程、需求、原型和可落地状态，让跨职能决策清晰可见。',
      'Shipped outcome':'上线成果','Moved from research and workflow tests to an approved high-fidelity interface that engineering launched.':'从研究与工作流测试推进到获批高保真方案，并由工程团队完成上线。',

      'Graduate UI Design · Academic Team Project':'研究生 UI 设计 · 课程团队项目',
      'Three-person team · I served as team lead':'3 人团队 · 我担任团队负责人',
      'Artisan low-fidelity flow · Complete client and artisan high-fidelity UI':'负责工匠端低保真流程，并独立完成客户端与工匠端全部高保真界面',
      '6 moderated sessions · 6/6 completed core tasks':'6 次主持式测试 · 6/6 完成核心任务',
      '6 moderated sessions across both sides of the service.':'围绕服务双方开展 6 次主持式测试。',
      'Three participants completed the client journey and three completed the artisan journey. All six finished the core scenario, with artisans averaging 12–15 minutes and clients 10–12 minutes.':'3 位参与者体验客户端流程，另 3 位体验工匠端流程；6 人均完成核心情境任务。工匠端平均用时 12–15 分钟，客户端为 10–12 分钟。',
      'The sessions exposed 3 serious issues, 4 minor issues, and 1 cosmetic issue. The strongest patterns were selection ambiguity (4/6), unclear material origin (3 participants), weak impact criteria (2 artisans), and an overly long request form (2 clients).':'测试发现 3 个严重问题、4 个次要问题和 1 个视觉问题。最明显的模式包括：选择状态不清晰（4/6）、材料来源不明确（3 人）、影响指标解释不足（2 位工匠端参与者），以及需求表单过长（2 位客户端参与者）。',
      'Outcome and next validation':'成果与下一步验证','Leadership':'领导与协作',
      'I led a three-person team and maintained continuity across the client and artisan experience.':'我带领 3 人团队，并确保客户端与工匠端体验在整个项目中保持连贯。',
      'End-to-end UI ownership':'端到端界面负责','I designed the complete high-fidelity client and artisan interface after developing the artisan low-fidelity flow.':'在完成工匠端低保真流程后，我独立设计了客户端与工匠端的全部高保真界面。',
      'NEXT VALIDATION':'下一步验证','A focused follow-up round would test whether the revised selection model and shorter client request reduce hesitation before the system expands to more commission scenarios.':'下一轮将重点验证新的选择模式与精简后的客户需求流程，是否真正减少犹豫，再将系统扩展到更多定制情境。',

      'End-to-end UX · Academic Team Project':'端到端 UX · 课程团队项目',
      '12-week UX studio project for Canadian university students':'面向加拿大大学生的 12 周 UX 工作室课程项目',
      'Five-person team · I served as team lead':'5 人团队 · 我担任团队负责人',
      'UX research, end-to-end interaction logic, prototyping, and entry-flow design':'用户研究、端到端交互逻辑、原型设计与记账入口设计',
      'High-fidelity Figma prototype · Instructor score 93/100':'Figma 高保真原型 · 课程成绩 93/100',
      'I helped plan the research, synthesize the evidence, and coordinate the team around one core task. Ten interviews showed three recurring patterns: manual entry felt like homework, students wanted tools that required less ongoing attention, and tracking often stopped during busy weeks.':'我参与规划研究、归纳证据，并带领团队聚焦一个核心任务。10 次访谈呈现出三个反复出现的模式：手动录入像在做作业；学生希望工具不需要持续投入注意力；一到忙碌时期，记账习惯往往就会中断。',
      'Research indicated that manual entry felt disproportionate to the value students received. I sketched the first complete low-fidelity flow, used team critique to refine its logic, and helped establish receipt scanning as the shared core concept.':'研究表明，手动录入的负担与学生获得的价值并不相称。我手绘了第一版完整低保真流程，通过团队讨论优化逻辑，并共同确定将收据扫描作为核心方案。',
      'I proposed voice input after reviewing accessibility guidance. It became an additional path for users who may find photo or manual entry difficult, while manual correction remained available when automation was inaccurate.':'查阅无障碍设计规范后，我主动提出语音输入，让不便拍照或手动输入的用户多一种选择；当自动识别不准确时，用户仍可手动修正。',
      'Ten moderated think-aloud sessions shifted attention from speed alone to comprehension. Participants liked having photo, voice, and manual entry, but several were unsure what each option did and whether typing would still be required.':'10 次主持式出声思考测试，让团队从单纯追求速度转向关注理解与信心。参与者喜欢照片、语音和手动三种入口，但部分人不清楚每个选项的作用，也不确定后续是否仍需输入文字。',
      'Outcome and reflection':'成果与反思','The project earned 93/100 for analytical rigor, clear communication, and evidence-led design.':'项目凭借严谨分析、清晰表达与证据驱动的设计获得 93/100。',
      'I coordinated a five-person team while contributing across research, synthesis, flow design, prototyping, testing, and iteration.':'我协调 5 人团队，并深度参与研究、归纳、流程设计、原型、测试与迭代。',
      'Research synthesis':'研究归纳','I connected ten interviews to three recurring patterns and one focused product principle.':'我将 10 次访谈归纳为 3 个反复出现的模式，并收束成一条聚焦的产品原则。',
      'Accessibility initiative':'无障碍设计主动性','I proposed voice input as an additional route after identifying an accessibility gap in photo and manual entry.':'发现拍照与手动输入的无障碍缺口后，我主动提出增加语音输入路径。',
      'Usability-led refinement':'可用性驱动迭代','I used ten think-aloud sessions to improve expectations, feedback, and confidence across the core task.':'我利用 10 次出声思考测试，提升核心任务中的预期理解、反馈与操作信心。',
      'TRADE-OFFS AND NEXT STEP':'取舍与下一步','Automation reduces effort, but receipt and voice recognition can be inaccurate, financial data is sensitive, and speech is not suitable in every context. A next iteration would test correction effort, privacy expectations, and the manual fallback earlier with rough prototypes.':'自动化能降低操作成本，但收据与语音识别可能出错，财务数据也涉及隐私，而且语音并不适用于所有场景。下一轮会更早用粗糙原型验证修正成本、隐私预期与手动备选路径。',

      'Commissioned client website · 2026':'真实委托网站 · 2026',
      'A responsive education website for iDriveCareer Canada Consulting Ltd., helping students and families understand future study and career guidance services.':'为 iDriveCareer Canada Consulting Ltd. 打造的响应式教育网站，帮助学生与家庭清楚了解升学及职业规划服务。',
      'Timeline':'周期','2 months':'2 个月','3 people · Team lead':'3 人团队 · 团队负责人','My ownership':'我的负责范围','All page UI, client alignment, and design direction':'全部页面 UI、客户沟通与设计方向','Status':'项目状态','Client approved and preparing for use':'客户已批准，正在准备投入使用',
      '01 · The brief':'01 · 初始需求','A loose outline needed to become a credible digital home.':'一份模糊大纲，需要被转化为可信的品牌网站。',
      'The client’s initial document listed broad sections such as services, team, resources, and contact information, but did not yet define the audience journey, content hierarchy, or visual direction.':'客户最初只提供了服务、团队、资源与联系信息等大致板块，尚未明确用户旅程、内容层级与视觉方向。',
      'I led the design process, translated conversations with the company lead into a clearer site structure, and designed every page. A developer focused on implementation, while a third teammate prepared and entered the final copy.':'我主导设计过程，把与公司负责人的沟通转化为更清晰的网站结构，并负责全部页面设计；开发同伴专注于实现，第三位成员负责整理与录入最终文案。',
      '02 · Client alignment':'02 · 客户对齐','Feedback changed the positioning, not only the wording.':'反馈改变的不只是文案，更是网站的定位。',
      'I presented several visual directions and color systems. The client selected a palette connected to the existing logo, then clarified that the experience should emphasize student agency and the idea of discovering a personal direction.':'我提供了多套视觉方向与配色方案。客户最终选择与现有 Logo 呼应的配色，并进一步明确：网站应突出学生的主动性，以及探索个人发展方向的过程。',
      'From generic help to student direction':'从泛泛的帮助，到学生自主探索方向','The central message shifted toward helping students discover and drive their future path.':'核心信息转向帮助学生发现并主动规划自己的未来道路。',
      'From a list to differentiated value':'从服务清单，到清晰的差异化价值','Service content was reorganized around what students and parents needed to understand before contacting the company.':'服务内容围绕学生与家长在联系机构前最需要理解的信息重新组织。',
      'From a fixed formula to adaptable guidance':'从固定公式，到因人而异的引导','The original five-step structure became a more flexible journey that could respond to different student needs.':'原先固定的五步结构被调整为更灵活的路径，以适应不同学生的需求。',
      '03 · Delivery':'03 · 交付','The final system gave the client a consistent, responsive website.':'最终系统为客户建立了一致、响应式的网站体验。',
      'I delivered the complete UI for the homepage, company story, services, team, resources, and contact journey. The design uses the logo palette, clear content hierarchy, and reusable responsive patterns to keep the experience consistent across pages.':'我完成了首页、公司故事、服务、团队、资源与联系路径的全部 UI。设计沿用 Logo 配色，并通过清晰内容层级与可复用响应式模式，让不同页面保持一致。',
      'iDriveCareer Canada Consulting Ltd. approved the design and is preparing the website for use.':'iDriveCareer Canada Consulting Ltd. 已批准设计，并正在准备投入使用。'
    });
    Object.assign(genericChinese, {
      'My role':'我的角色','Result':'结果','CONSTRAINT':'限制条件','04 · Product direction':'04 · 产品方向','SHIPPED PRODUCT':'已上线产品',
      'Research records remain confidential; the public prototype shows how findings became product states.':'研究记录因保密不公开；公开原型展示了研究发现如何转化为产品状态。',
      'Lock reusable actors and environments before generation.':'生成前锁定可复用角色与场景。','Review shot logic and quality before video generation.':'视频生成前审核镜头逻辑与质量。','Compare generated takes without losing prompt context.':'在保留提示词上下文的同时比较生成版本。','Carry selected material into an editable delivery timeline.':'将选定素材带入可编辑的交付时间线。','The interface prevents premature approval and carries the current context into the next stage.':'界面避免过早批准，并将当前上下文带入下一阶段。','Engineering implemented the approved stage navigation, version selection, AI quality actions, review progress, approval gates, asset consistency settings, and export states.':'工程团队已实现获批的阶段导航、版本选择、AI 质量操作、审核进度、批准节点、资产一致性设置与导出状态。',

      'Find an artisan and return to an active commission.':'寻找合适工匠，并随时返回进行中的委托。','Review project essentials before sending the request.':'发送需求前检查项目关键信息。','Track work, decisions, and changes in one record.':'在同一记录中追踪进度、决策与变化。','See the project state and open the issue workflow.':'查看项目状态，并进入问题处理流程。','Present alternatives using consistent criteria.':'使用一致标准呈现备选方案。','Carry approval into cost and timeline history.':'将批准结果同步到成本与时间记录。',
      'Your browser cannot play the client prototype video.':'当前浏览器无法播放客户端原型视频。','Your browser cannot play the artisan prototype video.':'当前浏览器无法播放工匠端原型视频。',
      'Completion was high, but confidence was uneven.':'任务都能完成，但操作信心并不稳定。','I moderated six prototype sessions: three participants followed the client journey and three followed the artisan journey. All six completed the core tasks, with average completion times of 10–12 minutes for clients and 12–15 minutes for artisans.':'我主持了 6 次原型测试：3 位参与者体验客户端流程，3 位体验工匠端流程。6 人均完成核心任务，客户端平均用时 10–12 分钟，工匠端为 12–15 分钟。','Task completion showed that the structure worked. The observed hesitation showed where the interface still needed to explain responsibility, comparison, and consequence.':'任务完成率证明整体结构可行；过程中出现的犹豫，则指出界面仍需更清楚地解释责任归属、方案比较与决策后果。',
      'Serious issues':'严重问题','The test identified three issues that could materially affect a participant’s understanding or progress.':'测试发现 3 个会实质影响理解或任务推进的问题。','Selection model unclear':'选择机制不清晰','Four participants were unsure whether artisans selected a material or prepared options for client approval.':'4 位参与者不确定是由工匠直接选择材料，还是由工匠提供选项、客户最终批准。','Material origin confusion':'材料来源不明确','Three participants needed clearer context for where an alternative material came from.':'3 位参与者需要更清楚地了解备选材料的来源。','Impact criteria unclear':'影响指标不清晰','Two participants in the artisan flow needed a clearer explanation of how an option affected the project.':'2 位工匠端参与者需要更清楚地理解某个选项会如何影响项目。','Form length concern':'表单过长','Two participants in the client flow found the initial request too long and information-heavy.':'2 位客户端参与者认为初始需求表单过长、信息负担过重。',
      'P1 and P5 hesitated over whether the artisan should pick one material or prepare several.':'P1 与 P5 对工匠应直接选择一种材料，还是准备多种方案感到犹豫。','Consistent criteria, recommendation rationale, and a Preview & Send step make the artisan’s responsibility explicit.':'一致的比较标准、推荐理由，以及“预览并发送”步骤，让工匠的职责更加明确。','P4 wanted stronger reasoning and a clearer explanation of price and duration changes.':'P4 希望看到更充分的推荐理由，以及对价格与工期变化的清晰解释。','The new flow links the material issue, photo evidence, recommended solution, budget adjustment, and timeline shift.':'新流程将材料问题、照片证据、推荐方案、预算调整与工期变化连接起来。','P4 and P6 struggled with the amount of information and unclear sequence.':'P4 与 P6 认为信息量过大，操作顺序也不够清楚。','Project essentials, preferences, and review become three visible stages with a clear next action.':'项目关键信息、偏好与检查被拆成三个清晰阶段，每一步都明确下一项操作。','Next: SnapBudget':'下一个：SnapBudget','Research + mobile UX →':'研究 + 移动端 UX →',

      'Three patterns narrowed the project to the repeated action that caused students to disengage.':'三个模式帮助团队聚焦到那个不断让学生放弃记账的重复操作。','Interview notes, affinity synthesis, and early sketches':'访谈笔记、亲和图归纳与早期草图','Journey map locating the point where effort interrupted the habit':'用户旅程图：定位操作负担打断习惯的节点','The research changed the interaction model, not only the interface style.':'研究改变的是交互模型，而不只是界面样式。','Your browser cannot play this prototype video.':'当前浏览器无法播放原型视频。','Dashboard':'仪表盘','Photo or voice':'照片或语音','Updated balance':'更新后的余额','Clarify the primary actions on the home screen.':'明确首页的核心操作。','Show an example before users begin speaking.':'在用户开始说话前提供示例。','Replace ambiguous symbols with explicit confirmation language.':'用明确的确认文案取代含义模糊的符号。','Each comparison isolates the interface change; the finding remains readable underneath.':'每组对比只突出界面变化，研究发现则在下方清晰呈现。','Participants confused decorative elements with controls. The revised home screen removes false affordances and centers photo and voice entry.':'参与者曾将装饰元素误认为可操作控件。新版首页移除了错误的可供性提示，并突出照片与语音入口。','Show what useful input sounds like.':'让用户知道有效的语音输入应该是什么样。','A concrete spoken example reduces hesitation and explains how the app will turn a sentence into expense details.':'具体的口述示例能减少犹豫，并解释应用如何把一句话转化为支出信息。','Clear Yes and No language replaces icons whose meaning participants had to infer.':'用明确的“是 / 否”文字取代需要用户猜测含义的图标。',
      'POSITIONING':'定位','SERVICES':'服务','JOURNEY':'旅程'
    });
    Object.assign(genericChinese, {
      'Team':'团队',
      'Visit the site':'访问网站',
      'PRIORITY':'优先级',
      'DECISION':'决策',
      '03 · MVP decision':'03 · MVP 范围决策',
      'MVP decision':'MVP 范围决策',
      'Validation and launch':'验证与上线',
      'align account structure, ownership, and location information.':'统一账号结构、负责人和门店位置信息。',
      'define social, search, website, email, and store hand-offs.':'明确社交媒体、搜索、网站、邮件与门店之间的承接关系。',
      'launch seasonal creative within the shared channel logic.':'在统一的渠道逻辑中推出季节性创意内容。',
      'measure reach, qualified site visits, store-intent actions, and campaign learning.':'衡量触达、有效网站访问、到店意向行为与活动学习成果。'
    });
    const textRecords = [];
    const recordedTextNodes = new WeakSet();
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim() || node.parentElement?.closest('script,style,[data-i18n],[data-no-translate]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let textNode;
    while ((textNode = walker.nextNode())) {
      textRecords.push({ node: textNode, english: textNode.nodeValue });
      recordedTextNodes.add(textNode);
    }
    const translateLooseText = (language) => textRecords.forEach(({ node, english: value }) => {
      if (!node.isConnected) return;
      if (language === 'en') { node.nodeValue = value; return; }
      const trimmed = value.trim();
      const translated = genericChinese[trimmed];
      if (translated) node.nodeValue = value.replace(trimmed, translated);
    });
    let current = win.localStorage.getItem('portfolio-language') === 'zh' ? 'zh' : 'en';
    const render = () => {
      const source = current === 'zh' ? chinese : english;
      qsa('[data-i18n]').forEach((node) => {
        const value = source[node.dataset.i18n];
        if (value) node.textContent = value;
      });
      translateLooseText(current);
      doc.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en';
      toggles.forEach((toggle) => {
        toggle.textContent = current === 'zh' ? '中文 / EN' : 'EN / 中文';
        toggle.setAttribute('aria-label', current === 'zh' ? '切换为英文' : 'Switch to Chinese');
        toggle.setAttribute('aria-pressed', String(current === 'zh'));
      });
      qsa('[data-menu-toggle]').forEach((toggle) => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-label', current === 'zh' ? (expanded ? '关闭菜单' : '打开菜单') : (expanded ? 'Close menu' : 'Open menu'));
      });
      const playgroundScroller = qs('[data-horizontal-sticky]');
      playgroundScroller?.setAttribute('aria-label', current === 'zh'
        ? 'AI 视觉实验。向下滚动或使用方向键浏览。'
        : 'AI visual experiments. Scroll vertically or use the arrow keys to explore.');
      doc.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: { language: current } }));
    };
    toggles.forEach((toggle) => toggle.addEventListener('click', () => {
      current = current === 'en' ? 'zh' : 'en';
      win.localStorage.setItem('portfolio-language', current);
      render();
    }));
    render();
    const registerDynamicText = (root) => {
      const dynamicWalker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (recordedTextNodes.has(node) || !node.nodeValue.trim() || node.parentElement?.closest('script,style,[data-i18n],[data-no-translate]')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const additions = [];
      let dynamicNode;
      while ((dynamicNode = dynamicWalker.nextNode())) {
        const englishValue = dynamicNode.nodeValue;
        recordedTextNodes.add(dynamicNode);
        textRecords.push({ node: dynamicNode, english: englishValue });
        additions.push({ node: dynamicNode, english: englishValue });
      }
      if (current === 'zh') additions.forEach(({ node, english: value }) => {
        const trimmed = value.trim();
        if (genericChinese[trimmed]) node.nodeValue = value.replace(trimmed, genericChinese[trimmed]);
      });
    };
    new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.parentElement) registerDynamicText(node.parentElement);
      else if (node.nodeType === Node.ELEMENT_NODE) registerDynamicText(node);
    }))).observe(doc.body, { childList: true, subtree: true });
  }

  function initTypewriter() {
    const output = qs('[data-typewriter]');
    const prefix = qs('[data-role-prefix]');
    if (!output) return;
    const roleSets = {
      en: ['AI Product Designer', 'UX Researcher', 'Systems Thinker', 'Lucy Xin Liu'],
      zh: ['AI 产品设计师', '用户研究者', '系统思考者', 'Lucy Xin Liu']
    };
    let language = doc.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timer = 0;

    const stop = () => win.clearTimeout(timer);
    const setPrefix = () => {
      if (prefix) prefix.textContent = language === 'zh' ? '我是 ' : 'I’m a\u00a0';
    };
    const tick = () => {
      const roles = roleSets[language];
      const role = roles[roleIndex % roles.length];
      if (reduceMotion.matches) {
        output.textContent = role;
        return;
      }
      characterIndex += deleting ? -1 : 1;
      output.textContent = role.slice(0, Math.max(0, characterIndex));
      let delay = deleting ? 38 : 72;
      if (!deleting && characterIndex >= role.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 360;
      }
      timer = win.setTimeout(tick, delay);
    };
    const restart = (nextLanguage = language) => {
      stop();
      language = nextLanguage;
      roleIndex = 0;
      characterIndex = 0;
      deleting = false;
      setPrefix();
      output.textContent = reduceMotion.matches ? roleSets[language][0] : '';
      if (!reduceMotion.matches) timer = win.setTimeout(tick, 260);
    };
    doc.addEventListener('portfolio-language-change', (event) => restart(event.detail?.language === 'zh' ? 'zh' : 'en'));
    reduceMotion.addEventListener?.('change', () => restart(language));
    restart(language);
  }

  function initCustomCursor() {
    const cursor = qs('.custom-cursor');
    if (!cursor || !finePointer.matches || reduceMotion.matches) {
      cursor?.setAttribute('hidden', '');
      return;
    }
    doc.body.classList.add('cursor-enabled');
    let x = -100;
    let y = -100;
    let targetX = x;
    let targetY = y;
    let frame = 0;
    const label = qs('[data-cursor-label], span', cursor);
    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      cursor.style.setProperty('--cursor-x', `${x}px`);
      cursor.style.setProperty('--cursor-y', `${y}px`);
      frame = win.requestAnimationFrame(tick);
    };
    doc.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add('is-visible');
      if (!frame) frame = win.requestAnimationFrame(tick);
    }, { passive: true });
    doc.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    qsa('[data-cursor]').forEach((target) => {
      target.addEventListener('pointerenter', () => {
        const originalText = target.dataset.cursor || 'view';
        const cursorTranslations = {
          'view': '查看',
          'view project': '查看项目',
          'view series': '查看系列'
        };
        const text = doc.documentElement.lang.startsWith('zh')
          ? (cursorTranslations[originalText.trim().toLowerCase()] || originalText)
          : originalText;
        if (label) label.innerHTML = text.trim().split(/\s+/).join('<br>');
        else cursor.textContent = text;
        cursor.classList.add('is-active', 'is-hovering');
      });
      target.addEventListener('pointerleave', () => cursor.classList.remove('is-active', 'is-hovering'));
    });
  }

  function initCaseStudyExperience() {
    const page = qs('.case-page');
    if (!page) return;
    const pathName = win.location.pathname.replace(/\/+$/, '');
    const routeName = decodeURIComponent(pathName.split('/').pop() || 'index');
    const currentPage = routeName.includes('.') ? routeName : `${routeName}.html`;
    const projects = {
      'geeellink.html': { title: 'Geeelink', subtitle: 'AI Video Production Workflow', image: 'images/lucy/case-studies/geeellink/hifi/storyboard.png' },
      'ourjourneyman.html': { title: 'OurJourneyMan', subtitle: 'Custom Commission Platform', image: 'images/lucy/case-studies/ourjourneyman/ourjourneyman-mockup.png', fit: 'contain' },
      'snapbudget.html': { title: 'SnapBudget', subtitle: 'Low-effort Expense Capture', image: 'images/lucy/case-studies/snapbudget/snapbudget-mockup.jpg', fit: 'contain' },
      'ide-web-design.html': { title: 'iDE', subtitle: 'Education Consultancy Website', image: 'images/lucy/case-studies/ide/ide-desktop-home.png' },
      'hiyogurt.html': { title: 'Hi Yogurt', subtitle: 'Digital Acquisition Strategy', image: 'images/lucy/case-studies/hiyogurt/hiyogurt-campaign-cover.png' }
    };
    const showcaseMarkup = {
      'geeellink.html': `<section class="case-showcase case-showcase--geeellink" aria-label="Geeelink final interface preview"><div class="case-showcase__ambient" aria-hidden="true"></div><div class="case-showcase__copy"><small>AI VIDEO PRODUCTION WORKFLOW</small><h2>Geeelink</h2><p>Seven connected stages. One visible production state.</p></div><figure class="case-showcase__desktop case-showcase__desktop--main"><img src="images/lucy/case-studies/geeellink/hifi/storyboard.png" alt="Geeelink storyboard and AI quality review interface"></figure><figure class="case-showcase__desktop case-showcase__desktop--support"><img src="images/lucy/case-studies/geeellink/hifi/art-assets.png" alt="Geeelink reusable art assets interface"></figure><span class="case-showcase__scroll">Scroll to unpack the work ↓</span></section>`,
      'ourjourneyman.html': `<section class="case-showcase case-showcase--ourjourneyman" aria-label="OurJourneyMan final client and artisan interface preview"><div class="case-showcase__copy"><small>DUAL-SIDED COMMISSION EXPERIENCE</small><h2>OurJourneyMan</h2><p>One material decision, seen from both sides.</p></div><div class="case-showcase__phones"><figure><img src="images/lucy/case-studies/ourjourneyman/client-discover.png" alt="Client artisan discovery interface"></figure><figure><img src="images/lucy/case-studies/ourjourneyman/client-status.png" alt="Client commission status interface"></figure><figure><img src="images/lucy/case-studies/ourjourneyman/artisan-alternatives.png" alt="Artisan material alternatives interface"></figure><figure><img src="images/lucy/case-studies/ourjourneyman/artisan-record.png" alt="Artisan updated project record interface"></figure></div><span class="case-showcase__scroll">Scroll to unpack the work ↓</span></section>`,
      'snapbudget.html': `<section class="case-showcase case-showcase--snapbudget" aria-label="SnapBudget final expense capture interface preview"><div class="case-showcase__copy"><small>END-TO-END MOBILE UX</small><h2>SnapBudget</h2><p>Capture, confirm, and understand the change.</p></div><div class="case-showcase__phones"><figure><img src="images/lucy/case-studies/snapbudget/hifi/dashboard.png" alt="SnapBudget dashboard"></figure><figure><img src="images/lucy/case-studies/snapbudget/hifi/entry-methods.png" alt="SnapBudget expense entry methods"></figure><figure><img src="images/lucy/case-studies/snapbudget/hifi/review-confirm.png" alt="SnapBudget expense review and confirmation"></figure><figure><img src="images/lucy/case-studies/snapbudget/hifi/updated-balances.png" alt="SnapBudget updated balances"></figure></div><span class="case-showcase__scroll">Scroll to unpack the work ↓</span></section>`,
      'hiyogurt.html': `<section class="case-showcase case-showcase--hiyogurt" aria-label="Hi Yogurt acquisition strategy preview"><div class="case-showcase__copy"><small>DIGITAL ACQUISITION STRATEGY</small><h2>Hi Yogurt</h2><p>Turning seasonal discovery into a connected path to store.</p></div><figure class="case-showcase__strategy"><img src="images/lucy/case-studies/hiyogurt/source/campaign-concept.png" alt="Warm bubble tea or cool yogurt seasonal campaign concept"></figure><span class="case-showcase__scroll">Scroll to unpack the work ↓</span></section>`
    };
    const relatedOrder = {
      'geeellink.html': ['ourjourneyman.html', 'snapbudget.html'],
      'ourjourneyman.html': ['geeellink.html', 'snapbudget.html'],
      'snapbudget.html': ['ourjourneyman.html', 'ide-web-design.html'],
      'ide-web-design.html': ['geeellink.html', 'snapbudget.html'],
      'hiyogurt.html': ['geeellink.html', 'ide-web-design.html']
    };
    const nextSection = qs('.case-next', page);
    if (nextSection) {
      const related = doc.createElement('section');
      related.className = 'case-related';
      related.setAttribute('aria-labelledby', 'related-title');
      const relatedPages = relatedOrder[currentPage] || ['ourjourneyman.html', 'snapbudget.html'];
      related.innerHTML = `<div class="case-shell"><h2 id="related-title">Curious to see more?</h2><div class="case-related-grid">${relatedPages.map((href) => {
        const project = projects[href];
        return `<a class="case-related-card" href="${href}"><span class="case-related-media"><img class="${project.fit === 'contain' ? 'is-contain' : ''}" src="${project.image}" alt="${project.title} case study cover" loading="lazy"></span><small>${project.title}</small><strong>${project.subtitle}</strong></a>`;
      }).join('')}</div></div>`;
      const contact = doc.createElement('section');
      contact.className = 'contact case-contact';
      contact.id = 'contact';
      contact.setAttribute('aria-labelledby', 'contact-title');
      contact.dataset.contact = '';
      contact.innerHTML = `<div class="contact__spotlight" data-contact-spotlight aria-hidden="true"></div><div class="contact__inner"><p class="contact-kicker">Open to Product Design and UX Design opportunities.</p><h2 id="contact-title" class="contact__title contact-cta" data-contact-cta><span class="cta-line"><span class="cta-word cta-word-left">Let’s</span></span><span class="cta-line"><span class="cta-word cta-word-right">Collaborate!</span></span></h2><footer class="footer footer-grid"><div class="footer__column footer-column"><p class="footer__label footer-label">Menu</p><ul><li><a href="index.html#top">Home</a></li><li><a href="index.html#work">Work</a></li><li><a href="index.html#playground">AI Visual Experiments</a></li><li><a href="about.html">About</a></li></ul></div><div class="footer__column footer-column"><p class="footer__label footer-label">Connect</p><ul><li><a href="https://www.linkedin.com/in/xinliu2001" target="_blank" rel="noreferrer">LinkedIn ↗</a></li><li><a href="mailto:liuxin20011206@gmail.com">Email</a></li><li><a href="resume/Xin_Liu_Resume_Product_Design.pdf" target="_blank" rel="noreferrer">Résumé ↗</a></li></ul></div><div class="footer__column footer__hello footer-column"><p class="footer__label footer-label">Say hello</p><a class="footer-email" href="mailto:liuxin20011206@gmail.com">liuxin20011206@Gmail.com</a><p class="footer-location"><span class="section-status-dot" aria-hidden="true"></span>Open to Toronto and Shanghai.</p></div><div class="footer__bottom footer-meta"><p>© 2026 Lucy Xin Liu. All rights reserved.</p><a href="#case-content">Back to top <span aria-hidden="true">↑</span></a></div></footer></div>`;
      nextSection.replaceWith(related, contact);
    }
    const caseMain = qs('.case-main', page);
    const currentShowcase = showcaseMarkup[currentPage];
    if (caseMain && currentShowcase) {
      const stage = doc.createElement('div');
      stage.innerHTML = currentShowcase;
      caseMain.prepend(stage.firstElementChild);
    }
    if (caseMain && finePointer.matches && !reduceMotion.matches) {
      page.addEventListener('pointermove', (event) => {
        caseMain.style.setProperty('--cover-x', `${((event.clientX / win.innerWidth) - 0.5) * 18}px`);
        caseMain.style.setProperty('--cover-y', `${((event.clientY / win.innerHeight) - 0.5) * 18}px`);
      }, { passive: true });
      page.addEventListener('pointerleave', () => {
        caseMain.style.setProperty('--cover-x', '0px');
        caseMain.style.setProperty('--cover-y', '0px');
      });
    }
    const blocks = qsa('.case-block:not(.case-role-films-section)', page);
    const header = qs('.site-header', page);

    const sectionNav = doc.createElement('nav');
    sectionNav.className = 'case-section-nav';
    sectionNav.setAttribute('aria-label', 'Case study sections');
    const navList = doc.createElement('ol');
    blocks.forEach((block, blockIndex) => {
      const id = block.id || `sec-${String(blockIndex + 1).padStart(2, '0')}`;
      block.id = id;
      const label = qs('.case-label', block)?.textContent?.split('·').slice(1).join('·').trim() || `Section ${blockIndex + 1}`;
      const item = doc.createElement('li');
      const anchor = doc.createElement('a');
      anchor.href = `#${id}`;
      anchor.innerHTML = `<span>${String(blockIndex + 1).padStart(2, '0')}</span><em>${label}</em>`;
      if (blockIndex === 0) anchor.classList.add('is-active');
      item.appendChild(anchor);
      navList.appendChild(item);
    });
    sectionNav.appendChild(navList);
    page.appendChild(sectionNav);
    sectionNav.addEventListener('pointerenter', () => sectionNav.classList.add('is-expanded'));
    sectionNav.addEventListener('pointerleave', () => sectionNav.classList.remove('is-expanded'));
    sectionNav.addEventListener('focusin', () => sectionNav.classList.add('is-expanded'));
    sectionNav.addEventListener('focusout', (event) => {
      if (!sectionNav.contains(event.relatedTarget)) sectionNav.classList.remove('is-expanded');
    });
    const readHud = doc.createElement('div');
    readHud.className = 'case-read-hud';
    readHud.setAttribute('aria-hidden', 'true');
    readHud.innerHTML = `<span>${Math.max(4, blocks.length + 2)}′</span><i></i><b>01 / ${String(blocks.length).padStart(2, '0')}</b>`;
    page.appendChild(readHud);

    const navLinks = qsa('a', sectionNav);
    if ('IntersectionObserver' in win) {
      const sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const activeIndex = blocks.indexOf(visible.target);
        navLinks.forEach((link, index) => link.classList.toggle('is-active', index === activeIndex));
        sectionNav.style.setProperty('--case-index', String(activeIndex));
        const hudCount = qs('b', readHud);
        if (hudCount) hudCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(blocks.length).padStart(2, '0')}`;
      }, { rootMargin: '-38% 0px -55% 0px', threshold: [0.08, 0.2, 0.4] });
      blocks.forEach((block) => sectionObserver.observe(block));
    }

    const evidence = qsa('.case-evidence', page);
    if ('IntersectionObserver' in win) {
      const evidenceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      evidence.forEach((item) => evidenceObserver.observe(item));
    } else {
      evidence.forEach((item) => item.classList.add('is-visible'));
    }

    const comparisons = qsa('[data-case-compare]', page);
    comparisons.forEach((comparison) => {
      const controls = qsa('[data-compare-state]', comparison);
      let timer = 0;
      let visible = !('IntersectionObserver' in win);
      const duration = 3600;
      const render = (state) => {
        comparison.dataset.active = state;
        controls.forEach((control) => control.setAttribute('aria-pressed', String(control.dataset.compareState === state)));
      };
      const stop = () => {
        win.clearInterval(timer);
        timer = 0;
        comparison.classList.remove('is-ticking');
      };
      const start = () => {
        if (!visible || reduceMotion.matches || timer || doc.hidden) return;
        comparison.classList.add('is-ticking');
        timer = win.setInterval(() => render(comparison.dataset.active === 'before' ? 'after' : 'before'), duration);
      };
      const restart = () => { stop(); start(); };
      controls.forEach((control) => control.addEventListener('click', () => {
        render(control.dataset.compareState || 'before');
        restart();
      }));
      comparison.addEventListener('pointerenter', stop);
      comparison.addEventListener('pointerleave', start);
      comparison.addEventListener('focusin', stop);
      comparison.addEventListener('focusout', (event) => { if (!comparison.contains(event.relatedTarget)) start(); });
      if ('IntersectionObserver' in win) {
        const comparisonObserver = new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) start();
          else stop();
        }, { threshold: 0.25 });
        comparisonObserver.observe(comparison);
      }
      doc.addEventListener('visibilitychange', () => { if (doc.hidden) stop(); else start(); });
      render(comparison.dataset.active || 'before');
      start();
    });

    const zoomButtons = qsa('.case-evidence button', page).filter((button) => button.querySelector('img'));
    if (zoomButtons.length) {
      const lightbox = doc.createElement('div');
      lightbox.className = 'case-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Expanded project image');
      lightbox.innerHTML = '<div class="case-lightbox__stage"><button type="button" aria-label="Close expanded image">×</button><img alt=""></div>';
      page.appendChild(lightbox);
      const lightboxImage = qs('img', lightbox);
      const closeButton = qs('button', lightbox);
      let previousFocus = null;
      const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        page.style.overflow = '';
        previousFocus?.focus();
      };
      const openLightbox = (button) => {
        const source = qs('img', button);
        if (!source || !lightboxImage) return;
        previousFocus = button;
        lightboxImage.src = source.currentSrc || source.src;
        lightboxImage.alt = source.alt;
        lightbox.classList.add('is-open');
        page.style.overflow = 'hidden';
        closeButton?.focus();
      };
      doc.addEventListener('click', (event) => {
        const button = event.target.closest?.('.case-evidence button');
        if (!button || !button.querySelector('img')) return;
        openLightbox(button);
      }, true);
      closeButton?.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
      doc.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox(); });
    }

    const media = qsa('.case-placeholder', page);
    qsa('.case-list li', page).forEach((item) => {
      const number = item.querySelector(':scope > span');
      if (!number || item.querySelector(':scope > .case-list-copy')) return;
      const copy = doc.createElement('div');
      copy.className = 'case-list-copy';
      Array.from(item.childNodes).filter((node) => node !== number).forEach((node) => copy.appendChild(node));
      item.appendChild(copy);
    });
    media.forEach((figure, mediaIndex) => {
      const originalLabel = qs('span', figure)?.textContent?.trim() || 'Image placeholder';
      figure.dataset.caseMedia = '';
      figure.style.setProperty('--media-stack-offset', `${mediaIndex * 14}px`);
      figure.setAttribute('aria-label', `${originalLabel}. Animated image placeholder.`);
      figure.innerHTML = '';

      const stage = doc.createElement('div');
      stage.className = 'case-media-stage';
      const labels = [originalLabel, 'Interaction state · replace with your second frame', 'Detail state · replace with your third frame'];
      labels.forEach((label, frameIndex) => {
        const frame = doc.createElement('div');
        frame.className = `case-media-frame${frameIndex === 0 ? ' is-active' : ''}`;
        frame.dataset.frame = String(frameIndex);
        frame.innerHTML = `<div class="case-media-window"><i></i><i></i><i></i><div class="case-media-skeleton"><b></b><b></b><b></b><b></b><b></b></div></div><p>${label}</p><span>${String(frameIndex + 1).padStart(2, '0')} / 03</span>`;
        stage.appendChild(frame);
      });
      figure.appendChild(stage);

      const controls = doc.createElement('div');
      controls.className = 'case-media-controls';
      controls.innerHTML = '<button type="button" data-case-prev aria-label="Previous image state">←</button><div><span></span></div><button type="button" data-case-next aria-label="Next image state">→</button>';
      figure.appendChild(controls);
      const frames = qsa('.case-media-frame', figure);
      const progress = qs('.case-media-controls div span', figure);
      let frameIndex = 0;
      let timer = 0;
      const renderFrame = (nextIndex) => {
        frameIndex = (nextIndex + frames.length) % frames.length;
        frames.forEach((frame, index) => frame.classList.toggle('is-active', index === frameIndex));
        figure.style.setProperty('--media-progress', `${((frameIndex + 1) / frames.length) * 100}%`);
        if (progress) progress.style.width = `${((frameIndex + 1) / frames.length) * 100}%`;
      };
      const stop = () => win.clearTimeout(timer);
      const schedule = () => {
        stop();
        if (mediaIndex !== 0 || reduceMotion.matches || !figure.classList.contains('is-visible')) return;
        timer = win.setTimeout(() => { renderFrame(frameIndex + 1); schedule(); }, 3000);
      };
      qs('[data-case-prev]', figure)?.addEventListener('click', (event) => { event.stopPropagation(); renderFrame(frameIndex - 1); schedule(); });
      qs('[data-case-next]', figure)?.addEventListener('click', (event) => { event.stopPropagation(); renderFrame(frameIndex + 1); schedule(); });
      figure.addEventListener('pointermove', (event) => {
        const rect = figure.getBoundingClientRect();
        figure.style.setProperty('--media-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 10}px`);
        figure.style.setProperty('--media-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`);
      }, { passive: true });
      figure.addEventListener('pointerleave', () => { figure.style.setProperty('--media-x', '0px'); figure.style.setProperty('--media-y', '0px'); });
      if ('IntersectionObserver' in win) {
        const mediaObserver = new IntersectionObserver(([entry]) => {
          figure.classList.toggle('is-visible', Boolean(entry?.isIntersecting));
          if (entry?.isIntersecting) schedule(); else stop();
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        mediaObserver.observe(figure);
      } else { figure.classList.add('is-visible'); schedule(); }
      renderFrame(mediaIndex % frames.length);
    });

    let scrollTicking = false;
    const updateHeader = () => {
      scrollTicking = false;
      const hero = qs('.case-hero', page);
      const compact = hero ? win.scrollY > hero.offsetHeight * 0.72 : win.scrollY > 560;
      const relatedSection = qs('.case-related', page);
      const beforeRelated = !relatedSection || win.scrollY < relatedSection.offsetTop - win.innerHeight * 0.35;
      page.classList.toggle('case-sheet-visible', win.scrollY > win.innerHeight * 0.42);
      sectionNav.classList.toggle('is-visible', compact && beforeRelated);
      readHud.classList.toggle('is-visible', compact && beforeRelated);
    };
    win.addEventListener('scroll', () => {
      if (!scrollTicking) { scrollTicking = true; win.requestAnimationFrame(updateHeader); }
    }, { passive: true });
    updateHeader();
  }

  function initRemoteImageFallbacks() {
    qsa('img[data-fallback],img[data-remote-src]').forEach((image) => {
      const fallback = image.dataset.fallback;
      const useFallback = () => {
        if (!fallback) return;
        if (image.src.endsWith(fallback)) return;
        image.removeEventListener('error', useFallback);
        image.src = fallback;
        image.classList.add('is-fallback');
      };
      if (fallback) {
        image.addEventListener('error', useFallback, { once: true });
        if (image.complete && image.naturalWidth === 0) useFallback();
      }
      if (image.dataset.remoteSrc) {
        const remote = new Image();
        remote.onload = () => { image.src = image.dataset.remoteSrc; image.classList.add('has-live-capture'); };
        remote.src = image.dataset.remoteSrc;
      }
    });
  }

  function initProjectsGallery() {
    const page = qs('[data-gallery-category]');
    const grid = qs('[data-gallery-grid]', page || doc);
    if (!page || !grid) return;
    const normalizedPath = win.location.pathname.replace(/\/+$/, '');
    const routeMatch = normalizedPath.match(/projects-(web|app|print|sculpture|drawing)(?:\.html)?$/);
    const category = page.dataset.galleryCategory || routeMatch?.[1] || 'web';
    page.dataset.galleryCategory = category;
    const galleries = {
      web: [
        { title: 'iDE Education', meta: 'Education website · 2026', src: 'images/lucy/case-studies/ide/ide-desktop-home.png', alt: 'iDE education website displayed on a desktop monitor', className: 'gallery-work--wide', href: 'ide-web-design.html' },
        { title: 'Geeelink', meta: 'AI production platform · 2026', src: 'images/lucy/case-studies/geeellink/hifi/storyboard.png', alt: 'Geeelink AI production workspace', className: 'gallery-work--wide', href: 'geeellink.html' }
      ],
      app: [
        { title: 'OurJourneyMan', meta: 'Two-sided service app · 2026', images: ['images/lucy/case-studies/ourjourneyman/client-status.png','images/lucy/case-studies/ourjourneyman/artisan-alternatives.png','images/lucy/case-studies/ourjourneyman/client-discover.png'], alt: 'OurJourneyMan client and artisan interfaces', className: 'gallery-work--wide gallery-work--app-preview', href: 'ourjourneyman.html' },
        { title: 'SnapBudget', meta: 'Personal finance app · 2025', images: ['images/lucy/case-studies/snapbudget/hifi/dashboard.png','images/lucy/case-studies/snapbudget/hifi/entry-methods.png','images/lucy/case-studies/snapbudget/hifi/review-confirm.png'], alt: 'SnapBudget high-fidelity mobile interfaces', className: 'gallery-work--wide gallery-work--app-preview', href: 'snapbudget.html' }
      ],
      print: [
        { title: 'Time Travel', meta: 'Screen printing · 2024', src: 'images/lucy/beyond/time-travel-horizontal.jpg', alt: 'Time Travel screen print in blue and orange', className: 'gallery-work--wide' },
        { title: 'Zodiac Accordion Booklet', meta: 'Screen printing · 2024', src: 'images/lucy/beyond/folded-screenprints.jpg', alt: 'Accordion-fold screen printed zodiac booklet', className: '' },
        { title: 'Blood Rose', meta: 'Linocut · 2022', src: 'images/lucy/beyond/blood-rose.jpg', alt: 'Blood Rose black-and-white linocut', className: '' },
        { title: 'Lantern Intaglio I', meta: 'Intaglio · 2023', src: 'images/lucy/beyond/lanterns-one.jpg', alt: 'Colorful intaglio print exploring Chinese lantern forms', className: '' },
        { title: 'Lantern Intaglio II', meta: 'Intaglio · 2023', src: 'images/lucy/beyond/lanterns-two.jpg', alt: 'Second intaglio print exploring lantern forms', className: '' }
      ],
      sculpture: [
        { title: 'Jellyfish', meta: 'Mixed-media sculpture', src: 'images/lucy/beyond/jellyfish-sculpture-vertical.jpg', alt: 'Suspended mixed-media jellyfish sculpture', className: 'gallery-work--portrait' },
        { title: 'Material Creature', meta: 'Mixed-media sculpture', src: 'images/lucy/beyond/fish-sculpture.jpg', alt: 'Textured mixed-media fish sculpture', className: 'gallery-work--portrait' }
      ],
      drawing: [
        { title: 'Watercolor Sketchbook', meta: 'Watercolor · Personal practice', src: 'images/lucy/drawing/watercolor-process.jpg', alt: 'Watercolor sketchbook and painting materials', className: 'gallery-work--portrait' },
        { title: 'Cozy Animals', meta: 'Watercolor · Sketchbook', src: 'images/lucy/drawing/cozy-animals.jpg', alt: 'Watercolor sketch of cozy animals in bed', className: 'gallery-work--portrait' },
        { title: 'Fish Glory', meta: 'Watercolor · Sketchbook', src: 'images/lucy/drawing/fish-glory.jpg', alt: 'Playful watercolor sketch of cats holding a fish', className: 'gallery-work--portrait' },
        { title: 'Garden Path', meta: 'Graphite · Observational drawing', src: 'images/lucy/drawing/garden-path.jpg', alt: 'Graphite drawing of a Chinese garden path', className: '' },
        { title: 'Waterfront', meta: 'Graphite · Observational drawing', src: 'images/lucy/drawing/waterfront.jpg', alt: 'Graphite drawing of a waterfront and bridge', className: '' },
        { title: 'Courtyard House', meta: 'Graphite · Architectural study', src: 'images/lucy/drawing/courtyard-house.jpg', alt: 'Graphite architectural drawing of a courtyard house', className: '' },
        { title: 'Moon Gate', meta: 'Graphite · Observational drawing', src: 'images/lucy/drawing/moon-gate.jpg', alt: 'Graphite drawing of a moon gate reflected in water', className: '' }
      ]
    };
    const categoryMeta = {
      web: { title: 'Web Design', kicker: 'Responsive interfaces · 02 projects', description: 'Two responsive web products shaped around clear information architecture, purposeful visual systems, and real user journeys.', prev: ['Drawing', 'projects-drawing.html'], next: ['App Design', 'projects-app.html'] },
      app: { title: 'App Design', kicker: 'Product UI · 02 case studies', description: 'Two mobile product experiences built around real workflows, visible decisions, and usability-led iteration.', prev: ['Web Design', 'projects-web.html'], next: ['Print Media', 'projects-print.html'] },
      print: { title: 'Print Media', kicker: 'Printmaking · Poster design', description: 'Screen print, intaglio, linocut, artist books, and poster systems—work where material, rhythm, and negative space carry the idea.', prev: ['App Design', 'projects-app.html'], next: ['Sculpture', 'projects-sculpture.html'] },
      sculpture: { title: 'Sculpture', kicker: 'Mixed media · Material studies', description: 'Physical studies built through texture, suspension, repetition, and the expressive possibilities of ordinary materials.', prev: ['Print Media', 'projects-print.html'], next: ['Drawing', 'projects-drawing.html'] },
      drawing: { title: 'Drawing', kicker: 'Illustration · Observation', description: 'A growing collection of observational and botanical drawing focused on structure, line, and patient looking.', prev: ['Sculpture', 'projects-sculpture.html'], next: ['Web Design', 'projects-web.html'] }
    };
    const meta = categoryMeta[category] || categoryMeta.web;
    const pageTitle = qs('[data-gallery-title]', page);
    const pageKicker = qs('[data-gallery-kicker]', page);
    const pageDescription = qs('[data-gallery-description]', page);
    const prevLink = qs('[data-gallery-prev]', page);
    const nextLink = qs('[data-gallery-next]', page);
    if (pageTitle) pageTitle.textContent = meta.title;
    if (pageKicker) pageKicker.textContent = meta.kicker;
    if (pageDescription) pageDescription.textContent = meta.description;
    if (prevLink) { prevLink.href = meta.prev[1]; prevLink.textContent = `← ${meta.prev[0]}`; }
    if (nextLink) { nextLink.href = meta.next[1]; nextLink.textContent = `${meta.next[0]} →`; }
    doc.title = `${meta.title} — Lucy Xin Liu`;
    const items = galleries[category] || [];
    grid.innerHTML = items.map((item) => {
      const media = item.images
        ? `<div class="gallery-work__media gallery-work__media--devices">${item.images.map((src, imageIndex) => `<img src="${src}" alt="${imageIndex === 0 ? item.alt : ''}"${imageIndex ? ' aria-hidden="true"' : ''} loading="lazy">`).join('')}</div>`
        : `<div class="gallery-work__media"><img src="${item.src}"${item.fallback ? ` data-fallback="${item.fallback}"` : ''}${item.remoteSrc ? ` data-remote-src="${item.remoteSrc}"` : ''} alt="${item.alt}" loading="lazy"></div>`;
      const content = `${media}<figcaption><h2>${item.title}</h2><p>${item.meta}</p>${item.href ? '<span>View project ↗</span>' : ''}</figcaption>`;
      return item.href
        ? `<a class="gallery-work gallery-work--link reveal ${item.className || ''}" data-reveal href="${item.href}">${content}</a>`
        : `<figure class="gallery-work reveal ${item.className || ''}" data-reveal>${content}</figure>`;
    }).join('');
    initRemoteImageFallbacks();
  }

  onReady(() => {
    initPreloader();
    initNavigation();
    initHeroCanvas();
    initImageTrail();
    initAudienceTabs();
    initFeaturedWork();
    initPlayground();
    initPosterGallery();
    initWebPreview();
    initVisualGallery();
    initInterestJourney();
    initPhotoDiary();
    initArtworkLightbox();
    initProjectsGallery();
    initRemoteImageFallbacks();
    initPerformanceStage();
    initReveal();
    initProcessAnimation();
    initCaseStudyExperience();
    initFooterSpotlight();
    initContactWords();
    initLanguageToggle();
    initTypewriter();
    initCustomCursor();
  });
})();
