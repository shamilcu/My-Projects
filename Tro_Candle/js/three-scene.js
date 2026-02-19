import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class ThreeScene {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.loader = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.loader);

        this.model = null;
        this.composer = null;
        this.clock = new THREE.Clock();

        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.lerpAmount = 0.05;

        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.setupPostProcessing();
        this.loadAssets();
        this.setupEventListeners();
        this.animate();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
    }

    setupCamera() {
        this.camera.position.set(0, 0, 5);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Warm Gold "Flame" light - Pulse effect
        this.flameLight = new THREE.PointLight(0xd4af37, 25, 12);
        this.flameLight.position.set(0, 0.8, 0);
        this.flameLight.castShadow = true;
        this.scene.add(this.flameLight);

        // Golden Rim Light for silhouette definition
        const rimLight = new THREE.SpotLight(0xd4af37, 40);
        rimLight.position.set(-4, 4, -4);
        rimLight.angle = Math.PI / 4;
        rimLight.penumbra = 0.3;
        this.scene.add(rimLight);

        // Studio key light - Softened
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
        keyLight.position.set(5, 5, 5);
        this.scene.add(keyLight);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5, // Threshold
            0.8, // Strength
            0.2  // Radius
        );
        this.composer.addPass(bloomPass);
        this.composer.addPass(new OutputPass());
    }

    async loadAssets() {
        const progressBar = document.querySelector('.progress-bar');

        // Ensure finishLoading is bound correctly
        const finish = this.finishLoading.bind(this);

        this.loader.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            if (progressBar) progressBar.style.transform = `translateX(${progress - 100}%)`;
        };

        this.loader.onLoad = () => {
            finish();
        };

        this.loader.onError = (url) => {
            console.error('Error loading:', url);
            finish();
        };

        // Safety timeout
        setTimeout(finish, 10000);

        // Environment Map
        const rgbeLoader = new RGBELoader();
        try {
            const envMap = await rgbeLoader.loadAsync('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/venice_sunset_1k.hdr');
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = envMap;
        } catch (e) { console.warn('Env map failed'); }

        // Model - Using a reliable sample model (Damaged Helmet or similar if others fail)
        // Let's try the Chronograph Watch again or a simpler one
        // Model - Using DamagedHelmet as a guaranteed working high-end asset for now
        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

        try {
            const gltf = await this.gltfLoader.loadAsync(modelUrl);
            this.model = gltf.scene;

            this.model.traverse((child) => {
                if (child.isMesh) {
                    if (child.material) {
                        child.material.envMapIntensity = 1.0;
                    }
                }
            });

            this.model.scale.set(8, 8, 8);
            this.model.position.y = -0.5;
            this.scene.add(this.model);
        } catch (e) {
            console.error('Model failed to load', e);
            finish(); // Ensure we can still see the site
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animate() {
        const time = this.clock.getElapsedTime();

        // Mouse Smoothing
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * this.lerpAmount;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * this.lerpAmount;

        if (this.model) {
            // Idle float
            this.model.position.y = -1 + Math.sin(time * 0.5) * 0.05;

            // Mouse tilt
            this.model.rotation.y = time * 0.1 + (this.mouse.x * 0.2);
            this.model.rotation.x = this.mouse.y * 0.1;

            // Flame flicker effect
            if (this.flameLight) {
                this.flameLight.intensity = 20 + Math.sin(time * 10) * 5;
            }
        }

        this.composer.render();
        requestAnimationFrame(() => this.animate());
    }

    finishLoading() {
        if (this.isLoaded) return;
        this.isLoaded = true;

        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('fade-out');
            document.body.classList.remove('loading');

            // Re-sync scroll triggers
            window.dispatchEvent(new CustomEvent('assetsLoaded'));
        }, 1000);
    }
}
