import { Game } from './Engine/Game';
import './style.css';

const game = new Game();
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate)
  
  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  game.update(dt);
}

animate()
