console.log("style-injector loaded");

const CSS_TEXT = `
/* ===== WIX LOGO GALLERY ===== */
.gallery-horizontal-scroll {
    background: red !important;
}

.gallery-horizontal-scroll * {
    outline: 2px solid blue !important;
}
.gallery-horizontal-scroll {
    width: 100% !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
}

.gallery-horizontal-scroll-inner {
    display: flex !important;
    align-items: center !important;
}

/* Mỗi logo = 1 box bằng nhau */
.gallery-horizontal-scroll [data-hook="group-view"] {
    width: 240px !important;
    min-width: 240px !important;
    max-width: 240px !important;

    height: 165px !important;
    min-height: 165px !important;
    max-height: 165px !important;
}

/* Link */
.gallery-horizontal-scroll .item-link-wrapper {
    width: 240px !important;
    height: 165px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Container */
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

/* Wrapper */
.gallery-horizontal-scroll .gallery-item-wrapper {
    width: 100% !important;
    height: 100% !important;

    margin: 0 !important;
    padding: 0 !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Content */
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

/* Picture phải center */
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

/* IMAGE */
.gallery-horizontal-scroll img[data-hook="gallery-item-image-img"] {
    position: static !important;

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

/* Xóa các positioning Wix áp lên image */
.gallery-horizontal-scroll img[data-hook="gallery-item-image-img"] {
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
}

/* Hover không làm lệch logo */
.gallery-horizontal-scroll .shrink-on-hover:hover {
    transform: none !important;
}
`;

(function () {
  if (document.getElementById("my-injected-style")) return;
  var style = document.createElement("style");
  style.id = "my-injected-style";
  style.textContent = CSS_TEXT;
  document.head.appendChild(style);
  console.log("style-injector: CSS injected");
})();
