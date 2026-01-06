import { pb, requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-notification-view", class extends HTMLElement {
  connectedCallback() {
    this.render();
    this.load();
  }

  render() {
    this.innerHTML = `
      <div class="notification-screen">
        <h2>Group Requests</h2>
        <div class="notification-list" id="notification-list"></div>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  async load() {
    if (!requireAuthOrRedirect()) return;

    const list = this.querySelector("#notification-list");
    if (!list) return;
    list.innerHTML = "";

    const me = pb.authStore.model?.id;
    if (!me) return;

    try {
      const allGroups = await pb.collection("groups").getFullList({ $autoCancel: false });
      const isAdmin = (group) => {
        const adminField = group.admin ?? group.admins ?? [];
        if (Array.isArray(adminField)) {
          return adminField.includes(me);
        }
        return adminField === me;
      };

      const myGroups = allGroups.filter(isAdmin);
      const groupIds = myGroups.map((group) => group.id);
      if (!groupIds.length) {
        list.innerHTML = `<div class="empty-state">You have no groups.</div>`;
        return;
      }

      const filter = groupIds.map((id) => `group="${id}"`).join(" || ");
      const requests = await pb.collection("group_requests").getFullList({
        filter,
        expand: "group,user",
        $autoCancel: false
      });

      if (!requests.length) {
        list.innerHTML = `<div class="empty-state">No pending requests.</div>`;
        return;
      }

      requests.forEach((request) => {
        list.appendChild(this.renderRequest(request));
      });
    } catch (error) {
      list.innerHTML = `<div class="empty-state">Unable to load requests.</div>`;
      console.error(error);
    }
  }

  renderRequest(request) {
    const row = document.createElement("div");
    row.className = "notification-item";

    const group = request.expand?.group;
    const user = request.expand?.user;

    const userAvatar = user?.avatar
      ? pb.files.getURL(user, user.avatar)
      : "/assets/default-avatar.png";

    row.innerHTML = `
      <div class="notification-info">
        <img src="${userAvatar}" alt="${user?.name || "User"}" />
        <div class="notification-text">
          <div class="notification-title">${user?.name || "New request"}</div>
          <div class="notification-subtitle">${group?.name || "Unknown group"}</div>
        </div>
      </div>
      <div class="notification-actions">
        <button class="btn-accept" type="button">Accept</button>
        <button class="btn-decline" type="button">Decline</button>
      </div>
    `;

    const acceptBtn = row.querySelector(".btn-accept");
    const declineBtn = row.querySelector(".btn-decline");

    acceptBtn.addEventListener("click", async () => {
      acceptBtn.disabled = declineBtn.disabled = true;
      try {
          // append to members array
          const members = group.members || [];
          if (!members.includes(request.user)) {
              members.push(request.user);
              await pb.collection("groups").update(group.id, { members });
          }
          // now remove the request
          await pb.collection("group_requests").delete(request.id);
          row.remove();
      } catch (e) {
          alert("Accept failed: " + e.message);
          acceptBtn.disabled = declineBtn.disabled = false;
      }
  });

  declineBtn.addEventListener("click", async () => {
    acceptBtn.disabled = true;
    declineBtn.disabled = true;
    try {
      await pb.collection("group_requests").delete(request.id);
      row.remove();
      this.checkEmptyState();
    } catch (error) {
      alert("Decline failed: " + error.message);
      acceptBtn.disabled = false;
      declineBtn.disabled = false;
    }
  });

  return row;
}

  checkEmptyState() {
    const list = this.querySelector("#notification-list");
    if (!list) return;
    if (list.children.length === 0) {
      list.innerHTML = `<div class="empty-state">No pending requests.</div>`;
    }
  }
});
