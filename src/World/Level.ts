import * as THREE from 'three';

export class Level {
    scene: THREE.Scene;
    floor: THREE.Mesh;
    walls: THREE.Group;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.walls = new THREE.Group();
        this.scene.add(this.walls);

        // Floor (Isaac Basement Style)
        const floorGeometry = new THREE.PlaneGeometry(40, 40);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x553322,
            roughness: 0.8 
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Point Light (Center of room)
        const light = new THREE.PointLight(0xffddaa, 1, 30);
        light.position.set(0, 5, 0);
        scene.add(light);

        this.createWalls();
    }

    createWalls() {
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x442211 });
        const wallHeight = 4;
        const roomSize = 20; // Half-size (radius)

        const configs = [
            { pos: [0, wallHeight/2, -roomSize], dim: [roomSize*2, wallHeight, 1] }, // North
            { pos: [0, wallHeight/2, roomSize], dim: [roomSize*2, wallHeight, 1] }, // South
            { pos: [-roomSize, wallHeight/2, 0], dim: [1, wallHeight, roomSize*2] }, // West
            { pos: [roomSize, wallHeight/2, 0], dim: [1, wallHeight, roomSize*2] }, // East
        ];

        configs.forEach(cfg => {
            const geo = new THREE.BoxGeometry(cfg.dim[0], cfg.dim[1], cfg.dim[2]);
            const mesh = new THREE.Mesh(geo, wallMat);
            mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
            this.walls.add(mesh);
        });
    }
}
