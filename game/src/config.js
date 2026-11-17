// Palette and hand-designed, solvable levels for Prism Pulse.
// Each level is a laser maze: rotate the '/' and '\' prisms so the beam from the
// emitter threads every crystal and lands on the receiver within the move budget.
export const COLORS = {
  bg: '#070a20',
  bgDeep: '#040515',
  panel: 'rgba(16,22,58,0.92)',
  grid: 'rgba(86,120,220,0.16)',
  cyan: '#39f0ff',
  magenta: '#ff5cc8',
  gold: '#ffd166',
  violet: '#a98bff',
  green: '#5cffb1',
  white: '#eaf4ff',
  dim: '#7a88b8',
};

export const CELL = 64;
export const COLS = 9;
export const ROWS = 6;
export const BOARD_X = 96;
export const BOARD_Y = 128;

// The solve[] array is the prism orientation that completes the level.
// The starting `kind` values are the inverse, so the player must rotate them.
export const LEVELS = [
  {
    name: 'First Light',
    emitterRow: 2,
    receiver: { c: 7, r: 2 },
    prisms: [
      { c: 3, r: 2, kind: 0 },
      { c: 3, r: 4, kind: 0 },
      { c: 7, r: 4, kind: 1 },
    ],
    crystals: [ { c: 5, r: 4 } ],
    solve: [1, 1, 0],
    moves: 5,
  },
  {
    name: 'Bent Path',
    emitterRow: 4,
    receiver: { c: 8, r: 4 },
    prisms: [
      { c: 2, r: 4, kind: 1 },
      { c: 2, r: 1, kind: 1 },
      { c: 6, r: 1, kind: 0 },
      { c: 6, r: 4, kind: 0 },
    ],
    crystals: [ { c: 4, r: 1 }, { c: 7, r: 4 } ],
    solve: [0, 0, 1, 1],
    moves: 7,
  },
  {
    name: 'Twin Beam',
    emitterRow: 1,
    receiver: { c: 8, r: 4 },
    prisms: [
      { c: 1, r: 1, kind: 0 },
      { c: 1, r: 3, kind: 0 },
      { c: 4, r: 3, kind: 1 },
      { c: 4, r: 0, kind: 1 },
      { c: 8, r: 0, kind: 0 },
    ],
    crystals: [ { c: 3, r: 3 }, { c: 4, r: 1 }, { c: 7, r: 0 } ],
    solve: [1, 1, 0, 0, 1],
    moves: 10,
  },
  {
    name: 'Prism Cascade',
    emitterRow: 5,
    receiver: { c: 8, r: 1 },
    prisms: [
      { c: 1, r: 5, kind: 1 },
      { c: 1, r: 2, kind: 1 },
      { c: 4, r: 2, kind: 0 },
      { c: 4, r: 4, kind: 0 },
      { c: 7, r: 4, kind: 1 },
      { c: 7, r: 1, kind: 1 },
    ],
    crystals: [ { c: 3, r: 2 }, { c: 4, r: 3 }, { c: 6, r: 4 }, { c: 7, r: 2 } ],
    solve: [0, 0, 1, 1, 0, 0],
    moves: 13,
  },
];

export const DIRS = [ [1,0], [0,1], [-1,0], [0,-1] ]; // right, down, left, up
