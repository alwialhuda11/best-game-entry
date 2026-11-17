// Game state machine: levels, moves, scoring, input and screenshot modes.
import { LEVELS } from './config.js';
import { traceBeam } from './beam.js';
import { Sound } from './audio.js';

export function makeGame() {
  const st = {
    levels: LEVELS,
    levelIndex: 0,
    level: LEVELS[0],
    prisms: [],
    movesLeft: 0,
    score: 0,
    taken: new Set(),
    totalCrystals: 0,
    screen: 'start',
    selected: null,
    beam: null,
    levelLit: false,
  };

  function loadLevel(i) {
    st.levelIndex = i;
    st.level = st.levels[i];
    st.prisms = st.level.prisms.map(p => ({ c: p.c, r: p.r, kind: p.kind }));
    st.movesLeft = st.level.moves;
    st.taken = new Set();
    st.totalCrystals = st.level.crystals.length;
    st.selected = null;
    st.levelLit = false;
    refresh();
  }

  function refresh() {
    st.beam = traceBeam(st.level, st.prisms);
    for (const idx of st.beam.hitCrystals) {
      if (!st.taken.has(idx)) {
        st.taken.add(idx);
        st.score += 100;
        Sound.crystal();
      }
    }
    if (st.beam.hitReceiver && !st.levelLit && !st.frozen) {
      st.levelLit = true;
      st.score += 250 + st.movesLeft * 20;
      Sound.levelWin();
      setTimeout(() => {
        if (st.levelIndex + 1 < st.levels.length) loadLevel(st.levelIndex + 1);
        else { st.screen = 'win'; Sound.win(); }
      }, 480);
    }
  }

  function click(x, y) {
    if (st.screen !== 'play') { startOrRestart(); return; }
    const { CELL, COLS, ROWS, BOARD_X, BOARD_Y } = gameConst;
    const c = Math.floor((x - BOARD_X) / CELL);
    const r = Math.floor((y - BOARD_Y) / CELL);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
    const p = st.prisms.find(q => q.c === c && q.r === r);
    if (!p || st.levelLit) return;
    p.kind = p.kind === 0 ? 1 : 0;
    st.selected = p;
    st.movesLeft--;
    Sound.rotate();
    refresh();
    if (!st.levelLit && st.movesLeft <= 0 && st.taken.size < st.totalCrystals) {
      st.screen = 'lose'; Sound.lose();
    }
  }

  function startOrRestart() {
    if (st.screen === 'win') { st.score = 0; loadLevel(0); st.screen = 'play'; }
    else if (st.screen === 'lose') { loadLevel(st.levelIndex); st.screen = 'play'; }
    else if (st.screen === 'start') { loadLevel(0); st.screen = 'play'; }
    Sound.click();
  }

  st.loadLevel = loadLevel;
  st.refresh = refresh;
  st.click = click;
  st.startOrRestart = startOrRestart;

  // Deterministic screenshot states: no timers, no audio, fixed board.
  function shot(name) {
    Sound.toggle(); // ensure silent for captures
    st.frozen = true;
    if (name === 'start') { loadLevel(0); st.screen = 'start'; }
    else if (name === 'play') {
      // Level 1 in its solved state: one clean, fully connected beam, one lit
      // crystal and a glowing receiver — the clearest possible "aha" frame.
      loadLevel(0); st.screen = 'play';
      st.prisms.forEach((p, i) => { p.kind = st.level.solve[i]; });
      st.selected = st.prisms[0]; refresh();
      st.movesLeft = 2; st.score = 1350;
    } else if (name === 'win') {
      loadLevel(3); st.screen = 'win'; st.score = 4250;
      st.prisms.forEach((p, i) => { p.kind = st.level.solve[i]; });
      st.taken = new Set(st.level.crystals.map((_, i) => i)); refresh();
    } else if (name === 'lose') {
      loadLevel(1); st.screen = 'lose'; st.movesLeft = 0; st.score = 600;
    }
    st.beam = traceBeam(st.level, st.prisms);
  }
  st.shot = shot;

  loadLevel(0);
  return st;
}

import { CELL, COLS, ROWS, BOARD_X, BOARD_Y } from './config.js';
const gameConst = { CELL, COLS, ROWS, BOARD_X, BOARD_Y };
