class StyleInjector extends HTMLElement {
  connectedCallback() {
    if (document.getElementById("my-injected-style")) return;
    const style = document.createElement("style");
    style.id = "my-injected-style";
    style.textContent = `
      /* Test: nếu thấy viền đỏ quanh trang là thành công */
      body { outline: 5px solid red !important; }

      /* CSS của bạn viết tiếp ở dưới */
    `;
    document.head.appendChild(style);
  }
}
if (!customElements.get("style-injector")) {
  customElements.define("style-injector", StyleInjector);
}
