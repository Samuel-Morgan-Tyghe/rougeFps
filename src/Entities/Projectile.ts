import * as THREE from 'three';

export class Projectile {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    isDead: boolean = false;
    lifetime: number = 2.0; // Seconds (Range)
    radius: number = 0.3;

    constructor(position: THREE.Vector3, velocity: THREE.Vector3) {
        this.velocity = velocity.clone();
        
        const geometry = new THREE.SphereGeometry(this.radius);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // Cyan tear
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
    }

    update(dt: number) {
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.isDead = true;
            return;
        }

        // Apply Gravity (Tear drop) - Isaac tears have height physics
        // For FPS, maybe straight shot? No, user wants "Isaac mechanics".
        // Isaac tears have momentum + gravity arc.
        this.velocity.y -= 10.0 * dt; // Gravity
        
        // Floor collision
        if (this.mesh.position.y < this.radius && this.velocity.y < 0) {
            // Splash!
            this.isDead = true;
        }

        this.mesh.position.addScaledVector(this.velocity, dt);
    }
}
