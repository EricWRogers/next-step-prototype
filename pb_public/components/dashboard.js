import { pb, requireAuthOrRedirect, currentUser } from "./pb-client.js";

customElements.define("ns-dashboard-view", class extends HTMLElement {
  connectedCallback() {
    if (!requireAuthOrRedirect()) return;

    this.render();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <div class="color-grid" id="dashboard-content">
        <div class="top-block"></div>
        <div class="color-box" style="background-color: #fde2cf"></div>
        <div class="color-box" style="background-color: #e4deff"></div>
        <div class="color-box" style="background-color: #cdf1ef"></div>
        <div class="color-box" style="background-color: #fa5c5c"></div>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  bindEvents() {
    this.querySelector("#search-btn")?.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("dashboard-search", {
          bubbles: true,
          composed: true
        })
      );
    });
  }
});
