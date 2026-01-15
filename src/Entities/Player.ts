import * as THREE from 'three';
import { InputController } from '../Engine/InputController';

export class Player {
    camera: THREE.PerspectiveCamera;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    input: InputController;
    speed: number = 20.0; // Units per second
    friction: number = 10.0;
    
    // Camera params
    pitch: number = 0;
    yaw: number = 0;

    // Dimensions
    height: number = 1.5;
    radius: number = 0.5;

    constructor(input: InputController) {
        this.input = input;
        this.position = new THREE.Vector3(0, this.height, 0);
        this.velocity = new THREE.Vector3();
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.copy(this.position);
    }

    update(dt: number) {
        // Rotation
        const sensitivity = 0.002;
        this.yaw -= this.input.mouseDelta.x * sensitivity;
        this.pitch -= this.input.mouseDelta.y * sensitivity;

        // Clamp pitch
        this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));

        this.camera.rotation.set(0, 0, 0);
        this.camera.rotateY(this.yaw);
        this.camera.rotateX(this.pitch);

        // Reset mouse delta
        this.input.mouseDelta.set(0, 0);

        // Movement
        const forward = this.input.getAxis('KeyW', 'KeyS');
        const strafe = this.input.getAxis('KeyD', 'KeyA');

        const direction = new THREE.Vector3(strafe, 0, -forward);
        direction.applyEuler(new THREE.Euler(0, this.yaw, 0));
        direction.normalize();

        if (direction.length() > 0) {
            this.velocity.x += direction.x * this.speed * dt;
            this.velocity.z += direction.z * this.speed * dt;
        }

        // Apply friction
        this.velocity.x -= this.velocity.x * this.friction * dt;
        this.velocity.z -= this.velocity.z * this.friction * dt;

        // Apply Velocity
        this.position.x += this.velocity.x * dt;
        this.position.z += this.velocity.z * dt;

        // Sync Camera
        this.camera.position.copy(this.position);

        // Shooting
        if (this.input.mouseDown) {
            this.tryShoot();
        }
        
        this.fireCooldown -= dt;
    }

    fireCooldown: number = 0;
    
    // Stats / Synergy support
    stats = {
        shotSpeed: 30.0,
        fireRate: 0.4,
        damage: 3.5,
        shotCount: 1, // Synergy: Triple Shot = 3
        spread: 0.15 // Radians
    };

    onShoot?: (position: THREE.Vector3, velocity: THREE.Vector3) => void;

    tryShoot() {
        if (this.fireCooldown > 0) return;
        this.fireCooldown = this.stats.fireRate;

        if (this.onShoot) {
            const baseDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();

            // Handle multi-shot
            const startAngle = -((this.stats.shotCount - 1) * this.stats.spread) / 2;

            for (let i = 0; i < this.stats.shotCount; i++) {
                const angle = startAngle + (i * this.stats.spread);
                
                // Rotate direction around Y axis (relative to camera up? No, relative to player Up)
                const dir = baseDir.clone();
                // Simple spread in local X (approximate for FPS)
                // Better: mix camera Right vector
                const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
                dir.addScaledVector(right, Math.sin(angle));
                dir.normalize();

                const velocity = dir.multiplyScalar(this.stats.shotSpeed).add(this.velocity.clone().multiplyScalar(0.2));
                velocity.y += 2.0; // Arch

                this.onShoot(this.position.clone(), velocity);
            }
        }
    }
}

