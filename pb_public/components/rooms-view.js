import { pb, requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-rooms-view", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="room-list" id="room-list"></div>`;
    this.load();
  }

  async load() {
    if (!requireAuthOrRedirect()) return;

    const list = this.querySelector("#room-list");
    list.innerHTML = "";

    const userId = pb.authStore.model.id;

    const groups = await pb.collection("groups")
      .getFullList({
        filter: `members ~ "${userId}" || admin ~ "${userId}"`,
        $autoCancel: false
      });

    const groupIds = groups.map(g => g.id);
    if (!groupIds.length) {
      list.textContent = "No rooms yet.";
      return;
    }

    const filter = groupIds.map(g => `group="${g}"`).join("||");
    const rooms = await pb.collection("chat_rooms").getFullList({
      filter,
      $autoCancel: false
    });

    for (const r of rooms) {
      list.appendChild(await this.renderRoomCard(r));
    }
  }

  async renderRoomCard(room) {
    const item = document.createElement("div");
    item.className = "room-item";

    const thumbUrl = room.picture ? pb.files.getURL(room, room.picture) : "/assets/default-room.png";

    let previewText = "";
    let previewTime = "";
    try {
      const res = await pb.collection("chat_messages").getList(1, 1, {
        filter: `room="${room.id}"`,
        sort: "-created",
        expand: "sender",
        "$autoCancel": false
      });

      if (res.items.length) {
        const msg = res.items[0];
        previewText = msg.text
          ? (msg.text.length > 50 ? msg.text.slice(0, 47) + "…" : msg.text)
          : "[📎 attachment]";

        const d = new Date(msg.created);
        previewTime = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      }
    } catch {}

    item.innerHTML = `
      <div class="room-info">
        <img src="${thumbUrl}" alt="${room.name}" />
        <div class="title">${room.name}</div>
      </div>
      <div class="room-meta">
        <div class="preview">${previewText}</div>
        <div class="time">${previewTime}</div>
      </div>
    `;

    item.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-room", { detail: { roomId: room.id, title: room.title || room.name } }));
    });

    return item;
  }
});
