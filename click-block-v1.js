["click", "auxclick"].forEach(t =>
  document.addEventListener(t, e => {
    if (e.target.closest(".gallery-item-container")) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true)
);
