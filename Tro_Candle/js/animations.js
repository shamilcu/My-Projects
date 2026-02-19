export class Animations {
    constructor(sceneInstance) {
        this.scene = sceneInstance;
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);
        this.initReveal();
        this.initScrollTimeline();
        this.initCursor();
    }

    initReveal() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('active')
            });
        });
    }

    initScrollTimeline() {
        // Wait for model to exist before initializing scroll path
        const checkModel = setInterval(() => {
            if (this.scene.model) {
                this._createScrollTimeline();
                clearInterval(checkModel);
            }
        }, 100);
    }

    _createScrollTimeline() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });

        // Hero to Notes
        tl.to(this.scene.model.rotation, { y: Math.PI * 2 }, 0);
        tl.to(this.scene.camera.position, { z: 4, y: 0.5 }, 0);

        // Notes to Specs
        tl.to(this.scene.model.position, { x: -2, y: -0.5 }, 1);
        tl.to(this.scene.model.rotation, { y: Math.PI * 3, z: 0.2 }, 1);

        // Specs Counter animation
        const specs = document.querySelectorAll('.spec-num');
        specs.forEach(spec => {
            const val = parseInt(spec.getAttribute('data-val'));
            ScrollTrigger.create({
                trigger: spec,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(spec, {
                        innerText: val,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Specs to CTA
        tl.to(this.scene.model.position, { x: 0, y: -1 }, 2);
        tl.to(this.scene.model.scale, { x: 18, y: 18, z: 18 }, 2);
    }

    initCursor() {
        const dot = document.querySelector('.cursor-dot');
        const circle = document.querySelector('.cursor-circle');

        // Only hide native cursor if JS is working
        document.body.classList.add('has-custom-cursor');

        window.addEventListener('mousemove', (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(circle, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' });
        });

        document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(circle, { scale: 1.5, borderColor: '#d4af37', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(circle, { scale: 1, borderColor: 'rgba(255,255,255,0.3)', duration: 0.3 });
            });
        });

        // Magnetic effect
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            });
        });
    }
}
