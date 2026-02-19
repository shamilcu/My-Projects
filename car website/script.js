// --- Aurax Motors - Premium 3D Showroom Script (Hardened Mode) ---

// --- 0. Independent Loader & Animation Logic ---
const dismissLoader = () => {
    const loader = document.getElementById('loader');
    if (loader && loader.style.opacity !== '0') {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        document.body.classList.remove('loading');

        // Trigger hero animations if GSAP available
        if (typeof gsap !== 'undefined') {
            startHeroAnimations();
        }
    }
};

function startHeroAnimations() {
    // Split text for hero titles
    const mainTitle = document.querySelector('.main-title');
    const subTitle = document.querySelector('.sub-title');

    if (mainTitle) splitText(mainTitle);
    if (subTitle) splitText(subTitle);

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to('.sub-title .split-char', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power4.out'
    })
        .to('.main-title .split-char', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.03,
            ease: 'expo.out'
        }, "-=0.5")
        .from('.hero-tagline', { opacity: 0, y: 20, duration: 1, ease: 'power3.out' }, "-=0.8")
        .from('.hero-btns .btn', { opacity: 0, y: 20, duration: 1, stagger: 0.2, ease: 'power3.out' }, "-=0.6")
        .from('.scroll-hint', { opacity: 0, y: -20, duration: 1, ease: 'power3.out' }, "-=0.4");
}

function splitText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.classList.add('split-char');
        span.textContent = char === ' ' ? '\u00A0' : char;
        element.appendChild(span);
    });
}

// Safety Triggers for Loader
window.addEventListener('load', () => setTimeout(dismissLoader, 1500));
setTimeout(dismissLoader, 5000); // 5s absolute fallback

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GSAP INITIALIZATION
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.to('.loader-bar', {
            width: '100%',
            duration: 2,
            ease: 'power4.inOut',
            onComplete: dismissLoader
        });
    } else {
        dismissLoader(); // Fallback if no GSAP
    }

    // ==========================================
    // 2. UI LOGIC (Isolated)
    // ==========================================
    initUILogic();

    // ==========================================
    // 3. THREE.JS ENGINE
    // ==========================================
    initThreeScene();
});

function initThreeScene() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js failed to load.');
        return;
    }

    const canvas = document.getElementById('main-canvas');
    if (!canvas) return;

    let scene, camera, renderer, car;

    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));
        const spotLight = new THREE.SpotLight(0xd4af37, 10);
        spotLight.position.set(10, 20, 10);
        spotLight.castShadow = true;
        scene.add(spotLight);
        scene.add(new THREE.PointLight(0xffffff, 5).position.set(-10, 10, -10));

        // Procedural Car Model
        const carGroup = new THREE.Group();
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a, metalness: 0.9, roughness: 0.1, clearcoat: 1.0
        });

        const body = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 1.8), bodyMat);
        body.castShadow = true;
        carGroup.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.4), bodyMat);
        cabin.position.set(-0.3, 0.6, 0);
        carGroup.add(cabin);

        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        [[1.2, -0.3, 0.9], [1.2, -0.3, -0.9], [-1.2, -0.3, 0.9], [-1.2, -0.3, -0.9]].forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(...pos);
            carGroup.add(wheel);
        });

        car = carGroup;
        scene.add(car);

        // Reflective Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.2 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.7;
        floor.receiveShadow = true;
        scene.add(floor);

        // Camera positioning (Slightly to the right for layout)
        camera.position.set(2, 2, 8);
        camera.lookAt(0, 0, 0);

        // Particle System (Luxury Dust)
        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xd4af37,
            transparent: true,
            opacity: 0.5
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // Scanning Light Effect
        const scanLight = new THREE.PointLight(0xd4af37, 2, 10);
        scene.add(scanLight);

        // Animation Loop
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            if (car) {
                car.rotation.y += 0.005;
                // Move car to the right for hero layout
                car.position.x = 2;
            }

            // Animate particles
            particles.rotation.y = elapsed * 0.05;

            // Animate scanning light
            scanLight.position.set(2, 1, Math.sin(elapsed * 2) * 3);

            camera.position.y = 2 + Math.sin(elapsed) * 0.2;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } catch (e) {
        console.error('WebGL Init failed:', e);
        if (canvas) canvas.style.display = 'none';
    }
}

function initUILogic() {
    // Sticky Nav
    const nav = document.querySelector('nav');
    const backTop = document.getElementById('back-to-top');

    if (nav || backTop) {
        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 50;
            if (nav) nav.classList.toggle('scrolled', isScrolled);
            if (backTop) backTop.classList.toggle('visible', isScrolled);
        });
    }

    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll Reveals
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0 && typeof gsap !== 'undefined') {
        reveals.forEach(el => {
            if (el.classList.contains('section-title')) {
                splitText(el);
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('section-title')) {
                        gsap.to(entry.target.querySelectorAll('.split-char'), {
                            opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: 'power4.out'
                        });
                    } else {
                        gsap.to(entry.target, {
                            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out'
                        });
                    }
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));
    }

    // Form
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'TRANSMITTING...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Transmission Successful! Our VIP agents will contact you shortly.');
                btn.textContent = originalText;
                btn.disabled = false;
                form.reset();
            }, 2000);
        });
    }

    // Spec Counters Animation
    const specValues = document.querySelectorAll('.spec-value');
    if (specValues.length > 0 && typeof gsap !== 'undefined') {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const match = text.match(/([0-9.,]+)/);
                    if (match) {
                        const originalValue = parseFloat(match[1].replace(/,/g, ''));
                        const suffix = text.replace(match[1], '');
                        const obj = { val: 0 };
                        gsap.to(obj, {
                            val: originalValue,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: () => {
                                target.textContent = obj.val.toLocaleString(undefined, {
                                    minimumFractionDigits: text.includes('.') ? 1 : 0,
                                    maximumFractionDigits: text.includes('.') ? 1 : 0
                                }) + suffix;
                            }
                        });
                        counterObserver.unobserve(target);
                    }
                }
            });
        }, { threshold: 0.5 });
        specValues.forEach(el => counterObserver.observe(el));
    }

    // Audio Logic
    const initAudio = () => {
        const ambientAudio = new Audio('https://www.soundjay.com/ambient/sounds/ambient-hum-01.mp3');
        ambientAudio.loop = true;
        ambientAudio.volume = 0.2;

        const engineAudio = new Audio('https://www.soundjay.com/mechanical/car-engine-start-1.mp3');
        engineAudio.volume = 0.4;

        const startAudioOnInteraction = () => {
            if (ambientAudio.paused) {
                ambientAudio.play().catch(() => { });
            }
            document.removeEventListener('mousedown', startAudioOnInteraction);
            document.removeEventListener('keydown', startAudioOnInteraction);
        };
        document.addEventListener('mousedown', startAudioOnInteraction);
        document.addEventListener('keydown', startAudioOnInteraction);

        const premiumBtns = document.querySelectorAll('.btn-gold, .btn-card, .btn-nav');
        premiumBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                engineAudio.currentTime = 0;
                engineAudio.play().catch(() => { });
            });
        });
    };
    initAudio();

    // Parallax background for interior
    window.addEventListener('scroll', () => {
        const interior = document.querySelector('.interior-bg');
        if (interior) {
            interior.style.backgroundPositionY = (window.pageYOffset * 0.3) + 'px';
        }
    });

    // Custom Cursor & Magnetic Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    const magneticElements = document.querySelectorAll('.btn, .logo, .nav-links a, .car-card, .mobile-toggle, .model-btn');

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursor && follower) {
            gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, overwrite: true });
            gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.3, overwrite: true });
        }
    });

    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor && follower) {
                cursor.classList.add('active');
                follower.classList.add('active');
            }
        });

        el.addEventListener('mouseleave', () => {
            if (cursor && follower) {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            }
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power3.out", overwrite: true });
        });
    });

    // Showcase Model Selector Logic
    const modelBtns = document.querySelectorAll('.model-btn');
    const showcaseImg = document.querySelector('.showcase-visual img');

    const carData = {
        'PHANTOM X': {
            img: 'assets/phantom_x.jpg',
            specs: ['QUAD-MOTOR', '2,400 HP', '1.6s', '450 KM/H']
        },
        'VELOCITY GT': {
            img: 'assets/velocity_gt.jpg',
            specs: ['QUAD-MOTOR', '1,900 HP', '1.8s', '420 KM/H']
        },
        'TITAN R': {
            img: 'assets/titan_r.jpg',
            specs: ['V12 TURBO', '1,200 HP', '2.1s', '380 KM/H']
        }
    };

    if (modelBtns.length > 0 && showcaseImg) {
        modelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const model = btn.dataset.model;
                modelBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                gsap.to(showcaseImg, {
                    opacity: 0, x: -50, duration: 0.4,
                    onComplete: () => {
                        showcaseImg.src = carData[model].img;
                        gsap.to(showcaseImg, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
                    }
                });

                const specValues = document.querySelectorAll('.showcase .spec-value');
                if (specValues.length > 0) {
                    carData[model].specs.forEach((val, i) => {
                        if (specValues[i]) {
                            gsap.to(specValues[i], {
                                opacity: 0, y: 10, duration: 0.3,
                                onComplete: () => {
                                    specValues[i].textContent = val;
                                    gsap.to(specValues[i], { opacity: 1, y: 0, duration: 0.4 });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}
