import * as THREE from 'three';
import { Fly } from '../Entities/Enemies/Fly';
import { Host } from '../Entities/Enemies/Host';
import { Enemy } from '../Entities/Enemy';
import { Player } from '../Entities/Player';
import { Projectile } from '../Entities/Projectile';
import { Level } from '../World/Level';
import { InputController } from './InputController';

export class Game {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    
    input: InputController;
    player: Player;
    level: Level;
    
    projectiles: Projectile[] = [];
    enemies: Enemy[] = [];

    constructor() {
        // Setup Renderer
        const app = document.querySelector<HTMLDivElement>('#app')!;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        app.appendChild(this.renderer.domElement);

        // Setup Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x110d0a);

        // Inputs
        this.input = new InputController();

        // Level
        this.level = new Level(this.scene);

        // Player
        this.player = new Player(this.input);
        
        // Synergy Demo: Triple Shot (The Inner Eye)
        this.player.stats.shotCount = 3;
        this.player.stats.fireRate = 0.6; // Tears down

        this.player.onShoot = (pos, vel) => this.spawnProjectile(pos, vel);
        this.camera = this.player.camera;

        // Resize
        window.addEventListener('resize', () => this.onResize());

        // Spawn test enemies
        this.spawnEnemy(new Fly(new THREE.Vector3(0, 2, -8)));
        this.spawnEnemy(new Fly(new THREE.Vector3(3, 2, -8)));
        
        const host = new Host(new THREE.Vector3(-5, 1.5, -10));
        host.onShoot = (pos, vel) => this.spawnEnemyProjectile(pos, vel);
        this.spawnEnemy(host);
    }

    spawnProjectile(position: THREE.Vector3, velocity: THREE.Vector3) {
        // Player projectile
        const proj = new Projectile(position, velocity);
        this.projectiles.push(proj);
        this.scene.add(proj.mesh);
    }

    spawnEnemyProjectile(position: THREE.Vector3, velocity: THREE.Vector3) {
        const proj = new Projectile(position, velocity);
        // Make enemy projectiles Red
        if (proj.mesh.material instanceof THREE.MeshBasicMaterial) {
            proj.mesh.material.color.setHex(0xff0000);
        }
        this.enemyProjectiles.push(proj);
        this.scene.add(proj.mesh);
    }

    spawnEnemy(enemy: Enemy) {
        this.enemies.push(enemy);
        this.scene.add(enemy.mesh);
    }

    update(dt: number) {
        this.player.update(dt);
        
        // Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt);

            // Check Collision with Enemies
            let hit = false;
            for (const enemy of this.enemies) {
                if (enemy.isDead) continue;
                if (p.mesh.position.distanceTo(enemy.mesh.position) < (p.radius + enemy.radius)) {
                    enemy.takeDamage(3.5); // Isaac base damage
                    hit = true;
                    break;
                }
            }

            if (p.isDead || hit) {
                this.scene.remove(p.mesh);
                this.projectiles.splice(i, 1);
            }
        }

        // Update Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update(dt, this.player.position);
            
            if (e.isDead) {
                this.scene.remove(e.mesh);
                this.enemies.splice(i, 1);
            }
        }

        // Update Enemy Projectiles
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const p = this.enemyProjectiles[i];
            p.update(dt);
            
            // check collision with player
            if (p.mesh.position.distanceTo(this.player.position) < (p.radius + 0.5)) {
                console.log("Player hit!");
                p.isDead = true;
            }

            if (p.isDead) {
                this.scene.remove(p.mesh);
                this.enemyProjectiles.splice(i, 1);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
