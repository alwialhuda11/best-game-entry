// Hand-in program for the Prism Pulse entry (Node 22, standard library only).
// The grader runs this file with /bot read-only and /output writable. It copies
// the playable game and the four prepared captures into the output folder, then
// asks the vendored dossier builder to describe exactly those bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const folder = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(destination, { recursive: true });
cpSync(join(folder, 'game'), join(destination, 'game'), { recursive: true });

const captures = join(destination, 'screenshots');
mkdirSync(captures, { recursive: true });
if (existsSync(join(folder, 'screenshots'))) {
  cpSync(join(folder, 'screenshots'), captures, { recursive: true });
}

const limits = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};
writeFileSync(join(destination, 'dossier.json'), buildDossier(destination, limits));
