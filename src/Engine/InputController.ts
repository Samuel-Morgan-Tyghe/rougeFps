import { Vector2 } from 'three';

export class InputController {
    keys: { [key: string]: boolean } = {};
    mouseDelta: Vector2 = new Vector2();
    isLocked: boolean = false;
    mouseDown: boolean = false;

    constructor() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        
        // Lock on click
        document.body.addEventListener('click', () => {
            if (!this.isLocked) {
                document.body.requestPointerLock();
            }
        });
    }

    onKeyDown(event: KeyboardEvent) {
        this.keys[event.code] = true;
    }

    onKeyUp(event: KeyboardEvent) {
        this.keys[event.code] = false;
    }

    onMouseMove(event: MouseEvent) {
        if (this.isLocked) {
            this.mouseDelta.x += event.movementX;
            this.mouseDelta.y += event.movementY;
        }
    }

    onMouseDown() {
        this.mouseDown = true;
    }

    onMouseUp() {
        this.mouseDown = false;
    }

    onPointerLockChange() {
        this.isLocked = document.pointerLockElement === document.body;
    }

    getAxis(positive: string, negative: string): number {
        return (this.keys[positive] ? 1 : 0) - (this.keys[negative] ? 1 : 0);
    }
}
