import * as THREE from 'three';
import { Enemy } from '../Enemy';

export class Fly extends Enemy {
    speed: number = 4.0;
    bobOffset: number = Math.random() * 100;

    constructor(position: THREE.Vector3) {
        super(position, 10); // 10 HP

        const geometry = new THREE.SphereGeometry(this.radius);
        const material = new THREE.MeshBasicMaterial({ color: 0x222222 }); // Black fly
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        // Fly wings (simple)
        const wingGeo = new THREE.PlaneGeometry(0.8, 0.3);
        const wingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const wing1 = new THREE.Mesh(wingGeo, wingMat);
        wing1.position.set(0.4, 0.2, 0);
        this.mesh.add(wing1);
        
        const wing2 = new THREE.Mesh(wingGeo, wingMat);
        wing2.position.set(-0.4, 0.2, 0);
        this.mesh.add(wing2);
    }

    update(dt: number, playerPosition: THREE.Vector3) {
        // Chase player logic
        const dir = new THREE.Vector3().subVectors(playerPosition, this.mesh.position);
        dir.y = 0; // Ignore height initially 
        dir.normalize();

        // Move towards player
        this.velocity.copy(dir).multiplyScalar(this.speed);
        
        // Apply position
        this.mesh.position.addScaledVector(this.velocity, dt);

        // Bobbing effect
        this.mesh.position.y = 1.5 + Math.sin(performance.now() * 0.005 + this.bobOffset) * 0.2;
    }
}
