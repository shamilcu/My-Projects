document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Initialization
    gsap.registerPlugin(ScrollTrigger);

    // 2. Three.js "Liquid Gold" Particles
    const initThree = () => {
        const canvas = document.getElementById('three-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;

        // Custom Gold Particles
        const particlesCount = 400; // Fewer, larger particles for luxury feel
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 5;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 5;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 5;
            scaleArray[i] = Math.random();
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

        // Use a soft blurred circle for particles
        const textureLoader = new THREE.TextureLoader();
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: '#c5a059',
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Movement
        const animate = () => {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.0005;
            particlesMesh.rotation.x += 0.0003;

            // Subtle floating motion
            const time = Date.now() * 0.001;
            particlesMesh.position.y = Math.sin(time * 0.5) * 0.1;

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

    // 3. Loader Logic
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(loader, {
                yPercent: -100,
                duration: 1.5,
                ease: "power4.inOut",
                onComplete: () => {
                    // Start Hero Animations
                    gsap.to(".hero .reveal-up", {
                        y: 0,
                        opacity: 1,
                        stagger: 0.2,
                        duration: 1.5,
                        ease: "power4.out"
                    });
                }
            });
        }, 1500);
    });

    // 4. Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    const links = document.querySelectorAll('a, button, .collection-item');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 6, mixBlendMode: 'difference', backgroundColor: '#fff', duration: 0.3 });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, mixBlendMode: 'normal', backgroundColor: 'var(--gold)', duration: 0.3 });
        });
    });

    // 5. GSAP Scroll Reveals
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out"
        });
    });

    // Collection Items Parallax + Reveal
    document.querySelectorAll('.collection-item').forEach(item => {
        const bg = item.querySelector('.collection-img-bg');
        const content = item.querySelector('.collection-content');

        gsap.to(bg, {
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            yPercent: 15,
            ease: "none"
        });

        gsap.from(content, {
            scrollTrigger: {
                trigger: content,
                start: "top 80%"
            },
            x: -100,
            opacity: 0,
            duration: 2,
            ease: "power4.out"
        });
    });

    // Header reveal kerning
    gsap.from(".heritage .section-title", {
        scrollTrigger: {
            trigger: ".heritage",
            start: "top 80%"
        },
        letterSpacing: "20px",
        opacity: 0,
        duration: 2,
        ease: "power4.out"
    });

    // 6. Smooth Scroll for Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target.offsetTop, autoKill: true },
                    duration: 2,
                    ease: "power4.inOut"
                });
            }
        });
    });
});
