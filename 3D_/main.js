import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const config = {
    // Proven Ferrari model from Three.js examples (via CDN)
    modelUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/ferrari.glb',
    // Studio lighting HDR (via CDN)
    envMapUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/equirectangular/venice_sunset_1k.hdr',
    dracoPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
};

// State
let scene, camera, renderer, model, mixer;
let width = window.innerWidth;
let height = window.innerHeight;

// ==========================================
// 2. SMOOTH SCROLL (LENIS)
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================
// 3. THREE.JS SETUP
// ==========================================
function initScene() {
    const canvas = document.querySelector('#webgl');

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6); // Initial position

    // RENDERER
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffffff, 20);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xd4af37, 5); // Gold tint
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xffffff, 10);
    rimLight.position.set(0, 5, -10);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // GROUND PLANE (Shadow Catcher)
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.ShadowMaterial({ opacity: 0.4 })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0; // Ferrari model sits at 0
    plane.receiveShadow = true;
    scene.add(plane);

    loadAssets();
}

// ==========================================
// 4. ASSET LOADING
// ==========================================
async function loadAssets() {
    const manager = new THREE.LoadingManager();

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        const progress = (itemsLoaded / itemsTotal) * 100;
        const bar = document.querySelector('.loader-progress');
        if (bar) bar.style.width = `${progress}%`;
    };

    manager.onLoad = () => {
        // Assets Loaded
        initScrollAnimations();
        dismissLoader();
    };

    // Load Environment Map
    new RGBELoader(manager).load(config.envMapUrl, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    });

    // Load Model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(config.dracoPath);

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);

    loader.load(config.modelUrl, (gltf) => {
        model = gltf.scene;

        // Material enhancement
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.map) child.material.map.anisotropy = 16;
            }
        });

        // Initial Transform
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x += (model.position.x - center.x);
        model.position.z += (model.position.z - center.z);
        // Place on ground
        model.position.y = 0;

        // Initial Rotation for Hero
        model.rotation.y = Math.PI / 4;
        model.position.x = 1.5; // Offset right for desktop

        scene.add(model);
    }, undefined, (error) => {
        console.error('An error happened loading the model:', error);
        // Force dismiss loader on error so page isn't stuck
        dismissLoader();
    });
}

// ==========================================
// 5. ANIMATION & SCROLL LOGIC
// ==========================================
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    if (!model) return;

    // Timeline connected to scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5 // Smooth scrub
        }
    });

    // 1. Hero -> Design Section
    tl.to(model.rotation, { y: Math.PI, duration: 1 }, 0)
        .to(model.position, { x: -1.5, z: 0, duration: 1 }, 0)
        .to(camera.position, { z: 5, duration: 1 }, 0);

    // 2. Design -> Performance Section
    tl.to(model.rotation, { y: Math.PI * 1.5, duration: 1 }, 1)
        .to(model.position, { x: 1.5, z: 1, duration: 1 }, 1)
        .to(camera.position, { z: 4, duration: 1 }, 1);

    // 3. Performance -> Technology Section
    tl.to(model.rotation, { y: Math.PI * 2, duration: 1 }, 2)
        .to(model.position, { x: 0, z: -1, duration: 1 }, 2)
        .to(camera.position, { y: 2, z: 3, lookAt: 0 }, 2);

    // 4. To Order Section
    tl.to(model.position, { y: 10, duration: 1 }, 3); // Move out of view or change dramatically

    // Feature Cards Animation
    gsap.utils.toArray('.glass-card').forEach(card => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Hero Text Entry
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out"
    });
}

// ==========================================
// 6. RENDER LOOP
// ==========================================
const clock = new THREE.Clock();
let mouseX = 0, mouseY = 0;

// Mouse Parallax
document.addEventListener('mousemove', (e) => {
    // Normalized coordinates -0.5 to 0.5
    mouseX = (e.clientX / width) - 0.5;
    mouseY = (e.clientY / height) - 0.5;

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.3 });
});

function animate() {
    requestAnimationFrame(animate);

    if (!renderer) return;

    if (model) {
        // Subtle idle rotation
        // model.rotation.y += 0.001; 

        // Mouse Parallax
        // Only effect rotation slightly to not fight scroll
        const parallaxStrength = 0.1;
        model.rotation.x += (mouseY * parallaxStrength - model.rotation.x) * 0.05;
        // model.rotation.y += (mouseX * parallaxStrength) * 0.05; // Conflict with scroll
    }

    renderer.render(scene, camera);
}


// Resizing
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Responsive positioning logic could go here
    if (width < 768 && model) {
        model.position.x = 0; // Center on mobile
    }
});

// UI Logic
function dismissLoader() {
    const loader = document.querySelector('.loader');
    gsap.to(loader, {
        opacity: 0,
        delay: 0.5,
        duration: 1,
        onComplete: () => {
            loader.style.display = 'none';
            document.body.classList.remove('loading');
        }
    });
}

// Start
initScene();
animate();
