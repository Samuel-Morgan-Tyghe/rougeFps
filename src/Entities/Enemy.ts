import * as THREE from 'three';

export class Enemy {
    mesh: THREE.Mesh;
    hp: number;
    maxHp: number;
    isDead: boolean = false;
    radius: number = 0.5;
    velocity: THREE.Vector3 = new THREE.Vector3();

    constructor(position: THREE.Vector3, hp: number) {
        this.hp = hp;
        this.maxHp = hp;
        this.mesh = new THREE.Mesh(); // Placeholder, override in child
        this.mesh.position.copy(position);
    }

    update(dt: number, playerPosition: THREE.Vector3) {
        // Base logic, override
        this.mesh.position.addScaledVector(this.velocity, dt);
    }

    takeDamage(amount: number) {
        this.hp -= amount;
        
        // Flash red (simple visual feedback)
        if (this.mesh.material instanceof THREE.MeshStandardMaterial || this.mesh.material instanceof THREE.MeshBasicMaterial) {
            const oldColor = this.mesh.material.color.getHex();
            this.mesh.material.color.setHex(0xff0000);
            setTimeout(() => {
                if (!this.isDead) this.mesh.material.color.setHex(oldColor);
            }, 50);
        }

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        // Particle effect?
    }
}
