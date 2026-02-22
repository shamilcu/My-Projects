// --- Loader Logic ---
const dismissLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        document.body.classList.remove('loading');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
};

// Dismiss loader if window is already loaded
if (document.readyState === 'complete') {
    setTimeout(dismissLoader, 1000);
} else {
    window.addEventListener('load', () => setTimeout(dismissLoader, 1000));
}

// Safety fallback: dismiss loader anyway after 5 seconds
setTimeout(dismissLoader, 5000);

document.addEventListener('DOMContentLoaded', () => {

    // --- UI LOGIC Initialization ---
    initUILogic();

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js failed to load. Falling back to static mode.');
        return;
    }

    // ==========================================
    // 1. THREE.JS SCENE SETUP
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    let scene, camera, renderer;

    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);
    } catch (e) {
        console.error('WebGL Initialization failed:', e);
        canvas.style.display = 'none';
        return;
    }

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 2);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7000ff, 2);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // --- Particle Field ---
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Floating Objects ---
    const geometry1 = new THREE.IcosahedronGeometry(7, 1);
    const material1 = new THREE.MeshPhongMaterial({
        color: 0x7000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(15, 5, -10);
    scene.add(mesh1);

    const geometry2 = new THREE.TorusGeometry(10, 3, 16, 100);
    const material2 = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(-15, -10, -15);
    scene.add(mesh2);

    // --- Mouse Movement Parallax ---
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Rotate objects
        particlesMesh.rotation.y = elapsedTime * 0.05;
        mesh1.rotation.y = elapsedTime * 0.1;
        mesh1.rotation.x = elapsedTime * 0.05;
        mesh2.rotation.z = elapsedTime * 0.15;

        // Camera follow mouse
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };

    animate();

    // --- Reset on resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ==========================================
    // 2. UI LOGIC
    // ==========================================

});

/**
 * Isolated UI Logic to ensure the portfolio works even if 
 * 3D/Three.js fails to initialize.
 */
function initUILogic() {
    // --- Loader (Redundant, handled at top-level) ---

    // --- Typing Effect ---
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const roles = [
            'FLUTTER_DEVELOPER',
            'WEB_SYSTEMS_ARCHITECT',
            'CYBER_SECURITY_ANALYST',
            'FULL_STACK_ENGINEER'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 150;

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };
        type();
    }

    // --- Scroll Reveal ---
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(el => revealObserver.observe(el));
    }

    // --- Sticky Nav & Back to Top ---
    const nav = document.querySelector('nav');
    const backTop = document.getElementById('back-to-top');

    if (nav || backTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                if (nav) nav.classList.add('sticky');
                if (backTop) backTop.classList.add('active');
            } else {
                if (nav) nav.classList.remove('sticky');
                if (backTop) backTop.classList.remove('active');
            }
        });
    }

    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Card Tilt Effect ---
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // --- Contact Form UI Feedback ---
    const form = document.getElementById('futuristic-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'EXECUTING...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.textContent = 'TRANSMISSION_SUCCESSFUL';
                btn.style.background = '#00ff00';
                btn.style.boxShadow = '0 0 20px #00ff00';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                    btn.style.opacity = '1';
                    form.reset();
                }, 3000);
            }, 1500);
        });
    }
}
