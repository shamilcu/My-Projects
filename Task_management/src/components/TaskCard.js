import './TaskCard.css';

export function TaskCard({ id, title, type, members, comments, attachments, priority, progress, dueDate }) {
  const priorityClass = `tag-${priority}`;

  const renderMembers = () => {
    return members.map((m, i) => `
      <div class="member-avatar" style="background-color: ${m.color}; z-index: ${members.length - i}" title="${m.initials}">
        ${m.initials}
      </div>
    `).join('');
  };

  const isOverdue = new Date(dueDate) < new Date() && progress < 100;

  return `
    <div class="task-card" draggable="true" id="${id}">
      <div class="task-header">
        <span class="task-tag ${priorityClass}">${priority}</span>
        ${progress !== undefined ? `
          <div style="font-size: 0.7rem; color: #a1a1aa;">${progress}%</div>
        ` : ''}
      </div>
      
      <h3 class="task-title">${title}</h3>
      
      ${progress !== undefined ? `
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
      ` : ''}
      
      <div class="task-footer">
        <div class="task-members">
          ${renderMembers()}
        </div>
        
        <div class="task-meta">
          ${dueDate ? `
            <div class="meta-item due-date ${isOverdue ? 'overdue' : ''}">
              <i data-lucide="calendar" width="14"></i>
              <span>${new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          ` : ''}
          
          ${comments > 0 ? `
            <div class="meta-item">
              <i data-lucide="message-square" width="14"></i>
              <span>${comments}</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
