document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Initialization
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // 2. Three.js "Quantum" Particle Background
    const initThree = () => {
        const canvas = document.getElementById('three-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 3;

        // Custom Geometric Particles
        const particlesCount = 1200;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const purple = new THREE.Color('#8b5cf6');
        const blue = new THREE.Color('#3b82f6');

        for (let i = 0; i < particlesCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 10;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;

            const mixedColor = purple.clone().lerp(blue, Math.random());
            colorArray[i * 3] = mixedColor.r;
            colorArray[i * 3 + 1] = mixedColor.g;
            colorArray[i * 3 + 2] = mixedColor.b;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.008,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Interaction
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

    // 3. Custom Cursor (Elite Interaction)
    const cursor = document.getElementById('custom-cursor');
    const interactables = document.querySelectorAll('a, button, .glass-card, .team-card');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #8b5cf6',
                duration: 0.3
            });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: '#ffffff',
                border: 'none',
                duration: 0.3
            });
        });
    });

    // 4. GSAP Content Sequences
    // Hero Title Reveal
    gsap.to(".hero .reveal-up", {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 2,
        ease: "power4.out",
        delay: 0.5
    });

    // Navbar Entry
    gsap.to(".navbar", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out"
    });

    // Scroll Triggered Reveals
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Card Stagger
    gsap.to(".glass-card", {
        scrollTrigger: {
            trigger: ".card-grid",
            start: "top 80%"
        },
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.5,
        ease: "power4.out"
    });

    // Vision Statement Scrub
    const visionLines = document.querySelectorAll('.vision-line');
    visionLines.forEach((line, i) => {
        gsap.from(line, {
            scrollTrigger: {
                trigger: line,
                start: "top bottom",
                end: "top 50%",
                scrub: 1
            },
            x: i % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1
        });
    });

    gsap.from(".vision-statement", {
        scrollTrigger: {
            trigger: ".vision-statement",
            start: "top bottom",
            end: "top 60%",
            scrub: 1
        },
        scale: 0.8,
        opacity: 0,
        duration: 1
    });

    // 5. Navbar Sticky Logic
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 6. Smooth Scroll Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                gsap.to(window, {
                    scrollTo: { y: targetEl.offsetTop - 80, autoKill: true },
                    duration: 2,
                    ease: "power4.inOut"
                });
            }
        });
    });
});
