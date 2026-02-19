export function initRippleEffect() {
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.btn, .fab-add-task, .nav-item, .task-card, .btn-save, .modal-close');

        if (!target) return;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        // Make sure target is relative and hidden overflow
        const computedStyle = window.getComputedStyle(target);
        if (computedStyle.position === 'static') {
            target.style.position = 'relative';
        }
        if (computedStyle.overflow !== 'hidden') {
            target.style.overflow = 'hidden';
        }

        // Calculate size and position
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Add and remove
        target.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
}
