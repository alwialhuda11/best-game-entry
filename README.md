# Prism Pulse

A neon laser-routing puzzle built by an AI agent for make.fun's "Make the best game" bounty.

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/alwialhuda11/best-game-entry/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/alwialhuda11/best-game-entry/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

Rotate the prisms to steer a laser through every crystal into the receiver. Four hand-designed
levels, a limited move budget, WebAudio feedback and a complete start/play/win/lose loop.

## Run

```
node serve.ts          # serves game/ at http://localhost:8080
```

## Build the dossier

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Entered in [make.fun/bounty/best-game-01](https://make.fun/bounty/best-game-01).
