import * as THREE from 'three';
import { Enemy } from '../Enemy';

export class Host extends Enemy {
    state: 'CLOSED' | 'OPEN' = 'CLOSED';
    timer: number = 0;
    
    // Config
    closedDuration: number = 2.0;
    openDuration: number = 1.5;
    
    // Parts
    skull: THREE.Mesh;
    flesh: THREE.Mesh;

    onShoot?: (pos: THREE.Vector3, vel: THREE.Vector3) => void;

    constructor(position: THREE.Vector3) {
        super(position, 20); // 20 HP, tougher

        // Base (Flesh)
        const fleshGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.6);
        const fleshMat = new THREE.MeshStandardMaterial({ color: 0xff8888 });
        this.flesh = new THREE.Mesh(fleshGeo, fleshMat);
        this.flesh.position.y = 0.3;
        this.mesh.add(this.flesh);

        // Skull (Invulnerable shell)
        const skullGeo = new THREE.SphereGeometry(0.5);
        const skullMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
        this.skull = new THREE.Mesh(skullGeo, skullMat);
        this.skull.position.y = 0.8;
        this.mesh.add(this.skull);

        this.mesh.position.copy(position);
    }

    update(dt: number, playerPosition: THREE.Vector3) {
        this.timer -= dt;
        
        // Face player
        this.mesh.lookAt(playerPosition.x, this.mesh.position.y, playerPosition.z);

        if (this.state === 'CLOSED') {
            // Hiding
            this.skull.position.y = 0.5; // Lower skull
            
            if (this.timer <= 0) {
                this.state = 'OPEN';
                this.timer = this.openDuration;
                this.skull.position.y = 1.0; // Raise skull
                this.shoot(playerPosition);
            }
        } else {
            // Open
            if (this.timer <= 0) {
                this.state = 'CLOSED';
                this.timer = this.closedDuration;
                this.skull.position.y = 0.5;
            }
        }
    }

    shoot(targetPos: THREE.Vector3) {
        if (this.onShoot) {
            const dir = new THREE.Vector3().subVectors(targetPos, this.mesh.position).normalize();
            // Host shoots 3 spread shots? Or just 1 for now.
            // Let's do 1 fast red shot.
            const vel = dir.multiplyScalar(15.0);
            vel.y += 2.0; // Arc
            
            // Offset spawn to be under skull
            const spawnPos = this.mesh.position.clone().add(new THREE.Vector3(0, 0.8, 0));
            this.onShoot(spawnPos, vel);
        }
    }

    takeDamage(amount: number) {
        if (this.state === 'CLOSED') {
            // Invulnerable sound/spark?
            return;
        }
        super.takeDamage(amount);
    }
}
