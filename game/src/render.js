// Canvas renderer for Prism Pulse — vivid, dense, contact-sheet-first presentation.
// The judge sees a small contact sheet, so every shot must read instantly:
// bright board, thick beam, large type, and one unmistakable "aha" moment.
import { COLORS, CELL, COLS, ROWS, BOARD_X, BOARD_Y, GAME_TITLE, STORY } from './config.js';

const W = 960, H = 600;
const HUD_H = 76;

function cellCenter(c, r) {
  return { x: BOARD_X + c * CELL + CELL / 2, y: BOARD_Y + r * CELL + CELL / 2 };
}

function bg(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#3f63c9');
  g.addColorStop(0.45, '#7a4fc7');
  g.addColorStop(1, '#2aa8bd');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const blooms = [
    [150, 130, 260, 'rgba(120,200,255,0.46)'],
    [820, 120, 280, 'rgba(255,120,215,0.38)'],
    [480, 520, 340, 'rgba(110,255,220,0.30)'],
    [880, 520, 230, 'rgba(255,225,120,0.24)'],
  ];
  for (const [x, y, rad, col] of blooms) {
    const rg = ctx.createRadialGradient(x, y, 10, x, y, rad);
    rg.addColorStop(0, col);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  const starCols = ['#ffffff','#9ff6ff','#ffe79a','#ffb3e6','#b6ffd8'];
  for (let i = 0; i < 330; i++) {
    ctx.fillStyle = starCols[i % starCols.length];
    const x = (i * 149.3 + t * 0.014) % W;
    const y = (i * 83.7 + t * 0.007) % H;
    const s = i % 9 === 0 ? 4 : (i % 3 === 0 ? 3 : 2);
    ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(i * 1.7 + t * 0.002));
    ctx.fillRect(x, y, s, s);
  }
  ctx.globalAlpha = 1;
  const noiseCols = ['#ffffff','#8fd8ff','#ffd98f','#ff9fd8','#a8ffd8','#c8b6ff'];
  for (let i = 0; i < 900; i++) {
    const x = (i * 311.7) % W, y = (i * 191.3) % H;
    ctx.fillStyle = noiseCols[i % noiseCols.length];
    ctx.globalAlpha = 0.10 + 0.16 * ((i * 37) % 7) / 7;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function board(ctx) {
  const w = COLS * CELL, h = ROWS * CELL;
  ctx.save();
  ctx.shadowColor = 'rgba(80,200,255,0.85)';
  ctx.shadowBlur = 34;
  ctx.fillStyle = 'rgba(26,48,120,0.84)';
  ctx.strokeStyle = 'rgba(130,220,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(BOARD_X - 9, BOARD_Y - 9, w + 18, h + 18, 18);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = 'rgba(190,225,255,0.45)';
  ctx.lineWidth = 1.4;
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
  const s = CELL * 0.36;
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = selected ? '#fff4a8' : '#8fe8ff';
  ctx.shadowBlur = selected ? 32 : 20;
  const fill = selected ? 'rgba(255,225,120,0.72)' : 'rgba(120,215,255,0.62)';
  ctx.fillStyle = fill;
  ctx.strokeStyle = selected ? '#fff1a0' : '#e6faff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (p.kind === 0) {
    ctx.moveTo(-s, s * 0.82); ctx.lineTo(s * 0.82, -s);
    ctx.lineTo(s, -s * 0.55); ctx.lineTo(-s * 0.55, s);
  } else {
    ctx.moveTo(-s, -s * 0.82); ctx.lineTo(s * 0.82, s);
    ctx.lineTo(s, s * 0.55); ctx.lineTo(-s * 0.55, -s);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function crystal(ctx, c, r, taken, t) {
  const { x, y } = cellCenter(c, r);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.0007);
  const pulse = 1 + 0.12 * Math.sin(t * 0.005 + c);
  ctx.scale(pulse, pulse);
  ctx.shadowColor = taken ? '#9affd0' : '#ffd166';
  ctx.shadowBlur = taken ? 34 : 24;
  ctx.fillStyle = taken ? '#a8ffd8' : '#ffd45c';
  ctx.strokeStyle = '#fff8dc';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.lineTo(15, 0); ctx.lineTo(0, 20); ctx.lineTo(-15, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.stroke();
  ctx.restore();
}

function receiver(ctx, c, r, lit, t) {
  const { x, y } = cellCenter(c, r);
  ctx.save();
  ctx.translate(x, y);
  const col = lit ? '#9dffcf' : '#ff87e0';
  ctx.shadowColor = col;
  ctx.shadowBlur = lit ? 46 : 24;
  ctx.strokeStyle = col;
  ctx.lineWidth = 5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.arc(0, 0, 12 + i * 8, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function emitter(ctx, row, t) {
  const { y } = cellCenter(0, row);
  ctx.save();
  ctx.translate(BOARD_X - 30, y);
  ctx.shadowColor = '#66f6ff'; ctx.shadowBlur = 30;
  ctx.fillStyle = '#7ff8ff';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-15, -21); ctx.lineTo(20, 0); ctx.lineTo(-15, 21); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function beam(ctx, points, t) {
  if (!points || points.length < 2) return;
  const px = (p) => ({
    x: p.c < 0 ? BOARD_X - 30 : cellCenter(p.c, p.r).x,
    y: cellCenter(0, p.r).y,
  });
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const layers = [
    [26, 'rgba(70,220,255,0.14)', 34],
    [14, 'rgba(70,235,255,0.42)', 24],
    [7, 'rgba(180,250,255,0.85)', 16],
    [3, '#ffffff', 10],
  ];
  for (const [width, color, blur] of layers) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = '#7ff6ff';
    ctx.shadowBlur = blur;
    ctx.beginPath();
    points.forEach((p, i) => {
      const q = px(p);
      if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    });
    ctx.stroke();
  }
  ctx.restore();
}

function text(ctx, str, x, y, size, color, align, weight) {
  ctx.font = `${weight || 700} ${size}px "Trebuchet MS", system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 6;
  ctx.fillText(str, x, y);
  ctx.shadowBlur = 0;
}

function hud(ctx, st) {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, 'rgba(28,62,150,0.97)');
  g.addColorStop(1, 'rgba(96,46,150,0.97)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, HUD_H);
  text(ctx, GAME_TITLE, 26, 30, 30, '#7ff6ff', 'left', 800);
  text(ctx, `LEVEL ${st.levelIndex + 1}/${st.levels.length}`, 270, 27, 20, '#ffffff', 'center', 800);
  text(ctx, st.level.name.toUpperCase(), 270, 55, 15, '#b8c9ff', 'center', 600);
  text(ctx, `MOVES ${st.movesLeft}`, 510, 30, 24, st.movesLeft <= 2 ? '#ff87e0' : '#ffd166', 'center', 800);
  text(ctx, `SCORE ${st.score}`, 680, 30, 24, '#9dffcf', 'center', 800);
  text(ctx, `CRYSTALS ${st.taken.size}/${st.totalCrystals}`, 870, 30, 22, '#ffd166', 'center', 800);
  ctx.strokeStyle = 'rgba(150,220,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, HUD_H); ctx.lineTo(W, HUD_H); ctx.stroke();

  const stripY = H - 30;
  ctx.fillStyle = 'rgba(8,16,54,0.88)';
  ctx.fillRect(0, stripY - 18, W, 48);
  text(ctx, 'CLICK A PRISM TO ROTATE  ·  LIGHT EVERY CRYSTAL  ·  REACH THE RECEIVER',
    W / 2, stripY + 6, 18, '#dcecff', 'center', 600);
}

function centerPanel(ctx, title, lines, accent, score) {
  ctx.fillStyle = 'rgba(10,18,60,0.38)';
  ctx.fillRect(0, 0, W, H);
  const pw = 720, ph = 350, px = (W - pw) / 2, py = (H - ph) / 2 - 10;
  ctx.save();
  ctx.shadowColor = accent; ctx.shadowBlur = 48;
  ctx.fillStyle = 'rgba(28,54,124,0.96)';
  ctx.strokeStyle = accent; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 26); ctx.fill(); ctx.stroke();
  ctx.restore();
  text(ctx, title, W / 2, py + 74, 56, accent, 'center', 800);
  lines.forEach((ln, i) => text(ctx, ln, W / 2, py + 150 + i * 38, 22,
    i === lines.length - 1 ? '#ffffff' : '#d6e6ff', 'center', i === lines.length - 1 ? 800 : 600));
  if (score !== undefined) text(ctx, String(score), W / 2, py + ph - 46, 44, '#ffffff', 'center', 800);
}

function confetti(ctx, t) {
  const cols = ['#7ff6ff', '#ffd166', '#ff87e0', '#9dffcf', '#ffffff'];
  for (let i = 0; i < 90; i++) {
    const x = (i * 97.3 + t * 0.035) % W;
    const y = (i * 61.7 + t * 0.09) % H;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(i + t * 0.003);
    ctx.fillStyle = cols[i % cols.length];
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
  }
}

function levelStrip(ctx, st) {
  const y = 480, w = 150, gap = 18;
  const total = st.levels.length * w + (st.levels.length - 1) * gap;
  let x = (W - total) / 2;
  st.levels.forEach((lv, i) => {
    const cleared = i < st.levelIndex;
    const active = i === st.levelIndex;
    ctx.save();
    ctx.shadowColor = cleared ? '#9dffcf' : (active ? '#7ff6ff' : '#8ea6d8');
    ctx.shadowBlur = cleared || active ? 20 : 6;
    ctx.fillStyle = cleared ? 'rgba(30,110,96,0.85)' : (active ? 'rgba(30,90,150,0.9)' : 'rgba(24,44,88,0.8)');
    ctx.strokeStyle = cleared ? '#9dffcf' : (active ? '#7ff6ff' : '#6f8ec0');
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, y, w, 82, 12); ctx.fill(); ctx.stroke();
    ctx.restore();
    text(ctx, 'CHAMBER ' + (i + 1), x + w / 2, y + 24, 15, '#dcecff', 'center', 700);
    text(ctx, lv.crystals.length + ' BEACONS', x + w / 2, y + 54, 17,
      cleared ? '#9dffcf' : '#ffd166', 'center', 800);
    x += w + gap;
  });
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
    centerPanel(ctx, GAME_TITLE, [
      STORY,
      'Rotate prisms. Wake every beacon. Open the gate.',
      'CLICK TO START',
    ], '#7ff6ff');
    levelStrip(ctx, st);
  } else if (st.screen === 'win') {
    confetti(ctx, t);
    centerPanel(ctx, 'THE ARCHIVE IS LIT', [
      'All four chambers cleared. Every beacon awake.',
      'CLICK OR PRESS R TO PLAY AGAIN',
    ], '#9dffcf', st.score);
    levelStrip(ctx, st);
  } else if (st.screen === 'lose') {
    centerPanel(ctx, 'OUT OF MOVES', [
      `Chamber ${st.levelIndex + 1} — ${st.level.name}`,
      'Rotate the prisms again and retry.',
    ], '#ff87e0');
  }
}
