/**
 * Avatar Renderer - Three.js WebGL Avatar Rendering
 * 
 * This module provides real-time 3D avatar rendering with:
 * - Facial animation and expressions
 * - Lip syncing support
 * - WebRTC video streaming
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './styles.css';

class AvatarRenderer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        // Animation state
        this.blendShapes = {};
        this.isRendering = false;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f8ff);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 1.6, 3);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.setupLighting();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('Avatar Renderer initialized');
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-1, 1, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(1, 0, 1);
        this.scene.add(fillLight);
    }
    
    async loadAvatar(avatarUrl) {
        try {
            console.log('Loading avatar:', avatarUrl);
            
            const loader = new GLTFLoader();
            const gltf = await new Promise((resolve, reject) => {
                loader.load(avatarUrl, resolve, undefined, reject);
            });
            
            this.avatar = gltf.scene;
            this.scene.add(this.avatar);
            
            // Setup animations
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.avatar);
                
                // Setup blend shapes
                this.setupBlendShapes();
            }
            
            // Position avatar
            this.avatar.position.set(0, 0, 0);
            this.avatar.scale.set(1, 1, 1);
            
            console.log('Avatar loaded successfully');
            
            // Start render loop
            this.startRendering();
            
            return true;
        } catch (error) {
            console.error('Failed to load avatar:', error);
            
            // Create fallback avatar
            this.createFallbackAvatar();
            this.startRendering();
            
            return false;
        }
    }
    
    createFallbackAvatar() {
        console.log('Creating fallback avatar');
        
        // Create simple humanoid figure
        const group = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.7;
        head.castShadow = true;
        group.add(head);
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 32);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169e1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.2;
        body.castShadow = true;
        group.add(body);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.3, 1.2, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.3, 1.2, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        group.add(rightArm);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.05, 1.72, 0.14);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.05, 1.72, 0.14);
        group.add(rightEye);
        
        // Mouth
        const mouthGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.65, 0.14);
        mouth.scale.set(1, 0.3, 0.5);
        group.add(mouth);
        
        this.avatar = group;
        this.scene.add(this.avatar);
        
        // Store references for animation
        this.fallbackParts = {
            head,
            leftEye,
            rightEye,
            mouth
        };
    }
    
    setupBlendShapes() {
        // Find meshes with morph targets (blend shapes)
        this.avatar.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary) {
                console.log('Found morph targets:', Object.keys(child.morphTargetDictionary));
                
                // Store reference to mesh with blend shapes
                if (!this.blendShapeMesh) {
                    this.blendShapeMesh = child;
                }
            }
        });
    }
    
    updateBlendShapes(blendShapeData) {
        if (!blendShapeData) return;
        
        if (this.blendShapeMesh && this.blendShapeMesh.morphTargetDictionary) {
            // Update ReadyPlayer.me style blend shapes
            Object.entries(blendShapeData).forEach(([shapeName, weight]) => {
                const index = this.blendShapeMesh.morphTargetDictionary[shapeName];
                if (index !== undefined) {
                    this.blendShapeMesh.morphTargetInfluences[index] = Math.max(0, Math.min(1, weight));
                }
            });
        } else if (this.fallbackParts) {
            // Update fallback avatar
            this.updateFallbackExpression(blendShapeData);
        }
    }
    
    updateFallbackExpression(blendShapeData) {
        const { mouth, leftEye, rightEye } = this.fallbackParts;
        
        // Mouth animation
        if (blendShapeData.mouthOpen || blendShapeData.mouth_open) {
            const openness = blendShapeData.mouthOpen || blendShapeData.mouth_open || 0;
            mouth.scale.y = 0.3 + (openness * 0.7);
        }
        
        if (blendShapeData.mouthSmile || blendShapeData.mouth_smile) {
            const smile = blendShapeData.mouthSmile || blendShapeData.mouth_smile || 0;
            mouth.scale.x = 1 + (smile * 0.5);
        }
        
        // Eye blinking
        if (blendShapeData.eyeBlinkLeft || blendShapeData.eye_blink_left) {
            const blink = blendShapeData.eyeBlinkLeft || blendShapeData.eye_blink_left || 0;
            leftEye.scale.y = 1 - (blink * 0.8);
        }
        
        if (blendShapeData.eyeBlinkRight || blendShapeData.eye_blink_right) {
            const blink = blendShapeData.eyeBlinkRight || blendShapeData.eye_blink_right || 0;
            rightEye.scale.y = 1 - (blink * 0.8);
        }
    }
    
    startRendering() {
        if (this.isRendering) return;
        
        this.isRendering = true;
        console.log('Starting render loop');
        
        const animate = () => {
            if (!this.isRendering) return;
            
            requestAnimationFrame(animate);
            
            const delta = this.clock.getDelta();
            
            // Update animations
            if (this.mixer) {
                this.mixer.update(delta);
            }
            
            // Simple head bobbing animation for fallback
            if (this.fallbackParts && this.avatar) {
                const time = this.clock.getElapsedTime();
                this.avatar.position.y = Math.sin(time * 0.5) * 0.02;
                this.fallbackParts.head.rotation.y = Math.sin(time * 0.3) * 0.1;
            }
            
            // Render
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
    
    stopRendering() {
        this.isRendering = false;
        console.log('Render loop stopped');
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    dispose() {
        this.stopRendering();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up scene
        if (this.scene) {
            this.scene.clear();
        }
        
        console.log('Avatar Renderer disposed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Avatar Renderer starting...');
    
    // Create container
    const container = document.getElementById('avatar-container') || document.body;
    
    // Create renderer
    window.avatarRenderer = new AvatarRenderer(container);
    
    // Test with fallback avatar
    window.avatarRenderer.createFallbackAvatar();
    window.avatarRenderer.startRendering();
    
    // Expose global functions for testing
    window.setAvatarEmotion = (emotion, intensity = 0.8) => {
        const blendShapes = {};
        
        switch (emotion) {
            case 'happy':
                blendShapes.mouthSmile = intensity;
                break;
            case 'sad':
                blendShapes.mouthFrown = intensity;
                break;
            case 'surprised':
                blendShapes.mouthOpen = intensity * 0.5;
                blendShapes.eyeWideLeft = intensity;
                blendShapes.eyeWideRight = intensity;
                break;
        }
        
        window.avatarRenderer.updateBlendShapes(blendShapes);
    };
    
    window.testLipSync = () => {
        // Simulate talking
        let phase = 0;
        const interval = setInterval(() => {
            const openness = (Math.sin(phase) + 1) * 0.5 * 0.8;
            window.avatarRenderer.updateBlendShapes({
                mouthOpen: openness
            });
            phase += 0.5;
            
            if (phase > Math.PI * 8) {
                clearInterval(interval);
                window.avatarRenderer.updateBlendShapes({ mouthOpen: 0 });
            }
        }, 100);
    };
    
    console.log('Avatar Renderer ready!');
    console.log('Try: setAvatarEmotion("happy") or testLipSync()');
});

export default AvatarRenderer;