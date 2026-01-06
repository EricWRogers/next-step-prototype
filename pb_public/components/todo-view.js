import { pb, requireAuthOrRedirect } from "./pb-client.js";

customElements.define("ns-todo-view", class extends HTMLElement {
  connectedCallback() {
    this.render();
    this.load();
  }

  render() {
    this.innerHTML = `
      <div class="todo-screen dashboard">
        <header class="dashboard-header">
          <div class="date-row">
            <button class="icon-btn" type="button" aria-label="Previous day">
              <i data-lucide="chevron-left"></i>
            </button>
            <span class="date-pill" id="dashboard-date"></span>
            <button class="icon-btn" type="button" aria-label="Next day">
              <i data-lucide="chevron-right"></i>
            </button>
          </div>
        </header>

        <section class="dashboard-card">
          <div class="dashboard-section-header">
            <span class="section-label">Active Challenges</span>
            <button class="pill-btn" type="button">Complete Chall</button>
          </div>
          <div class="pill-row" id="active-challenges"></div>
        </section>

        <section class="dashboard-card">
          <div class="dashboard-section-header">
            <span class="section-label">Messages</span>
          </div>
          <div class="message-card" id="message-card">
            <div class="message-avatar">NS</div>
            <div class="message-body">
              <div class="message-title">Group - User Who Messaged Last</div>
              <div class="message-text">Design a weekly calendar where every block of time reflects biblical...</div>
            </div>
          </div>
        </section>

        <section class="dashboard-card">
          <div class="dashboard-section-header">
            <span class="section-label">Tasks</span>
          </div>
          <div class="task-list" id="task-list"></div>
        </section>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  async load() {
    if (!requireAuthOrRedirect()) return;

    const dateEl = this.querySelector("#dashboard-date");
    if (dateEl) {
      const now = new Date();
      const formatted = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      dateEl.textContent = formatted;
    }

    const taskList = this.querySelector("#task-list");
    const challengeRow = this.querySelector("#active-challenges");
    if (!taskList || !challengeRow) return;

    try {
      const userId = pb.authStore.model?.id;
      const instances = await pb.collection("challenge_quest_instances").getFullList({
        filter: `user="${userId}"`,
        expand: "challenge_quest"
      });
      console.log("challenge_quest_instances for user", userId, instances);

      const tasks = [];
      const challengePills = [];

      const normalizeId = (value) => {
        if (!value) return null;
        if (typeof value === "string") return value;
        if (Array.isArray(value)) {
          const first = value[0];
          if (!first) return null;
          return typeof first === "string" ? first : first.id;
        }
        return value.id || null;
      };

      const instanceByQuestId = new Map();
      instances.forEach((instance) => {
        const questId = normalizeId(instance.challenge_quest);
        if (questId) {
          instanceByQuestId.set(questId, instance);
        }
      });

      const getInitials = (text) => {
        if (!text) return "NS";
        return text
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 4)
          .map((word) => word[0].toUpperCase())
          .join("");
      };

      instances.forEach((instance) => {
        const quest = instance.expand?.challenge_quest;
        if (!quest) return;
        const isComplete = Boolean(instance.completed_time);

        const blockerId = normalizeId(quest.blocker);
        const blockerInstance = blockerId ? instanceByQuestId.get(blockerId) : null;
        const isBlocked = Boolean(blockerId && !blockerInstance?.completed_time);

        if (quest.main_quest || quest.title) {
          tasks.push({
            type: quest.type || "",
            title: quest.main_quest || quest.title,
            description: quest.description || "",
            instanceId: instance.id,
            completed: isComplete,
            blocked: isBlocked
          });
          if (challengePills.length < 4) {
            challengePills.push(getInitials(quest.main_quest || quest.title));
          }
        }

        const sideQuests = Array.isArray(quest.side_quests) ? quest.side_quests : [];
        sideQuests.forEach((sideQuest) => {
          if (typeof sideQuest === "string") {
            tasks.push({
              type: "Side Quest",
              title: sideQuest,
              description: "",
              instanceId: instance.id,
              completed: isComplete,
              blocked: isBlocked
            });
          } else if (sideQuest && typeof sideQuest === "object") {
            tasks.push({
              type: sideQuest.title || "Side Quest",
              title: sideQuest.title || "Side Quest",
              description: sideQuest.description || "",
              instanceId: instance.id,
              completed: isComplete,
              blocked: isBlocked
            });
          }
        });
      });

      if (challengePills.length === 0) {
        challengeRow.innerHTML = `<div class="empty-state">No active challenges yet.</div>`;
      } else {
        challengeRow.innerHTML = challengePills
          .map((pill) => `<div class="pill">${pill}</div>`)
          .join("");
      }

      if (tasks.length === 0) {
        taskList.innerHTML = `<div class="empty-state">No tasks yet.</div>`;
        return;
      }

      taskList.innerHTML = tasks
        .map((task) => `
          <div class="task-card ${task.blocked ? "is-blocked" : ""}">
            <div class="task-avatar">${getInitials(task.title)}</div>
            <div class="task-body">
              ${task.type ? `<div class="task-kind">${task.type}</div>` : ""}
              <div class="task-title">${task.title}</div>
              ${task.description ? `<div class="task-desc">${task.description}</div>` : ""}
            </div>
            <label class="task-check">
              <input type="checkbox" data-instance-id="${task.instanceId}" ${task.completed ? "checked" : ""} ${task.blocked ? "disabled" : ""} />
              <span></span>
            </label>
          </div>
        `)
        .join("");

      taskList.querySelectorAll('input[data-instance-id]').forEach((checkbox) => {
        checkbox.addEventListener("change", async (event) => {
          const input = event.currentTarget;
          const instanceId = input.dataset.instanceId;
          if (!instanceId) return;
          input.disabled = true;
          try {
            await pb.collection("challenge_quest_instances").update(instanceId, {
              completed_time: input.checked ? new Date().toISOString() : null
            });
            await this.load();
          } catch (error) {
            input.checked = !input.checked;
            alert("Unable to update task: " + error.message);
          } finally {
            input.disabled = false;
          }
        });
      });
    } catch (error) {
      taskList.innerHTML = `<div class="empty-state">Unable to load tasks.</div>`;
      console.error(error);
    }
  }
});
