(function () {
  // Chặn chạy lần 2 nếu script bị nạp trùng
  if (window.__styleInjectorLoaded) return;
  window.__styleInjectorLoaded = true;

  console.log("style-injector loaded");

  const CSS_TEXT = `
/* ===== WIX LOGO GALLERY ===== */
.gallery-horizontal-scroll {
    width: 100% !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
}

.gallery-horizontal-scroll-inner {
    display: flex !important;
    align-items: center !important;
}

.gallery-horizontal-scroll [data-hook="group-view"] {
    width: 240px !important;
    min-width: 240px !important;
    max-width: 240px !important;
    height: 165px !important;
    min-height: 165px !important;
    max-height: 165px !important;
}

.gallery-horizontal-scroll .item-link-wrapper {
    width: 240px !important;
    height: 165px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.gallery-horizontal-scroll .gallery-item-container {
    width: 220px !important;
    min-width: 220px !important;
    max-width: 220px !important;
    height: 140px !important;
    min-height: 140px !important;
    max-height: 140px !important;
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
    inset: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
}

.gallery-horizontal-scroll .gallery-item-wrapper {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.gallery-horizontal-scroll .gallery-item-content {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
    overflow: hidden !important;
}

.gallery-horizontal-scroll picture {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
}

.gallery-horizontal-scroll img[data-hook="gallery-item-image-img"] {
    position: static !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: auto !important;
    height: auto !important;
    max-width: 85% !important;
    max-height: 75% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    margin: 0 auto !important;
    padding: 0 !important;
    display: block !important;
    object-fit: contain !important;
    object-position: center center !important;
    transform: none !important;
}

.gallery-horizontal-scroll .shrink-on-hover:hover {
    transform: none !important;
}
`;

  if (!document.getElementById("my-injected-style")) {
    const style = document.createElement("style");
    style.id = "my-injected-style";
    style.textContent = CSS_TEXT;
    document.head.appendChild(style);
    console.log("style-injector: CSS injected");
  }

  ["click", "auxclick"].forEach(t =>
    document.addEventListener(
      t,
      e => {
        if (e.target.closest(".gallery-item-container")) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      },
      true
    )
  );
})();
