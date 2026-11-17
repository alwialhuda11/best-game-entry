// Entry point: boot the game, wire input, run the render loop and expose shot readiness.
import { render } from './render.js';
import { makeGame } from './game.js';
import { Sound } from './audio.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const st = makeGame();

const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
if (shotName) st.shot(shotName);

function point(ev) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (ev.clientX - rect.left) * (canvas.width / rect.width),
    y: (ev.clientY - rect.top) * (canvas.height / rect.height),
  };
}

canvas.addEventListener('pointerdown', (ev) => {
  const p = point(ev);
  st.click(p.x, p.y);
});

window.addEventListener('keydown', (ev) => {
  if (ev.key === 'r' || ev.key === 'R') st.startOrRestart();
  if (ev.key === 'm' || ev.key === 'M') Sound.toggle();
});

let start = performance.now();
function frame(now) {
  const t = shotName ? 0 : (now - start);
  render(ctx, st, t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// The kit's screenshot helper waits for this flag before capturing.
window.__shotReady = true;
