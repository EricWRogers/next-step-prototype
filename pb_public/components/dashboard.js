import { pb, requireAuthOrRedirect, currentUser } from "./pb-client.js";

customElements.define("ns-dashboard-view", class extends HTMLElement {
  connectedCallback() {
    if (!requireAuthOrRedirect()) return;

    this.render();
    this.loadUser();
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

  loadUser() {
    const user = currentUser();
    if (!user) return;

    const greeting = this.querySelector("#greeting");
    greeting.textContent = `Hello, ${user.name || user.email || "there"}`;

    const avatarEl = this.querySelector("#avatar");
    if (user.avatar) {
      const url = pb.files.getURL(user, user.avatar);
      avatarEl.innerHTML = `<img src="${url}" alt="avatar" />`;
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
