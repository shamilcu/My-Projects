document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Initialization
    gsap.registerPlugin(ScrollTrigger);

    // 2. Three.js Background Particles
    const initThree = () => {
        const canvas = document.getElementById('three-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 3;

        // Particles
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: '#7000ff',
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Mouse Interaction for Particles
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.0005;

            // Follow mouse subtly
            particlesMesh.position.x += (mouseX - particlesMesh.position.x) * 0.05;
            particlesMesh.position.y += (-mouseY - particlesMesh.position.y) * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };
    initThree();

    // 3. Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    const interactables = document.querySelectorAll('a, button, .project-card, .nav-link');
    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #7000ff', duration: 0.3 });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#ffffff', border: 'none', duration: 0.3 });
        });
    });

    // 4. GSAP Scroll Animations
    // Hero Title Reveal
    gsap.to(".reveal-text", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.to(".hero-content .fade-up", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        delay: 1
    });

    // Section Scroll Reveals
    document.querySelectorAll('.scroll-reveal').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Project Cards Stagger
    gsap.to(".project-card", {
        scrollTrigger: {
            trigger: ".project-grid",
            start: "top 80%"
        },
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    });

    // Parallax Vision Text
    gsap.to(".vision-section .section-title", {
        scrollTrigger: {
            trigger: ".vision-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: -100,
        ease: "none"
    });

    // 5. Navbar Scroll Logic
    const navbar = document.querySelector('.navbar');
    ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
            if (self.direction === 1) {
                navbar.classList.add('scrolled');
            } else if (self.scroll() <= 50) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 6. Smooth Scroll Implementation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target.offsetTop - 80, autoKill: true },
                    duration: 1.5,
                    ease: "power4.inOut"
                });
            }
        });
    });
});
