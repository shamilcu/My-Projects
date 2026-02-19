import './Settings.css';

export function Settings() {
    setTimeout(setupSettings, 100);

    return `
    <div class="settings-container">
      <div class="settings-sidebar">
        <div class="settings-nav-item active" data-tab="profile">
          <i data-lucide="user" width="18"></i> Profile
        </div>
        <div class="settings-nav-item" data-tab="account">
          <i data-lucide="shield" width="18"></i> Account
        </div>
        <div class="settings-nav-item" data-tab="theme">
          <i data-lucide="palette" width="18"></i> Appearance
        </div>
        <div class="settings-nav-item" data-tab="notifications">
          <i data-lucide="bell" width="18"></i> Notifications
        </div>
        <div class="settings-nav-item" data-tab="integrations">
          <i data-lucide="grid" width="18"></i> Integrations
        </div>
      </div>

      <div class="settings-content" id="settings-content-area">
        <!-- Default: Profile View -->
        ${renderProfileView()}
      </div>
    </div>
  `;
}

function renderProfileView() {
    return `
    <div>
      <h2 class="section-title">Profile Settings</h2>
      <p class="section-desc">Manage your personal information and workspace preferences.</p>

      <div class="settings-card">
        <h3 class="card-header">Personal Information</h3>
        
        <div class="form-row">
          <div class="form-group">
            <input type="text" id="firstName" class="form-input" placeholder=" " value="Shamil">
            <label for="firstName" class="form-label">First Name</label>
          </div>
          <div class="form-group">
            <input type="text" id="lastName" class="form-input" placeholder=" " value="User">
            <label for="lastName" class="form-label">Last Name</label>
          </div>
        </div>

        <div class="form-group">
          <input type="email" id="email" class="form-input" placeholder=" " value="shamil@example.com">
          <label for="email" class="form-label">Email Address</label>
        </div>

        <div class="form-group">
          <input type="text" id="role" class="form-input" placeholder=" " value="Product Designer">
          <label for="role" class="form-label">Job Title</label>
        </div>

        <button class="btn-save">Save Changes</button>
      </div>

      <div class="settings-card">
        <h3 class="card-header">Preferences</h3>
         <div class="toggle-row">
          <div class="toggle-label">
            <h4>Public Profile</h4>
            <p>Make your profile visible to team members</p>
          </div>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function renderAppearanceView() {
    return `
    <div>
      <h2 class="section-title">Appearance</h2>
      <p class="section-desc">Customize the look and feel of your workspace.</p>

      <div class="settings-card">
        <h3 class="card-header">Theme Preferences</h3>
        
        <div class="toggle-row">
          <div class="toggle-label">
            <h4>Dark Mode</h4>
            <p>Switch between dark and light themes</p>
          </div>
          <label class="switch">
            <input type="checkbox" checked id="theme-toggle">
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">
            <h4>Reduced Motion</h4>
            <p>Minimize animations for better accessibility</p>
          </div>
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function renderNotificationsView() {
    return `
    <div>
      <h2 class="section-title">Notifications</h2>
      <p class="section-desc">Control what alerts you receive.</p>

      <div class="settings-card">
        <h3 class="card-header">Email Notifications</h3>
        
        <div class="toggle-row">
          <div class="toggle-label">
            <h4>Task Assignments</h4>
            <p>Receive emails when you are assigned a task</p>
          </div>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">
            <h4>Project Updates</h4>
            <p>Weekly summaries of project progress</p>
          </div>
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function setupSettings() {
    const sidebarItems = document.querySelectorAll('.settings-nav-item');
    const contentArea = document.getElementById('settings-content-area');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked
            item.classList.add('active');

            // Update content based on tab
            const tab = item.getAttribute('data-tab');
            if (tab === 'profile') contentArea.innerHTML = renderProfileView();
            if (tab === 'theme') {
                contentArea.innerHTML = renderAppearanceView();
                // Re-attach theme toggle listener after rendering
                setTimeout(setupThemeToggle, 50);
            }
            if (tab === 'notifications') contentArea.innerHTML = renderNotificationsView();
            if (tab === 'account' || tab === 'integrations') {
                contentArea.innerHTML = `
          <div>
            <h2 class="section-title">${tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
            <p class="section-desc">This section is coming soon.</p>
            <div class="settings-card" style="text-align: center; padding: 60px;">
              <i data-lucide="construction" width="48" style="color: var(--text-secondary); margin-bottom: 16px;"></i>
              <p>Under Construction</p>
            </div>
          </div>
        `;
            }

            // Re-initialize icons for new content
            if (window.lucide) window.lucide.createIcons();
        });
    });

    setupThemeToggle();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            if (!e.target.checked) {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
        });
    }
}
