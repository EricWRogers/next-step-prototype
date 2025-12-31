import { requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-todo-view", class extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="todo-screen">
        <div class="section-header">
          <strong>Challenges</strong>
          <i data-lucide="chevron-down" class="dropdown-icon"></i>
        </div>

        <div class="challenge-row">
          <div class="challenge-box"><i data-lucide="plus"></i></div>
          <div class="challenge-box selected"></div>
          <div class="challenge-box selected"></div>
          <div class="challenge-box"></div>
          <div class="challenge-box"></div>
        </div>

        <div class="todo-section">
          <div class="todo-group">
            <strong>Daily</strong>
            <div class="todo-item">
              <span>Pray for my wife</span><input type="checkbox" />
            </div>
            <div class="todo-item">
              <span>Scripture Memory</span><input type="checkbox" />
            </div>
          </div>

          <div class="todo-group">
            <strong>Weekly</strong>
            <div class="todo-item">
              <span>Serve my Church</span><input type="checkbox" />
            </div>
          </div>

          <div class="todo-group">
            <strong>Bucket-List</strong>
            <div class="todo-item">
              <span>Get a Tattoo</span><input type="checkbox" />
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  load() {
    if (!requireAuthOrRedirect()) return;
  }
});
