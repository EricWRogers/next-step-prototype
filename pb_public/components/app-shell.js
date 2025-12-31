customElements.define("ns-app-shell", class extends HTMLElement {
  connectedCallback() {
    this.render();

    const dashboard = this.querySelector("#dashboard");
    const rooms = this.querySelector("#rooms");
    const chat = this.querySelector("#chat");
    const events = this.querySelector("#events");
    const todo = this.querySelector("#todo");

    const show = (el) => el.style.display = "block";
    const hide = (el) => el.style.display = "none";

    window.addEventListener("nav-change", (e) => {
      const index = e.detail.index;

      hide(dashboard); hide(rooms); hide(chat); hide(events); hide(todo);

      if (index === 0) show(dashboard);
      if (index === 1) show(rooms);         // rooms-view can decide when to open chat
      if (index === 2) { show(events); events.load?.(); }
      if (index === 4) show(todo);
    });

    // initial
    show(dashboard);
  }

  render() {
    this.innerHTML = `
      <div id="dashboard"><ns-dashboard-view></ns-dashboard-view></div>
      <div id="rooms" style="display:none;"><ns-rooms-view></ns-rooms-view></div>
      <div id="chat" style="display:none;"><ns-chat-view></ns-chat-view></div>
      <div id="events" style="display:none;"><ns-events-view></ns-events-view></div>
      <div id="todo" style="display:none;"><ns-todo-view></ns-todo-view></div>
    `;
  }
});
