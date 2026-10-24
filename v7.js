/* =====================================================================
 * AERON SOLUTION – "Our Clients & Partners" logo slider
 * ---------------------------------------------------------------------
 * - Tự chờ DOM + slider Wix render xong rồi mới chèn (không cần defer,
 *   không cần đợi window.load). Nếu chèn <script> ở <head> vẫn chạy.
 * - Tự tìm section "Our Clients & Partners" trên trang
 * - Ẩn gallery / slider cũ của Wix
 * - Chèn slider logo mới: 4 card / khung nhìn, nút prev-next 2 bên,
 *   kéo chuột / vuốt cảm ứng, snap từng card
 * - Toàn bộ CSS nằm trong Shadow DOM => không dính CSS cũ
 *
 * Cách dùng:
 *   <script src="clients-partners-grid.js" defer></script>
 * hoặc paste vào Console / HTML Embed / Velo.
 * Chạy lại nhiều lần được (không tạo bản trùng).
 * ===================================================================== */
(() => {
  'use strict';

  const HOST_ID = 'aeronsolution-clients-grid';
  const STYLE_ID = 'acp-hide-wix-gallery';
  const POLL_MS = 200;        // kiểm tra lại mỗi 200ms
  const WAIT_MS = 60000;      // chờ tối đa 60s
  const GALLERY_GRACE_MS = 8000; // nếu không thấy .pro-gallery sau 8s thì vẫn chèn

  /* Danh sách logo lấy từ section gốc ------------------------------- */
  const LOGOS = [
    {
      name: 'Organo',
      src: 'https://static.wixstatic.com/media/fc7d16_442edf951df24f41a67f277e961e3802~mv2.png'
    },
    {
      name: 'Atlas',
      src: 'https://static.wixstatic.com/media/fc7d16_3529cb7a6ac94f2b813ee0c7e77e5494~mv2.png'
    },
    {
      name: 'Daniel',
      src: 'https://static.wixstatic.com/media/fc7d16_26f03c7d893a42e7896b419f90acace9~mv2.png'
    },
    {
      name: 'Techvalue Norway',
      src: 'https://static.wixstatic.com/media/fc7d16_6d56dd10d3a64b8882e6b5ef812b6451~mv2.jpg'
    },
    {
      name: 'PTSC M&C',
      src: 'https://static.wixstatic.com/media/fc7d16_82dcd969704b475090210fb31adb2eb7~mv2.jpg'
    },
    {
      name: 'NOV',
      src: 'https://static.wixstatic.com/media/fc7d16_9bddf5b7641940389a9771e11cd2075f~mv2.jpg'
    },
    {
      name: 'Star Global',
      src: 'https://static.wixstatic.com/media/fc7d16_c217e568d4bd4486ae283caf7070dcc3~mv2.jpg/v1/fit/w_960,h_960,q_90,enc_avif,quality_auto/fc7d16_c217e568d4bd4486ae283caf7070dcc3~mv2.jpg'
    },
    {
      name: 'Hoang Tam Consultants',
      src: 'https://static.wixstatic.com/media/fc7d16_d9904dc26f8a487ea8b07f083f9e7500~mv2.png/v1/fit/w_1400,h_275,q_90,enc_avif,quality_auto/fc7d16_d9904dc26f8a487ea8b07f083f9e7500~mv2.png'
    },
    {
      name: 'TechniCo Academy',
      src: 'https://static.wixstatic.com/media/fc7d16_3a4d7c3b7f084c06aa032b684f03807e~mv2.png/v1/fit/w_1400,h_470,q_90,enc_avif,quality_auto/fc7d16_3a4d7c3b7f084c06aa032b684f03807e~mv2.png'
    },
    {
      name: 'E2CS',
      src: 'https://static.wixstatic.com/media/fc7d16_a4948552e0cf44a0a1fc29df67edc039~mv2.png'
    },
    {
      name: 'Getabec',
      src: 'https://static.wixstatic.com/media/fc7d16_6152109745624499a1bed675ef42d4e8~mv2.png'
    }
  ];

  const normalize = (t) => (t || '').replace(/\s+/g, ' ').trim().toLowerCase();

  /* Tìm tiêu đề "Our Clients & Partners" --------------------------- */
  const findHeading = () =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span'))
      .find((el) => el.children.length === 0 &&
        normalize(el.textContent) === 'our clients & partners') || null;

  /* -----------------------------------------------------------------
   * Dựng slider
   * ---------------------------------------------------------------- */
  function build(heading, section, gallery) {
    if (document.getElementById(HOST_ID)) return;

    /* 1) Ẩn gallery / slider cũ của Wix ----------------------------- */
    const commonAncestor = (a, b) => {
      let p = a;
      while (p && !p.contains(b)) p = p.parentElement;
      return p;
    };

    const container = gallery ? commonAncestor(gallery, heading) : heading.parentElement;

    if (gallery && container) {
      let galleryRoot = gallery;
      while (galleryRoot.parentElement && galleryRoot.parentElement !== container) {
        galleryRoot = galleryRoot.parentElement;
      }
      galleryRoot.style.setProperty('display', 'none', 'important');
      ensureHideRule(galleryRoot);
    }
    section.querySelectorAll('.pro-gallery').forEach((g) => {
      g.style.setProperty('display', 'none', 'important');
    });

    /* 2) Cho section tự giãn theo nội dung mới ---------------------- */
    if (container) {
      container.style.setProperty('height', 'auto', 'important');
      container.style.setProperty('grid-template-rows', 'auto', 'important');
    }
    section.style.setProperty('height', 'auto', 'important');
    section.style.setProperty('min-height', '0', 'important');
    section.style.setProperty('padding-bottom', '50px', 'important');

    /* 3) Host + Shadow DOM ----------------------------------------- */
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = [
      'all: initial',
      'display: block',
      'position: relative',
      'z-index: 1',
      'grid-column: 1 / -1',
      'width: 100%',
      'min-width: 0',
      'max-width: 100%',
      'margin: 28px 0 0 0',
      'padding: 0',
      'box-sizing: border-box'
    ].join(';');

    const shadow = host.attachShadow({ mode: 'open' });

    const cards = LOGOS.map((logo) => {
      const name = logo.name
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
      return `
          <figure class="acp-card" role="listitem">
            <img src="${logo.src}" alt="${name}" loading="lazy" decoding="async" draggable="false">
          </figure>`;
    }).join('');

    shadow.innerHTML = `
      <style>
        /* --- reset riêng, không phụ thuộc CSS bên ngoài --- */
        :host {
          all: initial;
          display: block;
          box-sizing: border-box;
          --acp-cols: 4;
          --acp-gap: 16px;
          --acp-line: #d6e4f5;
          --acp-line-hover: #b7d0ee;
          --acp-ink: #33506f;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }

        /* --- khung slider + nút 2 bên --- */
        .acp-shell { position: relative; }

        .acp-nav {
          position: absolute;
          top: 50%;
          z-index: 2;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          padding: 0;
          margin: 0;
          background: #ffffff;
          color: var(--acp-ink);
          border: 1px solid var(--acp-line);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(16, 42, 82, 0.12);
          cursor: pointer;
          transition: background .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease, opacity .18s ease;
        }
        .acp-prev { left: -19px; }
        .acp-next { right: -19px; }
        .acp-nav:hover:not(:disabled) {
          background: #f2f7fe;
          border-color: var(--acp-line-hover);
          box-shadow: 0 4px 14px rgba(16, 42, 82, 0.18);
        }
        .acp-nav:focus-visible {
          outline: 2px solid #4a90d9;
          outline-offset: 2px;
        }
        .acp-nav:disabled {
          opacity: .35;
          cursor: default;
        }
        .acp-nav svg { display: block; width: 18px; height: 18px; }

        /* --- khung slider --- */
        .acp-viewport {
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;          /* Firefox */
          -ms-overflow-style: none;       /* IE / Edge cũ */
          cursor: grab;
        }
        .acp-viewport::-webkit-scrollbar { display: none; }
        .acp-viewport.dragging { cursor: grabbing; scroll-snap-type: none; }
        .acp-viewport.dragging .acp-card { pointer-events: none; }

        .acp-track {
          display: flex;
          gap: var(--acp-gap);
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* --- card --- */
        .acp-card {
          flex: 0 0 calc((100% - (var(--acp-cols) - 1) * var(--acp-gap)) / var(--acp-cols));
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 16 / 10;
          margin: 0;
          padding: 24px;
          background: #ffffff;
          border: 1px solid var(--acp-line);
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(16, 42, 82, 0.04);
          overflow: hidden;
          scroll-snap-align: start;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          user-select: none;
        }
        .acp-card:hover {
          transform: translateY(-2px);
          border-color: var(--acp-line-hover);
          box-shadow: 0 10px 24px rgba(16, 42, 82, 0.10);
        }
        .acp-card img {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          object-position: center;
          filter: none;
          transform: none;
          -webkit-user-drag: none;
        }

        /* --- responsive --- */
        @media (max-width: 1200px) { :host { --acp-cols: 3; } }
        @media (max-width: 820px) {
          :host { --acp-cols: 2; --acp-gap: 12px; }
          .acp-card { aspect-ratio: 4 / 3; padding: 18px; border-radius: 10px; }
          .acp-nav { width: 34px; height: 34px; }
          .acp-prev { left: -17px; }
          .acp-next { right: -17px; }
        }
        @media (max-width: 460px) { :host { --acp-cols: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .acp-card { transition: none; }
          .acp-card:hover { transform: none; }
        }
      </style>

      <div class="acp-shell">
        <button class="acp-nav acp-prev" type="button" aria-label="Previous logos" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="acp-nav acp-next" type="button" aria-label="Next logos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>

        <div class="acp-viewport" tabindex="0"
             role="region" aria-roledescription="carousel" aria-label="Clients and partners logos">
          <div class="acp-track" role="list">
            ${cards}
          </div>
        </div>
      </div>
    `;

    container.appendChild(host);

    /* 4) Hành vi slider -------------------------------------------- */
    const viewport = shadow.querySelector('.acp-viewport');
    const track = shadow.querySelector('.acp-track');
    const prevBtn = shadow.querySelector('.acp-prev');
    const nextBtn = shadow.querySelector('.acp-next');

    const getStep = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      const perView = Math.max(1, Math.round(
        (viewport.clientWidth + gap) / (card.getBoundingClientRect().width + gap)
      ));
      return (card.getBoundingClientRect().width + gap) * perView;
    };

    const updateButtons = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      prevBtn.disabled = viewport.scrollLeft <= 2;
      nextBtn.disabled = viewport.scrollLeft >= max - 2;
    };

    const scrollPage = (dir) => {
      viewport.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollPage(-1));
    nextBtn.addEventListener('click', () => scrollPage(1));

    viewport.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();

    /* kéo bằng chuột (touch đã có scroll native) */
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    viewport.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add('dragging');
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      viewport.scrollLeft = startScroll - (e.clientX - startX);
    });

    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('dragging');
      if (e && viewport.hasPointerCapture?.(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId);
      }
      updateButtons();
    };

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', (e) => { if (dragging) endDrag(e); });

    /* bàn phím: ← → */
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollPage(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollPage(1); }
    });

    console.info(`[clients-grid] Đã chèn slider logo (${LOGOS.length} logo).`);

    /* 5) Tự phục hồi nếu Wix re-render làm mất slider -------------- */
    startKeepAlive();
  }

  /* -----------------------------------------------------------------
   * Chờ DOM / Wix render xong rồi mới chạy
   * Không phụ thuộc DOMContentLoaded: chạy được cả khi script nằm trong
   * <head>, được inject ở document-start, hoặc render kiểu SPA.
   * ---------------------------------------------------------------- */
  let pollTimer = null;
  let observer = null;
  let keepAliveTimer = null;

  /* Ẩn gallery Wix bằng rule trong <head>: rule này sống sót qua các
     lần Wix re-render (style inline trên node có thể bị React ghi đè). */
  function ensureHideRule(root) {
    if (!root || !root.id) return;

    const sel = '#' + (window.CSS && CSS.escape ? CSS.escape(root.id) : root.id);
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    if (!style.textContent.includes(sel)) {
      style.textContent += sel + '{display:none!important}\n';
    }
  }

  /* Kiểm tra định kỳ: host bị Wix xoá thì dựng lại,
     gallery Wix lộ ra thì ẩn lại. */
  function startKeepAlive() {
    if (keepAliveTimer) return;

    keepAliveTimer = setInterval(() => {
      const host = document.getElementById(HOST_ID);

      if (!host) {
        stopWatching();
        if (findHeading()) waitAndInit();
        return;
      }

      const section = host.closest('section');
      const gallery = (section || document).querySelector('.pro-gallery');

      /* Wix re-render có thể ghi đè lại chiều cao cố định của section */
      if (section) {
        section.style.setProperty('height', 'auto', 'important');
        section.style.setProperty('min-height', '0', 'important');
        section.style.setProperty('padding-bottom', '50px', 'important');
      }
      if (host.parentElement) {
        host.parentElement.style.setProperty('height', 'auto', 'important');
        host.parentElement.style.setProperty('grid-template-rows', 'auto', 'important');
      }

      if (!gallery) return;

      const parent = host.parentElement;
      let root = gallery;
      while (root.parentElement && root.parentElement !== parent) {
        root = root.parentElement;
      }
      if (root.parentElement === parent && root !== host) {
        root.style.setProperty('display', 'none', 'important');
        ensureHideRule(root);
      }
    }, 1000);
  }

  function init(allowNoGallery) {
    if (document.getElementById(HOST_ID)) return true;
    if (!document.body) return false;

    const heading = findHeading();
    if (!heading) return false;

    const section =
      heading.closest('section') ||
      heading.closest('[id^="comp-"]')?.parentElement ||
      document.body;

    const gallery = section.querySelector('.pro-gallery');
    if (!gallery && !allowNoGallery) return false;

    build(heading, section, gallery);
    return !!document.getElementById(HOST_ID);
  }

  function stopWatching() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    if (observer) { observer.disconnect(); observer = null; }
  }

  function waitAndInit() {
    if (init()) return;

    let elapsed = 0;

    /* 1) thử lại theo nhịp */
    clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      elapsed += POLL_MS;

      if (init(elapsed >= GALLERY_GRACE_MS)) {
        stopWatching();
        return;
      }

      if (elapsed >= WAIT_MS) {
        stopWatching();
        if (!document.getElementById(HOST_ID)) {
          console.warn('[clients-grid] Không tìm thấy section "Our Clients & Partners" sau ' +
            (WAIT_MS / 1000) + 's.');
        }
      }
    }, POLL_MS);

    /* 2) phản ứng ngay khi section được render (SPA) */
    let scheduled = false;
    observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        if (init(elapsed >= GALLERY_GRACE_MS)) stopWatching();
      }, 150);
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  function boot() {
    if (document.getElementById(HOST_ID)) return;
    if (init()) return;

    console.info('[clients-grid] Script chạy lúc readyState="' +
      document.readyState + '" — đang chờ DOM/section…');
    waitAndInit();
  }

  /* chạy ngay, không đợi event nào */
  boot();

  /* Gọi lại thủ công nếu site SPA re-render làm mất slider:
     window.AeronClientsGrid.mount()  */
  window.AeronClientsGrid = {
    mount() {
      stopWatching();
      document.getElementById(HOST_ID)?.remove();
      return waitAndInit();
    },
    unmount() {
      stopWatching();
      if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
      document.getElementById(HOST_ID)?.remove();
    }
  };
})();
