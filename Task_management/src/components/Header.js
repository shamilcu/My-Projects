import './Header.css';

export function Header() {
    return `
    <header class="header">
      <div class="header-title">
        <h1>Product Launch</h1>
        <p>Manage tasks for Q3 release</p>
      </div>
      
      <div class="header-actions">
        <button class="icon-btn" aria-label="Search">
          <i data-lucide="search" width="20"></i>
        </button>
        <button class="icon-btn" aria-label="Notifications">
          <i data-lucide="bell" width="20"></i>
        </button>
        
        <button class="btn-primary" id="add-task-btn">
          <i data-lucide="plus" width="18"></i>
          <span>New Task</span>
        </button>
      </div>
    </header>
  `;
}
