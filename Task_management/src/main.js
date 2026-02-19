import './style.css';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { initRippleEffect } from './utils/ripple';
import { KanbanBoard, setupDragAndDrop } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { TaskModal, setupModalInteractions } from './components/TaskModal';

const state = {
  currentTab: 'dashboard'
};

function render() {
  const app = document.querySelector('#app');

  const content = state.currentTab === 'kanban' ? KanbanBoard() :
    state.currentTab === 'dashboard' ? Dashboard() :
      state.currentTab === 'settings' ? Settings() :
        `<div style="padding: 2rem; color: #fff;">Coming Soon</div>`;

  app.innerHTML = `
    <div class="app-container">
    ${Sidebar(state.currentTab)}
    <main class="main-content">
      ${Header()}
      <div id="content-area">
        ${content}
      </div>
    </main>
    ${TaskModal()}
  </div>
  `;

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Post-render setup
  setupModalInteractions();
  initRippleEffect();

  // Post-render setup
  if (state.currentTab === 'kanban') {
    setupDragAndDrop();
  }

  // Attach Event Listeners
  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      if (tab && tab !== state.currentTab) {
        state.currentTab = tab;
        render();
      }
    });
  });
}

// Initial Render
render();
