// Canvas renderer for Prism Pulse. Draws the board, beam, HUD and screens.
import { COLORS, CELL, COLS, ROWS, BOARD_X, BOARD_Y } from './config.js';

const W = 960, H = 600;

function cellCenter(c, r) {
  return { x: BOARD_X + c * CELL + CELL / 2, y: BOARD_Y + r * CELL + CELL / 2 };
}

function bg(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, COLORS.bgDeep);
  g.addColorStop(0.55, COLORS.bg);
  g.addColorStop(1, '#0a0730');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // drifting starfield
  for (let i = 0; i < 70; i++) {
    const x = (i * 137.5 + t * 0.012) % W;
    const y = (i * 79.3 + t * 0.006) % H;
    const a = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(i + t * 0.001));
    ctx.fillStyle = `rgba(150,190,255,${a})`;
    ctx.fillRect(x, y, 2, 2);
  }
  const glow = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 520);
  glow.addColorStop(0, 'rgba(70,60,180,0.10)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

function board(ctx) {
  const w = COLS * CELL, h = ROWS * CELL;
  ctx.fillStyle = 'rgba(10,16,44,0.85)';
  ctx.strokeStyle = 'rgba(100,150,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(BOARD_X - 6, BOARD_Y - 6, w + 12, h + 12, 12);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(BOARD_X + c * CELL, BOARD_Y);
    ctx.lineTo(BOARD_X + c * CELL, BOARD_Y + h);
    ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(BOARD_X, BOARD_Y + r * CELL);
    ctx.lineTo(BOARD_X + w, BOARD_Y + r * CELL);
    ctx.stroke();
  }
}

function prism(ctx, p, selected, t) {
  const { x, y } = cellCenter(p.c, p.r);
  const s = CELL * 0.30;
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = selected ? COLORS.gold : COLORS.cyan;
  ctx.shadowBlur = selected ? 22 : 12;
  ctx.strokeStyle = selected ? COLORS.gold : COLORS.violet;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (p.kind === 0) { ctx.moveTo(-s, s); ctx.lineTo(s, -s); }
  else { ctx.moveTo(-s, -s); ctx.lineTo(s, s); }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(169,139,255,0.18)';
  ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function crystal(ctx, c, r, taken, t) {
  const { x, y } = cellCenter(c, r);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.001);
  const col = taken ? COLORS.dim : COLORS.gold;
  ctx.shadowColor = COLORS.gold; ctx.shadowBlur = taken ? 0 : 16;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, -13); ctx.lineTo(9, 0); ctx.lineTo(0, 13); ctx.lineTo(-9, 0); ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function receiver(ctx, c, r, lit, t) {
  const { x, y } = cellCenter(c, r);
  ctx.save();
  ctx.translate(x, y);
  const col = lit ? COLORS.green : COLORS.magenta;
  ctx.shadowColor = col; ctx.shadowBlur = lit ? 26 + 8 * Math.sin(t * 0.01) : 14;
  ctx.strokeStyle = col; ctx.lineWidth = 3.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.arc(0, 0, 10 + i * 6, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function emitter(ctx, row, t) {
  const { x, y } = cellCenter(0, row);
  ctx.save();
  ctx.translate(BOARD_X - 26, y);
  ctx.fillStyle = COLORS.cyan;
  ctx.shadowColor = COLORS.cyan; ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(-10, -14); ctx.lineTo(14, 0); ctx.lineTo(-10, 14); ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function beam(ctx, points, t) {
  if (!points || points.length < 2) return;
  const px = (p) => ({ x: p.c < 0 ? BOARD_X - 26 : cellCenter(p.c, p.r).x, y: cellCenter(0, p.r).y });
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const [width, color, blur] of [[14, 'rgba(57,240,255,0.10)', 26], [6, 'rgba(57,240,255,0.35)', 16], [2.5, '#d8fbff', 10]]) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.shadowColor = COLORS.cyan; ctx.shadowBlur = blur;
    ctx.beginPath();
    let first = true;
    for (const p of points) {
      const q = px(p);
      if (first) { ctx.moveTo(q.x, q.y); first = false; } else ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function text(ctx, str, x, y, size, color, align, weight) {
  ctx.font = `${weight || 600} ${size}px "Trebuchet MS", system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function hud(ctx, st) {
  ctx.fillStyle = COLORS.panel;
  ctx.beginPath(); ctx.roundRect(0, 0, W, 64, 0); ctx.fill();
  text(ctx, 'PRISM PULSE', 32, 32, 22, COLORS.cyan, 'left', 700);
  text(ctx, `LEVEL ${st.levelIndex + 1}/${st.levels.length}`, 250, 32, 16, COLORS.white);
  text(ctx, st.level.name, 250, 50, 13, COLORS.dim);
  text(ctx, `MOVES ${st.movesLeft}`, 560, 32, 17, st.movesLeft <= 2 ? COLORS.magenta : COLORS.gold, 'center', 700);
  text(ctx, `SCORE ${st.score}`, 730, 32, 17, COLORS.green, 'center', 700);
  text(ctx, `CRYSTALS ${st.taken.size}/${st.totalCrystals}`, 900, 32, 15, COLORS.gold, 'center', 700);
  ctx.strokeStyle = 'rgba(100,150,255,0.2)';
  ctx.beginPath(); ctx.moveTo(0, 64); ctx.lineTo(W, 64); ctx.stroke();
}

function centerPanel(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(4,5,20,0.78)';
  ctx.fillRect(0, 0, W, H);
  const pw = 620, ph = 330, px = (W - pw) / 2, py = (H - ph) / 2;
  ctx.fillStyle = 'rgba(14,20,54,0.96)';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.shadowColor = accent; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 18); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  text(ctx, title, W / 2, py + 66, 42, accent, 'center', 700);
  lines.forEach((ln, i) => text(ctx, ln, W / 2, py + 132 + i * 34, 17, i === lines.length - 1 ? COLORS.white : COLORS.dim, 'center', i === lines.length - 1 ? 700 : 500));
}

export function render(ctx, st, t) {
  bg(ctx, t);
  board(ctx);
  emitter(ctx, st.level.emitterRow, t);
  for (const p of st.prisms) prism(ctx, p, st.selected === p, t);
  st.level.crystals.forEach((c, i) => crystal(ctx, c.c, c.r, st.taken.has(i), t));
  receiver(ctx, st.level.receiver.c, st.level.receiver.r, st.beam && st.beam.hitReceiver, t);
  beam(ctx, st.beam && st.beam.points, t);
  hud(ctx, st);
  if (st.screen === 'start') {
    centerPanel(ctx, 'PRISM PULSE', [
      'Bend the laser. Light every crystal. Reach the receiver.',
      'Click a prism to rotate it 45 degrees. Limited moves.',
      'CLICK TO START',
    ], COLORS.cyan);
  } else if (st.screen === 'win') {
    centerPanel(ctx, 'ALL LEVELS CLEAR', [
      `Final score: ${st.score}`,
      'You mastered the light. Nicely done.',
      'CLICK OR PRESS R TO PLAY AGAIN',
    ], COLORS.green);
  } else if (st.screen === 'lose') {
    centerPanel(ctx, 'OUT OF MOVES', [
      `Level ${st.levelIndex + 1} — ${st.level.name}`,
      `Score ${st.score}. Reposition the prisms and try again.`,
      'CLICK OR PRESS R TO RETRY',
    ], COLORS.magenta);
  }
}
