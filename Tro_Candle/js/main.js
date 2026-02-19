import { ThreeScene } from './three-scene.js';
import { Animations } from './animations.js';

class App {
    constructor() {
        this.initLenis();
        this.scene = new ThreeScene();

        // Initialize animations and cursor immediately so they work during loading
        this.animations = new Animations(this.scene);

        window.addEventListener('assetsLoaded', () => {
            // Re-sync scroll triggers if needed after assets load
            ScrollTrigger.refresh();
        });
    }

    initLenis() {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
