import { pb, requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-chat-view", class extends HTMLElement {
  roomId = null;

  connectedCallback() {
    this.render();

    window.addEventListener("open-room", (e) => {
      this.roomId = e.detail.roomId;
      this.querySelector("#chat-header").textContent = e.detail.title || "";
      this.initChat();
      // if you're using app-shell, tell it to show chat:
      window.dispatchEvent(new CustomEvent("force-tab", { detail: { tab: "chat" } }));
    });

    this.querySelector("#back-to-rooms").addEventListener("click", () => {
      this.roomId = null;
      // let app-shell show rooms (or emit nav-change)
      window.dispatchEvent(new CustomEvent("nav-change", { detail: { index: 1 } }));
    });
  }

  render() {
    this.innerHTML = `
      <button class="back-btn" id="back-to-rooms">← Back to rooms</button>
      <div class="chat-container">
        <div id="chat-header" style="font-weight:600;margin-bottom:1rem;"></div>
        <div id="message-list" class="message-list"></div>
        <form id="message-form" class="message-form">
          <input type="text" id="msg-input" placeholder="Type a message…" />
          <label class="icon-btn file-btn" for="msg-attachments" title="Attach file">
            <i data-lucide="paperclip"></i>
          </label>
          <input type="file" id="msg-attachments" multiple />
          <button class="icon-btn send-btn" type="submit" title="Send">
            <i data-lucide="send"></i>
          </button>
        </form>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  async initChat() {
    if (!requireAuthOrRedirect()) return;
    if (!this.roomId) return;

    const list = this.querySelector("#message-list");
    list.innerHTML = "";

    pb.collection("chat_messages").subscribe("*", async (e) => {
      if (e.action !== "create") return;
      const msg = await pb.collection("chat_messages").getOne(e.record.id, { expand: "sender" });
      this.renderMessage(msg);
    }, { filter: `room='${this.roomId}'` });

    const msgs = await pb.collection("chat_messages").getFullList({
      filter: `room="${this.roomId}"`,
      sort: "-created",
      expand: "sender"
    });
    msgs.reverse().forEach(m => this.renderMessage(m));

    this.querySelector("#message-form").onsubmit = async (ev) => {
      ev.preventDefault();
      const text = this.querySelector("#msg-input").value.trim();
      const files = this.querySelector("#msg-attachments").files;
      if (!text && files.length === 0) return;

      const fd = new FormData();
      fd.append("room", this.roomId);
      fd.append("sender", pb.authStore.model.id);
      if (text) fd.append("text", text);
      for (const f of files) fd.append("attachments", f);

      await pb.collection("chat_messages").create(fd);
      ev.target.reset();
    };
  }

  renderMessage(msg) {
    const list = this.querySelector("#message-list");
    const me = pb.authStore.model.id;
    const isMe = msg.sender === me;
    const sender = msg.expand?.sender || {};

    const avatarUrl = sender.avatar ? pb.files.getURL(sender, sender.avatar) : "/assets/default-avatar.png";
    const senderName = sender.username || sender.name || msg.sender;

    const row = document.createElement("div");
    row.className = "message-item " + (isMe ? "mine" : "other");

    row.innerHTML = `
      ${isMe ? "" : `<img src="${avatarUrl}" class="avatar" alt="${senderName}" />`}
      <div class="message-bubble">
        <div class="sender">${senderName}</div>
        <div class="text">${msg.text || ""}</div>
        <div class="attachments"></div>
        <div class="time">${new Date(msg.created).toLocaleTimeString()}</div>
      </div>
      ${isMe ? `<img src="${avatarUrl}" class="avatar" alt="${senderName}" />` : ""}
    `;

    const attDiv = row.querySelector(".attachments");
    if (msg.attachments?.length) {
      msg.attachments.forEach((filename) => {
        const url = pb.files.getURL(msg, filename);
        const ext = filename.split(".").pop().toLowerCase();
        if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
          const im = document.createElement("img");
          im.src = url; im.alt = filename;
          attDiv.appendChild(im);
        } else {
          const a = document.createElement("a");
          a.href = url; a.textContent = filename; a.target = "_blank";
          attDiv.appendChild(a);
        }
      });
    }

    list.appendChild(row);
    list.scrollTop = list.scrollHeight;
  }
});
