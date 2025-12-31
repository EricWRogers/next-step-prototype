import { pb, requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-events-view", class extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="event-list" id="event-list"></div>
    `;
  }

  async load() {
    if (!requireAuthOrRedirect()) return;

    const list = this.querySelector("#event-list");
    if (!list) return;
    list.innerHTML = "";

    const events = await pb.collection("events")
      .getFullList({ sort: "time", expand: "group" });

    if (!events.length) {
      list.textContent = "No events yet.";
      return;
    }

    events.forEach((ev) => list.appendChild(this.renderEvent(ev)));
  }

  renderEvent(ev) {
    const item = document.createElement("div");
    item.className = "event-item";

    const group = ev.expand?.group;
    const imgRecord = ev.override_image ? ev : group;
    const imgName = ev.override_image || group?.profile;
    const thumb = imgRecord && imgName ? pb.files.getURL(imgRecord, imgName) : "/assets/logo.png";

    const ts = new Date(ev.time).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short"
    });

    item.innerHTML = `
      <div class="event-info">
        <img src="${thumb}" alt="${ev.title}" />
        <div class="event-text">
          <div class="event-header">
            <div class="event-title">${ev.title}</div>
            <div class="event-time">${ts}</div>
          </div>
          <div class="event-desc">${ev.description || ""}</div>
        </div>
      </div>
    `;

    return item;
  }
});
