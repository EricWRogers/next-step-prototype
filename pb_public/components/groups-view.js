import { pb, requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-groups-view", class extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="room-list" id="group-list"></div>
    `;
  }

  async load() {
    if (!requireAuthOrRedirect()) return;

    const list = this.querySelector("#group-list");
    if (!list) return;
    list.innerHTML = "";

    const userId = pb.authStore.model.id;
    const groups = await pb.collection("groups")
      .getFullList({ filter: `members ~ "${userId}"` });

    if (!groups.length) {
      list.textContent = "No groups yet.";
      return;
    }

    groups.forEach((group) => list.appendChild(this.renderGroupCard(group)));
  }

  renderGroupCard(group) {
    const item = document.createElement("div");
    item.className = "room-item";

    const thumbUrl = group.profile
      ? pb.files.getURL(group, group.profile)
      : "/assets/logo.png";

    item.innerHTML = `
      <div class="room-info">
        <img src="${thumbUrl}" alt="${group.name}" />
        <div class="title">${group.name || "Untitled group"}</div>
      </div>
    `;

    item.addEventListener("click", () => {
      window.location.href = "group-join.html";
    });

    return item;
  }
});
