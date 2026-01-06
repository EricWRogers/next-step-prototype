import { pb, requireAuthOrRedirect, currentUser } from "./pb-client.js";

customElements.define("ns-top-bar", class extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadUser();
    this.loadNotifications();
    this.subscribeNotifications();
    this.querySelector("#search-icon")
      .addEventListener("click", () => window.location.href = "group-join.html");
    this.querySelector("#notification-icon")
      .addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("force-tab", { detail: { tab: "notifications" } }));
      });
  }

  disconnectedCallback() {
    this.unsubscribeNotifications();
  }

  render() {
    this.innerHTML = `
      <div class="top-bar">
        <div class="user-info">
          <div class="avatar"><i data-lucide="user"></i></div>
          <span class="greeting" id="user-greeting">Hello!</span>
        </div>
        <div class="top-icon" id="search-icon"><i data-lucide="search"></i></div>
        <div class="top-icon" id="notification-icon">
          <i data-lucide="bell"></i>
          <span class="notif-badge" id="notification-count" aria-hidden="true"></span>
        </div>
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

  async loadNotifications() {
    if (!requireAuthOrRedirect()) return;
    const badge = this.querySelector("#notification-count");
    if (!badge) return;
    badge.textContent = "";
    badge.classList.add("is-hidden");

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
      const groups = allGroups.filter(isAdmin);
      const groupIds = groups.map((group) => group.id);
      if (!groupIds.length) return;

      const filter = groupIds.map((id) => `group="${id}"`).join(" || ");
      const result = await pb.collection("group_requests").getList(1, 1, {
        filter,
        $autoCancel: false
      });
      const count = result.totalItems || 0;
      if (count > 0) {
        badge.textContent = String(count);
        badge.classList.remove("is-hidden");
      }
    } catch (error) {
      console.error("Unable to load notifications", error);
    }
  }

  async subscribeNotifications() {
    if (this._notifUnsub || !requireAuthOrRedirect()) return;
    try {
      this._notifUnsub = await pb.collection("group_requests").subscribe("*", () => {
        this.loadNotifications();
      });
    } catch (error) {
      console.error("Unable to subscribe to notifications", error);
    }
  }

  async unsubscribeNotifications() {
    if (!this._notifUnsub) return;
    try {
      await pb.collection("group_requests").unsubscribe("*");
    } catch (error) {
      console.error("Unable to unsubscribe from notifications", error);
    } finally {
      this._notifUnsub = null;
    }
  }
});
