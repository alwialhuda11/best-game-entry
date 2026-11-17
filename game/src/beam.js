// Beam propagation: trace a laser from the emitter across the prism grid.
// Returns the polyline it travels plus which receiver and crystals it touched.
import { COLS, ROWS, DIRS } from './config.js';

// A prism of kind 0 is a '/' mirror: right->up, down->left, left->down, up->right.
// A prism of kind 1 is a '\' mirror: right->down, down->right, left->up, up->left.
const SLASH = [3, 2, 1, 0];
const BACKSLASH = [1, 0, 3, 2];

export function traceBeam(level, prisms) {
  const at = new Map();
  for (const p of prisms) at.set(p.c + ',' + p.r, p);
  const recv = level.receiver;
  const crystals = level.crystals;

  let c = -1;
  let r = level.emitterRow;
  let dir = 0;
  const points = [ { c, r } ];
  const seen = new Set();
  let hitReceiver = false;
  const hitCrystals = new Set();

  for (let step = 0; step < 200; step++) {
    const [dc, dr] = DIRS[dir];
    c += dc;
    r += dr;
    points.push({ c, r });

    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) break;

    const key = c + ',' + r + ',' + dir;
    if (seen.has(key)) break;
    seen.add(key);

    if (c === recv.c && r === recv.r) { hitReceiver = true; break; }

    for (let i = 0; i < crystals.length; i++) {
      if (c === crystals[i].c && r === crystals[i].r) hitCrystals.add(i);
    }

    const prism = at.get(c + ',' + r);
    if (prism) dir = prism.kind === 0 ? SLASH[dir] : BACKSLASH[dir];
  }
  return { points, hitReceiver, hitCrystals };
}
