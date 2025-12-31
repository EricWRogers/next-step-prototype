import { pb, requireAuthOrRedirect, currentUser } from "./pb-client.js";

customElements.define("ns-top-bar", class extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadUser();
    this.querySelector("#search-icon")
      .addEventListener("click", () => window.location.href = "group-join.html");
  }

  render() {
    this.innerHTML = `
      <div class="top-bar">
        <div class="user-info">
          <div class="avatar"><i data-lucide="user"></i></div>
          <span class="greeting" id="user-greeting">Hello!</span>
        </div>
        <div class="top-icon" id="search-icon"><i data-lucide="search"></i></div>
        <div class="top-icon"><i data-lucide="bell"></i></div>
      </div>
    `;
  }

  loadUser() {
    if (!requireAuthOrRedirect()) return;
    const user = currentUser();
    const name = user.name || user.email || "there";
    this.querySelector("#user-greeting").textContent = `Hello, ${name}`;

    const avatarContainer = this.querySelector(".avatar");
    if (user.avatar) {
      const url = pb.files.getURL(user, user.avatar);
      avatarContainer.innerHTML = `<img src="${url}" alt="${name}" />`;
    }
  }
});
