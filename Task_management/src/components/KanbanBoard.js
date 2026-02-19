import './KanbanBoard.css';
import { TaskCard } from './TaskCard';

export function KanbanBoard() {
  const columns = [
    { id: 'todo', title: 'To Do', colorClass: 'status-todo' },
    { id: 'in-progress', title: 'In Progress', colorClass: 'status-progress' },
    { id: 'review', title: 'Review', colorClass: 'status-review' },
    { id: 'completed', title: 'Completed', colorClass: 'status-done' }
  ];

  const tasks = [
    { id: 't1', columnId: 'todo', title: 'Design System Audit', type: 'Design', priority: 'high', members: [{ initials: 'JD', color: '#ff6b6b' }, { initials: 'AM', color: '#4ecdc4' }], comments: 3, attachments: 1, progress: 0, dueDate: '2026-02-20' },
    { id: 't2', columnId: 'todo', title: 'User Research Interviews', type: 'Research', priority: 'medium', members: [{ initials: 'KD', color: '#ffe66d' }], comments: 0, attachments: 2, progress: 0, dueDate: '2026-02-22' },
    { id: 't3', columnId: 'in-progress', title: 'Homepage Hero Animation', type: 'Dev', priority: 'high', members: [{ initials: 'AM', color: '#4ecdc4' }], comments: 5, attachments: 0, progress: 65, dueDate: '2026-02-18' },
    { id: 't4', columnId: 'review', title: 'Fix Navigation Bug on Mobile', type: 'Bug', priority: 'low', members: [{ initials: 'JD', color: '#ff6b6b' }], comments: 1, attachments: 0, progress: 90, dueDate: '2026-02-19' },
    { id: 't5', columnId: 'completed', title: 'Setup Project Repo', type: 'Dev', priority: 'medium', members: [{ initials: 'KD', color: '#ffe66d' }], comments: 0, attachments: 0, progress: 100, dueDate: '2026-02-15' },
    { id: 't6', columnId: 'in-progress', title: 'Implement Auth Flow', type: 'Dev', priority: 'high', members: [{ initials: 'JD', color: '#ff6b6b' }], comments: 2, attachments: 1, progress: 40, dueDate: '2026-02-25' }
  ];

  const renderTasksForColumn = (columnId) => {
    return tasks
      .filter(task => task.columnId === columnId)
      .map(task => TaskCard(task))
      .join('');
  };

  const renderColumn = (column) => {
    const columnTasks = tasks.filter(t => t.columnId === column.id);
    return `
    <div class="kanban-column" id="col-${column.id}">
      <div class="column-header">
        <div class="column-title">
          <div class="status-dot ${column.colorClass}"></div>
          <span>${column.title}</span>
          <span class="task-count">${columnTasks.length}</span>
        </div>
        <button class="column-options">
          <i data-lucide="more-horizontal" width="16"></i>
        </button>
      </div>
      
      <div class="task-list" id="list-${column.id}">
        ${renderTasksForColumn(column.id)}
      </div>
      
      <button class="add-task-ghost">
        <i data-lucide="plus" width="14"></i>
        <span>Add Task</span>
      </button>
    </div>
  `;
  };

  return `
    <div class="kanban-board">
      ${columns.map(renderColumn).join('')}
    </div>
    
    <button class="fab-add-task" aria-label="Add New Task">
      <i data-lucide="plus" width="24" height="24"></i>
    </button>
  `;
}

export function setupDragAndDrop() {
  const draggables = document.querySelectorAll('.task-card');
  const droppables = document.querySelectorAll('.kanban-column');

  // Task Data Lookup (Simple version, ideally passed or stored in store)
  const getTaskData = (id) => {
    const allTasks = [
      { id: 't1', columnId: 'todo', title: 'Design System Audit', type: 'Design', priority: 'high', members: [{ initials: 'JD', color: '#ff6b6b' }, { initials: 'AM', color: '#4ecdc4' }], comments: 3, attachments: 1, progress: 0, dueDate: '2026-02-20' },
      { id: 't2', columnId: 'todo', title: 'User Research Interviews', type: 'Research', priority: 'medium', members: [{ initials: 'KD', color: '#ffe66d' }], comments: 0, attachments: 2, progress: 0, dueDate: '2026-02-22' },
      { id: 't3', columnId: 'in-progress', title: 'Homepage Hero Animation', type: 'Dev', priority: 'high', members: [{ initials: 'AM', color: '#4ecdc4' }], comments: 5, attachments: 0, progress: 65, dueDate: '2026-02-18' },
      { id: 't4', columnId: 'review', title: 'Fix Navigation Bug on Mobile', type: 'Bug', priority: 'low', members: [{ initials: 'JD', color: '#ff6b6b' }], comments: 1, attachments: 0, progress: 90, dueDate: '2026-02-19' },
      { id: 't5', columnId: 'completed', title: 'Setup Project Repo', type: 'Dev', priority: 'medium', members: [{ initials: 'KD', color: '#ffe66d' }], comments: 0, attachments: 0, progress: 100, dueDate: '2026-02-15' },
      { id: 't6', columnId: 'in-progress', title: 'Implement Auth Flow', type: 'Dev', priority: 'high', members: [{ initials: 'JD', color: '#ff6b6b' }], comments: 2, attachments: 1, progress: 40, dueDate: '2026-02-25' }
    ];
    return allTasks.find(t => t.id === id);
  };

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });

    // Click to Open Modal
    draggable.addEventListener('click', (e) => {
      const taskData = getTaskData(draggable.id);
      if (taskData && window.openTaskModal) {
        window.openTaskModal(taskData);
      }
    });
  });

  droppables.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(zone, e.clientY);
      const draggable = document.querySelector('.dragging');
      const taskList = zone.querySelector('.task-list');

      if (afterElement == null) {
        taskList.appendChild(draggable);
      } else {
        taskList.insertBefore(draggable, afterElement);
      }

      // Update task count visual
      updateTaskCounts();
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateTaskCounts() {
  document.querySelectorAll('.kanban-column').forEach(column => {
    const count = column.querySelectorAll('.task-card').length;
    column.querySelector('.task-count').innerText = count;
  });
}
