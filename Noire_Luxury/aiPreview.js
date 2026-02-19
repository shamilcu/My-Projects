// NOIRÉ - AI Outfit Preview

class AIOutfitPreview {
    constructor() {
        this.video = document.getElementById('webcam-video');
        this.canvas = document.getElementById('ai-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.startBtn = document.getElementById('start-ai-btn');
        this.loader = document.getElementById('ai-loader');
        this.instruction = document.querySelector('.ai-instruction');

        // Controls
        this.outfitItems = document.querySelectorAll('.outfit-item');
        this.sizeSlider = document.getElementById('size-slider');
        this.yOffsetSlider = document.getElementById('y-offset-slider');
        this.uploadInput = document.getElementById('image-upload');

        this.detector = null;
        this.isStreaming = false;
        this.animationId = null;

        // State
        this.currentOutfitSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDUwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMTUwIDUwIEMgMTAwIDUwIDUwIDEwMCA1MCAxNTAgTDgwIDE4MCBDIDgwIDIwMCAxMDAgMjIwIDEyMCAyMjAgTCAxNTAgMjIwIEwgMTUwIDU1MCBDIDE1MCA1NzAgMTcwIDU5MCAxOTAgNTkwIEwgMzEwIDU5MCBDIDMzMCA1OTAgMzUwIDU3MCAzNTAgNTUwIEwgMzUwIDIyMCBMIDM4MCAyMjAgQyA0MDAgMjIwIDQyMCAyMDAgNDIwIDE4MCBMIDQ1MCAxNTAgQyA0NTAgMTAwIDQwMCA1MCAzNTAgNTAgTCAzMDAgODAgQyAzMDAgODAgMjc1IDcwIDI1MCA3MCBDIDIyNSA3MCAyMDAgODAgMjAwIDgwIEwgMTUwIDUwWiIgZmlsbD0iIzExMSIgc3Ryb2tlPSIjYzlhMjI3IiBzdHJva2Utd2lkdGg9IjEwIi8+Cjwvc3ZnPg==';
        this.outfitImage = new Image();
        this.outfitImage.src = this.currentOutfitSrc;

        this.scale = 1.0;
        this.yOffset = 0;
        this.uploadedImageMode = false;
        this.uploadedImage = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startWebcam());
        }

        // Outfit Selection
        this.outfitItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // UI Update
                this.outfitItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Logic Update
                const src = item.getAttribute('data-src');
                if (src) {
                    this.currentOutfitSrc = src;
                    this.outfitImage.src = src;
                }
            });
        });

        // Sliders
        if (this.sizeSlider) {
            this.sizeSlider.addEventListener('input', (e) => {
                this.scale = parseFloat(e.target.value);
            });
        }

        if (this.yOffsetSlider) {
            this.yOffsetSlider.addEventListener('input', (e) => {
                this.yOffset = parseInt(e.target.value);
            });
        }

        // Image Upload
        if (this.uploadInput) {
            this.uploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
    }

    async init() {
        // Show loader
        if (this.loader) {
            this.loader.style.display = 'block';
            this.startBtn.style.display = 'none';
            this.instruction.innerText = "Initializing AI Models...";
        }

        // Load the model
        if (!window.poseDetection) {
            console.error("Pose Detection library not loaded.");
            this.instruction.innerText = "Error: AI Library not loaded.";
            return;
        }

        try {
            const model = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
            };
            this.detector = await poseDetection.createDetector(model, detectorConfig);
            console.log('AI Model Loaded');

            // UI Ready State
            if (this.loader) this.loader.style.display = 'none';
            if (this.startBtn) {
                this.startBtn.style.display = 'flex';
                this.startBtn.disabled = false;
            }
            if (this.instruction) this.instruction.innerText = "Ready. Allow camera access to start.";

        } catch (error) {
            console.error("Model load error:", error);
            if (this.instruction) this.instruction.innerText = "Error loading AI model. Please reload.";
        }
    }

    async startWebcam() {
        if (this.isStreaming) return;

        try {
            this.uploadedImageMode = false; // Reset upload mode

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 } // Request standard resolution
            });

            this.video.srcObject = stream;

            this.video.onloadeddata = () => {
                this.isStreaming = true;

                // Hide overlay UI
                const overlay = document.getElementById('ai-start-overlay');
                if (overlay) overlay.style.display = 'none';

                // Resize canvas to match video
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;

                this.detectPose();
            };
        } catch (err) {
            console.error("Error accessing webcam: ", err);
            alert("Could not access webcam. Please allow camera permissions.");
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImageMode = true;
                this.uploadedImage = img;
                this.isStreaming = false; // Stop webcam loop if running

                // Stop webcam stream tracks
                if (this.video.srcObject) {
                    this.video.srcObject.getTracks().forEach(track => track.stop());
                    this.video.srcObject = null;
                }

                // Hide overlay UI
                const overlay = document.getElementById('ai-start-overlay');
                if (overlay) overlay.style.display = 'none';

                // Resize canvas to fit image (max width logic)
                const maxWidth = this.video.parentElement.clientWidth;
                const scaleFactor = Math.min(1, maxWidth / img.width);

                this.canvas.width = img.width * scaleFactor;
                this.canvas.height = img.height * scaleFactor;

                // Start detection on static image
                this.detectPoseStatic();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    async detectPose() {
        if (!this.isStreaming || !this.detector) return;

        const poses = await this.detector.estimatePoses(this.video);

        // Draw video frame to canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        // Mirror effect for webcam
        this.ctx.scale(-1, 1);
        this.ctx.translate(-this.canvas.width, 0);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        if (poses && poses.length > 0) {
            // Adjust keypoints for mirrored canvas
            const mirroredPoses = poses.map(pose => ({
                ...pose,
                keypoints: pose.keypoints.map(kp => ({
                    ...kp,
                    x: this.canvas.width - kp.x // Mirror x coordinate
                }))
            }));
            this.drawOutfit(mirroredPoses[0].keypoints);
        }

        this.animationId = requestAnimationFrame(() => this.detectPose());
    }

    async detectPoseStatic() {
        if (!this.uploadedImage || !this.detector) return;

        // Draw image
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.uploadedImage, 0, 0, this.canvas.width, this.canvas.height);

        // Detect on the image element directly? Or canvas? 
        // PoseDetection works best on Image, Video, or Canvas.
        // Since we drew to canvas, let's use the image source.
        const poses = await this.detector.estimatePoses(this.uploadedImage);

        if (poses && poses.length > 0) {
            // Need to scale keypoints if we scaled the canvas?
            // If we detect on original image, keypoints are in original coords.
            // We need to scale them to canvas size.
            const scaleX = this.canvas.width / this.uploadedImage.width;
            const scaleY = this.canvas.height / this.uploadedImage.height;

            const scaledKeypoints = poses[0].keypoints.map(kp => ({
                ...kp,
                x: kp.x * scaleX,
                y: kp.y * scaleY
            }));

            this.drawOutfit(scaledKeypoints);
        }

        // Loop not strictly necessary for static, but good if we want to support adjusting sliders live
        this.animationId = requestAnimationFrame(() => this.detectPoseStatic());
    }

    drawOutfit(keypoints) {
        // Get keypoints for shoulders
        const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
        const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');

        // Confidence threshold
        if (leftShoulder && rightShoulder && leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
            // Calculate center, width, and angle
            const centerX = (leftShoulder.x + rightShoulder.x) / 2;
            const centerY = (leftShoulder.y + rightShoulder.y) / 2;

            const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);

            // Calculate rotation (angle of shoulders)
            const angle = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x);

            // Adjust overlay size/position
            // Base width multiplier suitable for most tops
            const baseWidth = shoulderWidth * 2.8;

            const imgWidth = baseWidth * this.scale;
            const imgHeight = imgWidth * 1.2; // Aspect ratio of outfit image

            // Position
            const imgX = -imgWidth / 2; // Relative to center for rotation
            const imgY = (-imgHeight * 0.2) + this.yOffset; // Offset upwards/downwards + slider

            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(angle); // Rotate to match shoulder tilt

            // Draw Outfit
            this.ctx.drawImage(this.outfitImage, imgX, imgY, imgWidth, imgHeight);

            this.ctx.restore();
        }
    }
}

// Global init
window.initAI = async () => {
    const aiPreview = new AIOutfitPreview();
    await aiPreview.init();
};

// Start trigger
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAI);
} else {
    window.initAI();
}
