/**
 * HORIZON - Premium 3D Orchestration
 * Core Engine: Three.js
 * Animation: GSAP + ScrollTrigger
 * Smoothness: Lenis
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Post-processing addons
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

class Engine {
    constructor() {
        this.canvas = document.querySelector('#webgl-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.loader = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.loader);

        // Setup DRACO
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        this.gltfLoader.setDRACOLoader(dracoLoader);

        this.model = null;
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2(); // For lerp smoothing
        this.lerpAmount = 0.05;

        this.init();
    }

    async init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.setupEventListeners();
        this.setupLoader();

        await this.loadAssets();

        this.animate();
        this.initScrollAnimations();
        this.initLenis();
        this.initUI();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Post-processing Setup
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.0, // High threshold
            0.0, // NO BLOOM (Zero Glory)
            0.0
        );
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(new OutputPass());
    }

    setupCamera() {
        this.camera.position.set(0, 0, 8);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
    }

    setupLights() {
        // Environment light - Ultra Dim
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
        this.scene.add(ambientLight);

        // Key Light - Ultra Dim
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
        keyLight.position.set(2, 4, 3);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 10;
        this.scene.add(keyLight);

        // Rim Light - Disabled for zero glory
        const rimLight = new THREE.PointLight(0x00d2ff, 0, 10);
        rimLight.position.set(-3, 1, -2);
        this.scene.add(rimLight);

        // Contact Shadow Plane
        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.ShadowMaterial({ opacity: 0.1 })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -1.2;
        shadowPlane.receiveShadow = true;
        this.scene.add(shadowPlane);
    }

    setupLoader() {
        const progressBar = document.querySelector('.progress-bar');
        const statusText = document.querySelector('.loader-status');

        this.loader.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            progressBar.style.transform = `translateX(${progress - 100}%)`;
        };

        this.loader.onLoad = () => {
            setTimeout(() => {
                document.getElementById('loader').classList.add('fade-out');
                document.body.classList.remove('loading');
                this.startHeroAnimation();
            }, 1000);
        };

        this.loader.onError = (url) => {
            console.error('Error loading:', url);
            statusText.innerText = 'RECOVERY INITIATED...';
            // Force fade out to reveal fallback scene if needed
            setTimeout(() => {
                document.getElementById('loader').classList.add('fade-out');
                document.body.classList.remove('loading');
            }, 3000);
        };
    }

    async loadAssets() {
        // Load Environment Map
        const rgbeLoader = new RGBELoader();
        const envUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/venice_sunset_1k.hdr';

        try {
            const envMap = await rgbeLoader.loadAsync(envUrl);
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = envMap;
        } catch (e) {
            console.error('EnvMap failed, using default lighting');
        }

        // Load Watch Model - Using Khronos Official Sample for Maximum Reliability
        const watchUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb';

        try {
            const gltf = await this.gltfLoader.loadAsync(watchUrl);
            this.model = gltf.scene;

            // Adjust materials for premium look
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.envMapIntensity = 0.2; // Very low reflections
                        if (child.material.name.toLowerCase().includes('metal')) {
                            child.material.metalness = 0.8;
                            child.material.roughness = 0.5;
                        }
                    }
                }
            });

            this.model.scale.set(1.5, 1.5, 1.5); // TINY scale
            this.model.position.y = -0.5;
            this.model.rotation.y = Math.PI / 4;
            this.scene.add(this.model);
        } catch (error) {
            console.error('Model failed to load:', error);
        }
    }

    initLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        const scrollFn = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(scrollFn);
        };
        requestAnimationFrame(scrollFn);
    }

    initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        if (!this.model) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".main",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // 1. Initial Hero State (handled by startHeroAnimation)

        // 2. Part Heritage: Frontal View
        tl.to(this.model.rotation, { y: Math.PI * 2, x: 0 }, 0);
        tl.to(this.camera.position, { x: 0, z: 6, y: 0 }, 0);

        // 3. Craftsmanship: Angled Detail
        tl.to(this.model.rotation, { y: Math.PI * 2.5, z: 0.2 }, 1);
        tl.to(this.camera.position, { x: 3, z: 5, y: 0.5 }, 1);

        // 4. Movement: Back view (Full scope)
        tl.to(this.model.rotation, { y: Math.PI * 3, x: -0.2 }, 2);
        tl.to(this.camera.position, { x: 0, z: 8, y: 0 }, 2);

        // Spec Counters
        const specs = document.querySelectorAll('.spec-num');
        specs.forEach(spec => {
            const val = parseInt(spec.getAttribute('data-val'));
            ScrollTrigger.create({
                trigger: spec,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(spec, {
                        innerText: val,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: "power2.out"
                    });
                }
            });
        });

        // Reveal effect
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                onEnter: () => el.classList.add('active')
            });
        });
    }

    startHeroAnimation() {
        gsap.to(".hero-title", {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.5
        });

        if (this.model) {
            gsap.from(this.model.scale, {
                x: 0, y: 0, z: 0,
                duration: 2,
                ease: "expo.out"
            });
            gsap.from(this.model.rotation, {
                y: Math.PI,
                duration: 3,
                ease: "power2.out"
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Cursor
            gsap.to('.cursor-dot', { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to('.cursor-circle', { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out' });
        });

        // Mouse tilt effect
        document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to('.cursor-circle', { scale: 1.5, background: 'rgba(255,255,255,0.1)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to('.cursor-circle', { scale: 1, background: 'transparent', duration: 0.3 });
            });
        });
    }

    initUI() {
        // Magnetic button logic
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    animate() {
        const time = this.clock.getElapsedTime();

        // Mouse Lerping (Inertia Smoothing)
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * this.lerpAmount;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * this.lerpAmount;

        if (this.model) {
            // Idle float
            this.model.position.y = -0.5 + Math.sin(time * 0.4) * 0.05;

            // Mouse Parallax with smoothing
            this.model.rotation.y += (this.mouse.x * 0.15 - (this.model.rotation.y - Math.PI / 4)) * 0.1;
            this.model.rotation.x += (this.mouse.y * 0.1 - this.model.rotation.x) * 0.1;
        }

        this.composer.render();
        requestAnimationFrame(() => this.animate());
    }
}

// Startup
new Engine();
