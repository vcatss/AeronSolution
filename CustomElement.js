class StyleInjector extends HTMLElement {
  connectedCallback() {
    if (document.getElementById("my-injected-style")) return;
    const style = document.createElement("style");
    console.log('ccc');
    style.id = "my-injected-style";
    style.textContent = `
      .my-class { color: red; }
      [id^="comp-"]:hover { opacity: 0.9; }
    `;
    document.head.appendChild(style);
  }
}
customElements.define("style-injector", StyleInjector);
