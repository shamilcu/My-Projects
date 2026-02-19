import './TaskModal.css';

export function TaskModal() {
    return `
    <div class="modal-overlay" id="task-modal-overlay">
      <div class="task-modal" id="task-modal-content">
        <div class="modal-header">
          <div class="modal-breadcrumbs">
            <i data-lucide="kanban-square" width="14"></i>
            <span>Kanban Board</span>
            <span style="opacity: 0.5;">/</span>
            <span id="modal-task-id-display">TASK-123</span>
          </div>
          <button class="modal-close" id="modal-close-btn">
            <i data-lucide="x" width="20"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-main">
            <input type="text" class="task-title-input" id="modal-title-input" value="Design Verification">
            
            <div class="section-label">
              <i data-lucide="align-left" width="14"></i> Description
            </div>
            <textarea class="task-description" placeholder="Add a more detailed description...">Implement the final design verification steps including checking contrast ratios, responsive layouts, and interaction states.</textarea>

            <div class="comments-section">
              <div class="section-label">
                <i data-lucide="message-square" width="14"></i> Comments
              </div>
              <div class="comment-input-area">
                <div class="comment-avatar"></div>
                <textarea class="comment-box" rows="2" placeholder="Write a comment..."></textarea>
              </div>
            </div>
          </div>

          <aside class="modal-sidebar">
            <div class="property-group">
              <div class="section-label">Status</div>
              <select class="property-input property-select" id="modal-status-select">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div class="property-group">
              <div class="section-label">Priority</div>
              <select class="property-input property-select" id="modal-priority-select">
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div class="property-group">
              <div class="section-label">Due Date</div>
              <input type="date" class="property-input" id="modal-due-date">
            </div>

            <div class="property-group">
              <div class="section-label">Progress</div>
              <div class="range-container">
                <input type="range" min="0" max="100" value="0" id="modal-progress-slider">
                <span class="progress-value" id="modal-progress-value">0%</span>
              </div>
            </div>

             <div class="property-group">
              <div class="section-label">Assignees</div>
              <div style="display: flex; gap: 8px;">
                 <div class="member-avatar" style="background-color: #ff6b6b; width: 32px; height: 32px;">JD</div>
                 <button style="width: 32px; height: 32px; border-radius: 50%; border: 1px dashed rgba(255,255,255,0.3); background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                   <i data-lucide="plus" width="14"></i>
                 </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
}

export function setupModalInteractions() {
    const overlay = document.getElementById('task-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    const slider = document.getElementById('modal-progress-slider');
    const progressVal = document.getElementById('modal-progress-value');

    // Close Logic
    const closeModal = () => {
        overlay.classList.remove('open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // Slider Logic
    if (slider && progressVal) {
        slider.addEventListener('input', (e) => {
            progressVal.textContent = `${e.target.value}%`;
        });
    }

    // Bind to global scope for external text
    window.openTaskModal = (taskData) => {
        if (!overlay) return;

        // Populate Data
        document.getElementById('modal-task-id-display').textContent = `TASK-${taskData.id.toUpperCase()}`;
        document.getElementById('modal-title-input').value = taskData.title;
        document.getElementById('modal-status-select').value = taskData.columnId;
        document.getElementById('modal-priority-select').value = taskData.priority;
        document.getElementById('modal-due-date').value = taskData.dueDate || '';

        const progress = taskData.progress || 0;
        document.getElementById('modal-progress-slider').value = progress;
        document.getElementById('modal-progress-value').textContent = `${progress}%`;

        // Open
        overlay.classList.add('open');
    };
}
