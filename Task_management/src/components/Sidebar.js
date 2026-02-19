import './Sidebar.css';

export function Sidebar(activeTab = 'dashboard') {
  return `
    <aside class="sidebar">
      <div class="logo-container">
        <div class="logo-icon">T</div>
        <span class="logo-text">TaskFlow</span>
      </div>
      
      <nav class="nav-links">
        <a href="#" class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
          <i data-lucide="layout-dashboard" width="20"></i>
          <span>Dashboard</span>
        </a>
        <a href="#" class="nav-item ${activeTab === 'kanban' ? 'active' : ''}" data-tab="kanban">
          <i data-lucide="kanban-square" width="20"></i>
          <span>My Tasks</span>
        </a>
        <a href="#" class="nav-item ${activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
          <i data-lucide="calendar" width="20"></i>
          <span>Calendar</span>
        </a>
        <a href="#" class="nav-item ${activeTab === 'team' ? 'active' : ''}" data-tab="team">
          <i data-lucide="users" width="20"></i>
          <span>Team</span>
        </a>
         <a href="#" class="nav-item ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
          <i data-lucide="settings" width="20"></i>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="avatar"></div>
        <div class="user-info">
          <span class="user-name">Alex Morgan</span>
          <span class="user-role">Product Designer</span>
        </div>
      </div>
    </aside>
  `;
}
