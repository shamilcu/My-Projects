document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Initialization
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // 2. Three.js Nebula Particle Background
    const initThree = () => {
        const canvas = document.getElementById('three-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2.5;

        // Nebula Particles
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const colors = [new THREE.Color('#bf36ff'), new THREE.Color('#3b82f6'), new THREE.Color('#06b6d4')];

        for (let i = 0; i < particlesCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 8;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 8;

            const color = colors[Math.floor(Math.random() * colors.length)];
            colorArray[i * 3] = color.r;
            colorArray[i * 3 + 1] = color.g;
            colorArray[i * 3 + 2] = color.b;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.006,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
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

            // Slow rotation
            particlesMesh.rotation.y += 0.0008;
            particlesMesh.rotation.x += 0.0004;

            // Subtle mouse drift
            particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
            particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

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

    // 3. Custom Cursor (Elite GSAP implementation)
    const cursor = document.getElementById('custom-cursor');
    const links = document.querySelectorAll('a, button, .glass-card, .team-card');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #3b82f6',
                duration: 0.3
            });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: '#ffffff',
                border: 'none',
                duration: 0.3
            });
        });
    });

    // 4. GSAP Content Reveals
    // Hero Title
    gsap.to(".hero .reveal-up", {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.5,
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
        duration: 1.2,
        ease: "back.out(1.4)"
    });

    // Vision Statement Kerning & Scale
    gsap.from(".vision-title", {
        scrollTrigger: {
            trigger: ".vision",
            start: "top 80%",
            end: "bottom top",
            scrub: 1
        },
        scale: 0.8,
        letterSpacing: "20px",
        opacity: 0.3,
        ease: "none"
    });

    // 5. Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 6. Smooth Scroll Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                gsap.to(window, {
                    scrollTo: { y: targetElement.offsetTop - 80, autoKill: true },
                    duration: 1.8,
                    ease: "power4.inOut"
                });
            }
        });
    });
});
