// NOIRÉ - 3D Experience (Three.js)

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

class FashionScene {
    constructor() {
        // Try embedded container first, then fullscreen
        this.container = document.getElementById('three-scene-container') || document.getElementById('fullscreen-3d-container');
        if (!this.container) return;

        this.isFullscreen = this.container.id === 'fullscreen-3d-container';

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.clock = new THREE.Clock();

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        // Scene Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f0f0f);
        this.scene.fog = new THREE.Fog(0x0f0f0f, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.enablePan = false;

        // Auto-rotate only for embedded, or slower for fullscreen
        if (!this.isFullscreen) {
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 2.0;
        }

        // Lighting
        this.setupLighting();

        // Object (Placeholder for Fashion Item)
        this.createPlaceholderModel();

        // Resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    // ... existing setupLighting ... 

    // ... existing createPlaceholderModel ...

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        if (this.model) {
            // Gentle float animation always
            this.model.rotation.y += 0.002;
            this.model.rotation.x = Math.sin(this.clock.getElapsedTime()) * 0.05;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xc9a227, 20); // Gold light
        spotLight.position.set(5, 5, 5);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 1;
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        const rimLight = new THREE.PointLight(0xffffff, 5);
        rimLight.position.set(-5, 0, -5);
        this.scene.add(rimLight);
    }

    createPlaceholderModel() {
        // TorusKnotGeometry simulates a complex looping fabric shape
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 150, 20);

        // Material simulating Velvet/Silk
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x0f0f0f, // Start with black
            metalness: 0.1,
            roughness: 0.5,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2,
            sheen: 1,
            sheenColor: 0xc9a227, // Gold sheen
        });

        this.model = new THREE.Mesh(geometry, material);
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.scene.add(this.model);
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    setupEventListeners() {
        // Expose function to change color
        window.changeModelColor = (colorHex) => {
            if (this.model) {
                this.model.material.color.setHex(colorHex);
                // Adjust sheen based on color brightness
                if (colorHex === 0xffffff) {
                    this.model.material.sheenColor.setHex(0xaaaaaa);
                } else {
                    this.model.material.sheenColor.setHex(0xc9a227);
                }
            }
        };

        window.toggleWireframe = () => {
            if (this.model) {
                this.model.material.wireframe = !this.model.material.wireframe;
            }
        }
    }
}

// Initialize when container is ready
new FashionScene();
