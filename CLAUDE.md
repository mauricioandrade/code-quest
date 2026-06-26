# Code Quest v2.0 — Instruções para o Claude Code

## Visão geral

RPG de navegador educacional onde o jogador aprende desenvolvimento de software
batalhandocontra BUGs em Compile City. As perguntas se adaptam à stack escolhida
(Java, Python, JavaScript, Go, etc.).

- **Engine:** Phaser.js 3.x
- **Deploy:** Vercel — `git push main` atualiza automaticamente
- **Repositório:** https://github.com/SEU_USUARIO/code-quest
- **Assets:** OpenGameArt LPC (Liberated Pixel Cup) — 16x16 tiles, sprites 48x48

---

## Estrutura de pastas

```
code-quest/
├── index.html                  # Entry point — carrega Phaser e o bundle
├── package.json
├── vite.config.js              # Bundler (Vite)
├── CLAUDE.md                   # Este arquivo
├── README.md
│
├── src/
│   ├── main.js                 # Inicializa Phaser, registra cenas
│   ├── constants.js            # Constantes globais (TILE_SIZE, GAME_W, etc.)
│   │
│   ├── scenes/
│   │   ├── BootScene.js        # Carrega assets, mostra loading bar
│   │   ├── MenuScene.js        # Tela inicial com estrelas animadas
│   │   ├── CharCreateScene.js  # Criação de personagem (4 passos)
│   │   ├── MapScene.js         # Mapa 2D com tilemap, câmera, NPCs
│   │   ├── DialogueScene.js    # Diálogo com NPCs (overlay sobre MapScene)
│   │   ├── BattleScene.js      # Sistema de batalha por turnos
│   │   └── ResultScene.js      # Resultado da batalha (vitória/derrota)
│   │
│   ├── systems/
│   │   ├── AudioSystem.js      # Web Audio API — sons gerados por oscillators
│   │   ├── ParticleSystem.js   # Partículas (burst, streak, levelup)
│   │   ├── SaveSystem.js       # localStorage + futura sync com backend
│   │   └── QuestionSystem.js   # Seleciona perguntas por módulo + stack
│   │
│   ├── data/
│   │   ├── stacks.js           # STACKS, FRAMEWORKS, VISUALS
│   │   ├── districts.js        # 16 bairros de Compile City
│   │   ├── questions/
│   │   │   ├── general.js      # Perguntas gerais (todos os módulos)
│   │   │   ├── java.js         # Perguntas específicas Java
│   │   │   ├── python.js
│   │   │   ├── javascript.js
│   │   │   ├── csharp.js
│   │   │   ├── go.js
│   │   │   ├── ruby.js
│   │   │   ├── php.js
│   │   │   └── cpp.js
│   │   ├── npcs.js             # Diálogos de NPCs por bairro
│   │   └── enemies.js          # Configs dos BUGs e bosses
│   │
│   ├── entities/
│   │   ├── Player.js           # Sprite do jogador + animações de caminhada
│   │   ├── NPC.js              # Sprite de NPC + lógica de interação
│   │   └── Enemy.js            # Sprite de inimigo + comportamento especial
│   │
│   └── ui/
│       ├── HUD.js              # HUD do mapa (HP, XP, título, stack)
│       ├── DialogueBox.js      # Caixa de diálogo estilo RPG (typewriter)
│       ├── BattleUI.js         # UI de batalha (HP bars, timer, opções)
│       └── CharCreateUI.js     # UI de criação de personagem
│
└── assets/
    ├── tilemaps/
    │   ├── district-01.json    # Tilemap Tiled do Silicon District
    │   ├── district-02.json    # Code Academy
    │   └── district-03.json    # Data Harbor
    ├── tilesets/
    │   └── compile-city.png    # Tileset LPC 16x16
    ├── sprites/
    │   ├── player/
    │   │   ├── wizard-m.png    # Spritesheet mago masc. (4 dir x 3 frames, 48x48)
    │   │   ├── wizard-f.png
    │   │   ├── warrior-m.png
    │   │   └── warrior-f.png
    │   ├── npcs/
    │   │   ├── von-stack.png   # Prof. Von Stack (idle 4 frames)
    │   │   └── lady-rest.png
    │   └── enemies/
    │       ├── bug-simple.png  # BUG simples (idle 4 frames)
    │       ├── bug-mutant.png
    │       ├── null-pointer-rex.png
    │       ├── the-undefined.png
    │       └── the-deadlock.png
    ├── ui/
    │   ├── dialogue-box.png    # 9-slice da caixa de diálogo RPG
    │   ├── hp-bar.png          # Spritesheet da barra de HP pixelada
    │   └── cursor.png          # Cursor triangular animado
    └── audio/                  # Placeholder — sons gerados por Web Audio API
```

---

## Configuração Phaser (src/main.js)

```js
import Phaser from 'phaser';
import BootScene       from './scenes/BootScene.js';
import MenuScene       from './scenes/MenuScene.js';
import CharCreateScene from './scenes/CharCreateScene.js';
import MapScene        from './scenes/MapScene.js';
import DialogueScene   from './scenes/DialogueScene.js';
import BattleScene     from './scenes/BattleScene.js';
import ResultScene     from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  backgroundColor: '#0d0d1a',
  pixelArt: true,                    // desativa antialiasing — essencial para pixel art
  roundPixels: true,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [
    BootScene,
    MenuScene,
    CharCreateScene,
    MapScene,
    DialogueScene,
    BattleScene,
    ResultScene,
  ],
};

export default new Phaser.Game(config);
```

---

## GameState global (src/constants.js)

```js
// Dimensões
export const GAME_W    = 960;
export const GAME_H    = 600;
export const TILE_SIZE = 16;

// Estado global do jogo — passado entre cenas via scene.registry
export const DEFAULT_STATE = {
  // Personagem
  playerName:    'HERO',
  sprite:        'wizard-m',        // chave do spritesheet
  visualClass:   'Mago',
  stack:         'java',
  stackName:     'Java',
  stackIcon:     '☕',
  framework:     'spring-boot',
  frameworkName: 'Spring Boot',

  // Atributos
  hp: 100, maxHp: 100,
  xp: 0,   xpNext: 100,
  int: 10, def: 5, luck: 5,
  titleIndex: 0,

  // Progressão
  currentDistrict: 0,
  districtsUnlocked: [0],
  districtsDone: [],
};

export const TITLES = [
  '🟢 Estagiário',
  '🔵 Júnior',
  '🟣 Pleno',
  '🟠 Sênior',
  '🔴 Arquiteto',
];
```

---

## Cenas — especificação completa

### BootScene.js

Responsabilidade: carregar TODOS os assets antes de qualquer cena rodar.

```js
preload() {
  // Loading bar
  this.add.text(GAME_W/2, GAME_H/2 - 20, 'CARREGANDO...', { font: '16px monospace', fill: '#c4a8f5' }).setOrigin(.5);
  const bar = this.add.graphics();
  this.load.on('progress', v => {
    bar.clear();
    bar.fillStyle(0x7c5cbf).fillRect(GAME_W/2 - 200, GAME_H/2, 400 * v, 12);
  });

  // Tilesets
  this.load.image('tileset-compile-city', 'assets/tilesets/compile-city.png');

  // Tilemaps
  this.load.tilemapTiledJSON('map-01', 'assets/tilemaps/district-01.json');
  this.load.tilemapTiledJSON('map-02', 'assets/tilemaps/district-02.json');
  this.load.tilemapTiledJSON('map-03', 'assets/tilemaps/district-03.json');

  // Player spritesheets (48x48, 12 frames: 4 direções x 3 frames cada)
  ['wizard-m','wizard-f','warrior-m','warrior-f'].forEach(k =>
    this.load.spritesheet(`player-${k}`, `assets/sprites/player/${k}.png`, { frameWidth: 48, frameHeight: 48 })
  );

  // NPCs (32x48, 4 frames idle)
  this.load.spritesheet('npc-von-stack', 'assets/sprites/npcs/von-stack.png', { frameWidth: 32, frameHeight: 48 });

  // Inimigos (48x48, 4 frames idle)
  ['bug-simple','bug-mutant','null-pointer-rex','the-undefined','the-deadlock'].forEach(k =>
    this.load.spritesheet(`enemy-${k}`, `assets/sprites/enemies/${k}.png`, { frameWidth: 48, frameHeight: 48 })
  );

  // UI
  this.load.image('dialogue-box', 'assets/ui/dialogue-box.png');
  this.load.spritesheet('cursor', 'assets/ui/cursor.png', { frameWidth: 16, frameHeight: 16 });
}

create() {
  this.scene.start('MenuScene');
}
```

---

### MenuScene.js

**Visual:** fundo escuro com estrelas parallax, título "CODE QUEST" com glow roxo, sprite do personagem flutuando, botão "NOVA AVENTURA".

```js
create() {
  // Fundo estrelas (2 camadas de velocidade diferente para parallax no hover)
  this.stars = this.add.particles(0, 0, 'star-pixel', {
    quantity: 80, lifespan: Infinity,
    x: { min: 0, max: GAME_W },
    y: { min: 0, max: GAME_H },
    alpha: { min: 0.2, max: 1.0 },
    scale: { min: 0.5, max: 1.5 },
  });

  // Título com glow (RenderTexture + blur)
  this.add.text(GAME_W/2, 160, 'CODE\nQUEST', {
    fontFamily: '"Press Start 2P"',
    fontSize: 48, color: '#c4a8f5',
    align: 'center', lineSpacing: 16,
    shadow: { blur: 32, color: '#7c5cbf', fill: true },
  }).setOrigin(.5);

  this.add.text(GAME_W/2, 280, '▸ COMPILE CITY RPG ◂', {
    fontFamily: '"Press Start 2P"', fontSize: 11, color: '#1ecdb4',
  }).setOrigin(.5);

  // Sprite preview (muda conforme último personagem salvo)
  const sprite = this.registry.get('sprite') || 'wizard-m';
  this.heroSprite = this.add.sprite(GAME_W/2, 370, `player-${sprite}`)
    .play(`${sprite}-idle-down`)
    .setScale(3);

  // Tween flutuação
  this.tweens.add({
    targets: this.heroSprite, y: 360, duration: 2000,
    ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
  });

  // Botão
  this.createButton(GAME_W/2, 470, 'NOVA AVENTURA', () => {
    SFX.open();
    this.scene.start('CharCreateScene');
  });
}
```

---

### CharCreateScene.js

**Passos de criação (UI em HTML sobreposta ao Phaser via DOM):**

A CharCreateScene usa `this.add.dom()` do Phaser para renderizar a UI de seleção como HTML. Isso dá controle total sobre CSS e interatividade sem reescrever um sistema de UI em Phaser.

#### Passo 1 — Escolha sua stack

Exibe 8 cards em grid 4x2:

| Stack | Ícone | Título | Bônus |
|-------|-------|--------|-------|
| Java | ☕ | O Arquiteto | +2 INT, +3 DEF |
| Python | 🐍 | O Cientista | +4 INT, +1 LUCK |
| JavaScript | ⚡ | O Fullstack | +2 INT, +3 LUCK |
| C# | 🔷 | O Engenheiro | +2 INT, +3 DEF |
| Ruby | 💎 | O Artesão | +3 INT, +2 LUCK |
| Go | 🔵 | O Minimalista | +1 INT, +2 DEF, +2 LUCK |
| PHP | 🐘 | O Veterano Web | +1 INT, +2 DEF, +2 LUCK |
| C++ | ⚙️ | O Veterano | +3 INT, +2 DEF |

Ao selecionar uma stack, animar o card (scale up + borda teal) e revelar o Passo 2.

#### Passo 2 — Escolha seu framework

Mostrar apenas frameworks compatíveis com a stack selecionada:

```js
const STACK_FRAMEWORKS = {
  java:       ['spring-boot', 'quarkus'],
  python:     ['django', 'flask', 'fastapi'],
  javascript: ['nestjs', 'express'],
  csharp:     ['aspnet'],
  ruby:       ['rails'],
  go:         ['gin'],
  php:        ['laravel', 'symfony'],
  cpp:        [],   // sem framework → pular passo
};
```

#### Passo 3 — Escolha seu visual

4 opções com preview em Phaser (sprite real animado):

| ID | Sprite | Classe | Bônus |
|----|--------|--------|-------|
| wizard-m | 🧙‍♂️ | Mago | +3 INT |
| wizard-f | 🧙‍♀️ | Maga | +3 INT |
| warrior-m | 🧝‍♂️ | Guerreiro | +3 DEF |
| warrior-f | 🧝‍♀️ | Guerreira | +3 DEF |

Ao clicar num visual, renderizar o sprite real animado no centro da tela Phaser
(não emoji — sprite real do spritesheet).

#### Passo 4 — Nome do personagem

Input de texto (DOM) + preview card com sprite + atributos calculados em tempo real:

```
HP:   100
INT:  10 + stack.bonus.int + visual.bonus.int
DEF:  5  + stack.bonus.def + visual.bonus.def
LUCK: 5  + stack.bonus.luck
```

Ao confirmar: salvar no `this.registry` e iniciar MapScene.

#### Animações de transição entre passos

```js
// Saída do passo atual
this.tweens.add({ targets: currentStep, alpha: 0, x: '-=40', duration: 200,
  onComplete: () => { currentStep.setVisible(false); showStep(next); } });

// Entrada do próximo passo
nextStep.setAlpha(0).setX(nextStep.x + 40).setVisible(true);
this.tweens.add({ targets: nextStep, alpha: 1, x: '-=40', duration: 200 });
```

---

### MapScene.js

**Motor de mapa 2D com Phaser Tilemaps.**

```js
create() {
  const did = this.registry.get('currentDistrict') || 0;

  // Tilemap (criado no Tiled, exportado como JSON)
  const map = this.make.tilemap({ key: `map-0${did + 1}` });
  const tileset = map.addTilesetImage('compile-city', 'tileset-compile-city');

  // Camadas (definidas no Tiled)
  this.groundLayer     = map.createLayer('Ground',     tileset, 0, 0);
  this.decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
  this.collisionLayer  = map.createLayer('Collision',  tileset, 0, 0);
  this.aboveLayer      = map.createLayer('Above',      tileset, 0, 0); // renderiza acima do player

  // Colisão pelo tile property "collides" no Tiled
  this.collisionLayer.setCollisionByProperty({ collides: true });

  // Player
  const spawn = map.findObject('Objects', o => o.name === 'PlayerSpawn');
  this.player = new Player(this, spawn.x, spawn.y);
  this.physics.add.collider(this.player.sprite, this.collisionLayer);

  // NPCs (posições definidas no Tiled como Object Layer)
  this.npcs = map.getObjectLayer('NPCs').objects.map(obj =>
    new NPC(this, obj.x, obj.y, obj.properties)
  );

  // Inimigos
  this.enemies = map.getObjectLayer('Enemies').objects.map(obj =>
    new Enemy(this, obj.x, obj.y, obj.properties)
  );

  // Câmera
  this.cameras.main
    .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    .startFollow(this.player.sprite, true, 0.08, 0.08); // lerp suave

  // Renderiza "Above" layer por cima do player
  this.aboveLayer.setDepth(10);
  this.player.sprite.setDepth(5);

  // HUD (overlay de UI)
  this.scene.launch('HUDScene');

  // Input
  this.cursors  = this.input.keyboard.createCursorKeys();
  this.wasd     = this.input.keyboard.addKeys('W,A,S,D');
  this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Música ambiente
  AudioSystem.startAmbient();
}

update() {
  this.player.update(this.cursors, this.wasd);
  this.checkInteraction();
}

checkInteraction() {
  if (!Phaser.Input.Keyboard.JustDown(this.spaceKey)) return;
  const near = this.findNearEntity();
  if (!near) return;

  AudioSystem.play('open');
  this.scene.pause('MapScene');
  this.scene.launch('DialogueScene', { entity: near, districtId: this.currentDistrict });
}
```

#### Player.js (entities/Player.js)

```js
export default class Player {
  constructor(scene, x, y) {
    const sprite = scene.registry.get('sprite') || 'wizard-m';
    this.sprite = scene.physics.add.sprite(x, y, `player-${sprite}`)
      .setScale(2)
      .setDepth(5);
    this.facing = 'down';
    this.createAnims(scene, sprite);
  }

  createAnims(scene, sprite) {
    // Spritesheet layout: linha 0=baixo, 1=esq, 2=dir, 3=cima; 3 frames por linha
    const dirs = ['down','left','right','up'];
    dirs.forEach((dir, row) => {
      ['walk','idle'].forEach((type, col) => {
        scene.anims.create({
          key: `${sprite}-${type}-${dir}`,
          frames: scene.anims.generateFrameNumbers(`player-${sprite}`, {
            start: row * 3 + (type === 'idle' ? 1 : 0),
            end:   row * 3 + (type === 'idle' ? 1 : 2),
          }),
          frameRate: type === 'walk' ? 8 : 2,
          repeat: -1,
        });
      });
    });
  }

  update(cursors, wasd) {
    const speed = 80;
    let vx = 0, vy = 0;
    const sprite = this.scene?.registry.get('sprite') || 'wizard-m';

    if (cursors.left.isDown  || wasd.A.isDown) { vx = -speed; this.facing = 'left';  }
    if (cursors.right.isDown || wasd.D.isDown) { vx =  speed; this.facing = 'right'; }
    if (cursors.up.isDown    || wasd.W.isDown) { vy = -speed; this.facing = 'up';    }
    if (cursors.down.isDown  || wasd.S.isDown) { vy =  speed; this.facing = 'down';  }

    this.sprite.setVelocity(vx, vy);
    const anim = (vx || vy) ? `${sprite}-walk-${this.facing}` : `${sprite}-idle-${this.facing}`;
    if (this.sprite.anims.currentAnim?.key !== anim) this.sprite.play(anim);
  }
}
```

---

### DialogueScene.js

Roda como overlay paralela à MapScene (não substitui — apenas pausa o mapa).

```js
init(data) {
  this.entity     = data.entity;
  this.districtId = data.districtId;
  this.step       = 0;
}

create() {
  // Fundo semi-transparente
  this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000, 0.65).setOrigin(0);

  // Caixa de diálogo (9-slice para bordas RPG)
  this.dialogueBox = this.add.nineslice(
    GAME_W/2, GAME_H - 120, 'dialogue-box',
    null, GAME_W - 80, 180, 16, 16, 16, 16
  );

  // Avatar do NPC
  this.avatar = this.add.sprite(80, GAME_H - 120, `npc-${this.entity.spriteKey}`)
    .play(`${this.entity.spriteKey}-idle`)
    .setScale(2);

  // Nome do NPC
  this.nameText = this.add.text(130, GAME_H - 195, '', {
    fontFamily: '"Press Start 2P"', fontSize: 11, color: '#c4a8f5',
  });

  // Texto do diálogo (typewriter)
  this.dialogueText = this.add.text(130, GAME_H - 170, '', {
    fontFamily: '"Noto Sans JP"', fontSize: 14, color: '#f0eeff',
    wordWrap: { width: GAME_W - 200 }, lineSpacing: 6,
  });

  // Cursor "aperte espaço"
  this.cursor = this.add.sprite(GAME_W - 60, GAME_H - 50, 'cursor')
    .play('cursor-blink');

  // Input
  this.input.keyboard.on('keydown-SPACE', () => this.advance());
  this.input.keyboard.on('keydown-ENTER', () => this.advance());

  this.showStep(0);
}

showStep(i) {
  const steps  = DIALOGUES[this.entity.id] || [];
  const step   = steps[i];
  if (!step) return;

  this.nameText.setText(this.entity.name);
  this.typewriterEffect(step.text, () => {
    this.cursor.setVisible(true);
  });

  // Botões de ação (Batalhar / Continuar / Sair)
  this.renderActions(step.actions);
}

typewriterEffect(text, onComplete) {
  this.cursor.setVisible(false);
  this.dialogueText.setText('');
  let i = 0;
  this.twTimer = this.time.addEvent({
    delay: 28, repeat: text.length - 1,
    callback: () => {
      this.dialogueText.setText(text.slice(0, ++i));
      if (i % 2 === 0) AudioSystem.play('text-blip');
      if (i === text.length) onComplete?.();
    }
  });
}

advance() {
  // Se ainda digitando, pular para o fim
  if (this.twTimer?.getProgress() < 1) {
    this.twTimer.remove();
    const step = DIALOGUES[this.entity.id]?.[this.step];
    this.dialogueText.setText(step?.text || '');
    this.cursor.setVisible(true);
    return;
  }
  this.step++;
  const steps = DIALOGUES[this.entity.id] || [];
  if (this.step < steps.length) this.showStep(this.step);
  else this.closeDialogue();
}

closeDialogue() {
  this.scene.stop('DialogueScene');
  this.scene.resume('MapScene');
}

startBattle() {
  AudioSystem.stopAmbient();
  this.scene.stop('DialogueScene');
  this.scene.stop('MapScene');
  this.scene.start('BattleScene', {
    districtId: this.districtId,
    enemyId:    this.entity.enemyId,
  });
}
```

---

### BattleScene.js

#### Layout visual da batalha

```
┌─────────────────────────────────────────────────────────┐
│  [BACKGROUND — parallax 2 camadas, estilo RPG]          │
│                                                         │
│   PLAYER SIDE          VS         ENEMY SIDE            │
│  ┌───────────────┐          ┌───────────────┐           │
│  │ 🧙‍♂️ sprite   │          │ 🐛 sprite     │           │
│  │   animado     │          │   animado     │           │
│  │ HP ████░░░░   │          │ HP ████████   │           │
│  │ STREAK 🔥x3   │          │ [Boss power]  │           │
│  └───────────────┘          └───────────────┘           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ [MÓDULO 01] [☕ Java]                      [28s]  │  │
│  │                                                   │  │
│  │ O que o JIT compiler faz na JVM?                 │  │
│  │                                                   │  │
│  │  [A. Compila para bytecode   ]  [B. Compila...] │  │
│  │  [C. Gerencia o Heap         ]  [D. Executa GC ] │  │
│  │                                                   │  │
│  │ ✓ Correto! 🔥 STREAK x3 — DANO DOBRADO!          │  │
│  │                                          [PRÓX ▶] │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Animações de batalha

```js
// Player ataca (acerto)
attackAnimation(attacker, target, onImpact) {
  const originalX = attacker.x;
  this.tweens.add({
    targets: attacker, x: attacker.x + (attacker === this.playerSprite ? 120 : -120),
    duration: 180, ease: 'Power2',
    onComplete: () => {
      onImpact();
      this.tweens.add({ targets: attacker, x: originalX, duration: 180, ease: 'Power2' });
    }
  });
}

// Inimigo toma dano
hitAnimation(target) {
  this.tweens.add({
    targets: target, alpha: 0.2,
    duration: 50, yoyo: true, repeat: 3,
  });
  this.cameras.main.shake(150, 0.005);
}

// Partículas no impacto
spawnHitParticles(x, y, color) {
  const emitter = this.add.particles(x, y, 'pixel', {
    speed: { min: 80, max: 200 },
    angle: { min: 0, max: 360 },
    scale: { start: 1.5, end: 0 },
    tint: color,
    lifespan: 600,
    quantity: 20,
    emitting: false,
  });
  emitter.explode(20);
  this.time.delayedCall(800, () => emitter.destroy());
}
```

#### Comportamentos especiais dos bosses

```js
// Boss behaviors — executados após cada resposta
BOSS_BEHAVIORS = {
  'null-pointer-rex': {
    // Após 2 erros do jogador: remove uma opção errada (irônico)
    onPlayerError(battle) {
      battle.playerErrors = (battle.playerErrors || 0) + 1;
      if (battle.playerErrors % 2 === 0) {
        this.removeOneWrongOption();
        this.showBossMessage('NullPointer Rex sorri: "Deixa eu te dar uma dica... pelo preço de HP!"');
      }
    },
  },
  'the-undefined': {
    // A cada acerto do jogador: próximo timer -5s
    onPlayerHit(battle) {
      battle.timerPenalty = (battle.timerPenalty || 0) + 5;
      this.showBossMessage('The Undefined grita: "Você está ficando sem tempo!"');
    },
  },
  'the-deadlock': {
    // Após acerto: congela timer por 3s (suspense)
    onPlayerHit(battle) {
      this.freezeTimer(3000);
      this.showBossMessage('The Deadlock bloqueia o tempo...');
    },
  },
};
```

---

### ResultScene.js

Exibe após batalha:
- ⭐ Vitória / 💀 Derrota (emoji animado com scale pop)
- Stats: acertos / total / max streak
- XP ganho (barra animada)
- Se level up: fanfarra + banner dourado + partículas
- Botões: "Continuar" → volta ao mapa | "Tentar de novo" (se derrota)

---

## Sistema de áudio (systems/AudioSystem.js)

```js
// TODOS os sons são gerados por Web Audio API — zero arquivos externos
const ctx = new (window.AudioContext || window.webkitAudioContext)();

export const AudioSystem = {
  muted: false,

  play(sfx) {
    if (this.muted) return;
    SFX_MAP[sfx]?.();
  },

  startAmbient() { /* loop generativo de notas */ },
  stopAmbient()  { /* cancela o loop */           },
  toggleMute()   { this.muted = !this.muted;       },
};

// Sons disponíveis:
// 'hit', 'miss', 'attack', 'enemy-attack', 'streak',
// 'level-up', 'victory', 'defeat', 'select', 'open', 'text-blip'
```

---

## Sistema de perguntas (systems/QuestionSystem.js)

```js
export function getQuestionsForBattle(districtId, playerStack, count = 5) {
  const general = QUESTIONS.general[`module_${districtId + 1}`] || [];
  const specific = QUESTIONS[playerStack]?.[`module_${districtId + 1}`] || [];

  // Mistura 60% geral + 40% específica (mínimo 1 específica se disponível)
  let pool = [...general];
  if (specific.length) pool = [...general, ...specific];

  return shuffle(pool).slice(0, count);
}

// Formato de pergunta:
// {
//   q:          'Texto da pergunta',
//   opts:       ['A', 'B', 'C', 'D'],
//   correct:    1,
//   explain:    'Explicação após responder',
//   difficulty: 'normal' | 'hard',
//   stack:      'java',   // opcional — só específicas
//   module:     1,        // número do módulo
// }
```

### Meta de perguntas

| Módulo | Gerais | Por stack (×8) | Total |
|--------|--------|----------------|-------|
| 01 — Fundamentos | 15 | 10 cada | 95 |
| 02 — Linguagens  | 15 | 10 cada | 95 |
| 03 — SQL / BD    | 15 | 5 cada  | 55 |
| Total v1         | 45 | —       | 245 |

---

## Dados — Stacks (data/stacks.js)

```js
export const STACKS = [
  { id:'java',       icon:'☕', name:'Java',       title:'O Arquiteto',    bonus:{int:2,def:3,luck:0}, frameworks:['spring-boot','quarkus'] },
  { id:'python',     icon:'🐍', name:'Python',     title:'O Cientista',    bonus:{int:4,def:0,luck:1}, frameworks:['django','flask','fastapi'] },
  { id:'javascript', icon:'⚡', name:'JavaScript', title:'O Fullstack',    bonus:{int:2,def:0,luck:3}, frameworks:['nestjs','express'] },
  { id:'csharp',     icon:'🔷', name:'C#',         title:'O Engenheiro',   bonus:{int:2,def:3,luck:0}, frameworks:['aspnet'] },
  { id:'ruby',       icon:'💎', name:'Ruby',       title:'O Artesão',      bonus:{int:3,def:0,luck:2}, frameworks:['rails'] },
  { id:'go',         icon:'🔵', name:'Go',         title:'O Minimalista',  bonus:{int:1,def:2,luck:2}, frameworks:['gin'] },
  { id:'php',        icon:'🐘', name:'PHP',        title:'O Veterano Web', bonus:{int:1,def:2,luck:2}, frameworks:['laravel','symfony'] },
  { id:'cpp',        icon:'⚙️', name:'C++',        title:'O Veterano',     bonus:{int:3,def:2,luck:0}, frameworks:[] },
];

export const FRAMEWORKS = {
  'spring-boot': { icon:'🍃', name:'Spring Boot',   stack:'java'       },
  'quarkus':     { icon:'⚡', name:'Quarkus',       stack:'java'       },
  'django':      { icon:'🎸', name:'Django',        stack:'python'     },
  'flask':       { icon:'🧪', name:'Flask',         stack:'python'     },
  'fastapi':     { icon:'🚀', name:'FastAPI',       stack:'python'     },
  'nestjs':      { icon:'🐱', name:'NestJS',        stack:'javascript' },
  'express':     { icon:'📦', name:'Express',       stack:'javascript' },
  'aspnet':      { icon:'🔷', name:'ASP.NET',       stack:'csharp'     },
  'rails':       { icon:'💎', name:'Ruby on Rails', stack:'ruby'       },
  'gin':         { icon:'🍸', name:'Gin',           stack:'go'         },
  'laravel':     { icon:'🔴', name:'Laravel',       stack:'php'        },
  'symfony':     { icon:'🟤', name:'Symfony',       stack:'php'        },
};

export const VISUALS = {
  'wizard-m':  { label:'Mago',      class:'Mago',      bonus:{int:3,def:0} },
  'wizard-f':  { label:'Maga',      class:'Maga',      bonus:{int:3,def:0} },
  'warrior-m': { label:'Guerreiro', class:'Guerreiro', bonus:{int:0,def:3} },
  'warrior-f': { label:'Guerreira', class:'Guerreira', bonus:{int:0,def:3} },
};
```

---

## Dados — Bairros (data/districts.js)

```js
export const DISTRICTS = [
  { id:0,  name:'Silicon District',   module:1,  theme:'Fundamentos',           boss:'NullPointer Rex',    bossKey:'null-pointer-rex', emoji:'🐛' },
  { id:1,  name:'Code Academy',       module:2,  theme:'Linguagens',            boss:'The Undefined',      bossKey:'the-undefined',    emoji:'👾' },
  { id:2,  name:'Data Harbor',        module:3,  theme:'SQL & BD',              boss:'The Deadlock',       bossKey:'the-deadlock',     emoji:'🦑' },
  { id:3,  name:'Git Gate',           module:4,  theme:'Versionamento',         boss:'Merge Conflict Hydra',bossKey:'merge-hydra',     emoji:'🐉' },
  { id:4,  name:'Net District',       module:5,  theme:'Redes',                 boss:'The 404 Specter',    bossKey:'404-specter',      emoji:'👻' },
  { id:5,  name:'Web Front',          module:6,  theme:'Web & Segurança',       boss:'CORS Daemon',        bossKey:'cors-daemon',      emoji:'😈' },
  { id:6,  name:'API Plaza',          module:7,  theme:'APIs REST',             boss:'Rate Limit Titan',   bossKey:'rate-titan',       emoji:'🤖' },
  { id:7,  name:'Framework Towers',   module:8,  theme:'MVC & Frameworks',      boss:'The Spaghetti Monster',bossKey:'spaghetti',      emoji:'🍝' },
  { id:8,  name:'Container Port',     module:9,  theme:'Docker',                boss:'Image Not Found',    bossKey:'image-not-found',  emoji:'🐳' },
  { id:9,  name:'NoSQL Jungle',       module:10, theme:'Bancos NoSQL',          boss:'Schema Dragon',      bossKey:'schema-dragon',    emoji:'🐲' },
  { id:10, name:'Clean Hills',        module:11, theme:'Clean Code',            boss:'The Code Smell',     bossKey:'code-smell',       emoji:'🦨' },
  { id:11, name:'Test Lab',           module:12, theme:'Testes',                boss:'The Flakey Test',    bossKey:'flakey-test',      emoji:'🧪' },
  { id:12, name:'Pattern Palace',     module:13, theme:'Design Patterns',       boss:'The Anti-Pattern',   bossKey:'anti-pattern',     emoji:'🎭' },
  { id:13, name:'Performance Peak',   module:14, theme:'Otimização',            boss:'Memory Leak Demon',  bossKey:'memory-leak',      emoji:'🧟' },
  { id:14, name:'Cloud Summit',       module:15, theme:'Cloud & CI/CD',         boss:'The Outage',         bossKey:'the-outage',       emoji:'⛈️' },
  { id:15, name:"Architect's Citadel",module:16, theme:'Arquitetura & DDD',     boss:'The Legacy Monolith',bossKey:'legacy-monolith',  emoji:'🗿' },
];
```

---

## Setup inicial (package.json + vite.config.js)

```json
// package.json
{
  "name": "code-quest",
  "version": "2.0.0",
  "scripts": {
    "dev":   "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "phaser": "^3.70.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

```js
// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { outDir: 'dist' },
  server: { port: 3000 },
});
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Quest</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#0d0d1a; display:flex; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
    #game-container canvas { display:block; }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

## Fluxo de cenas

```
BootScene (carrega assets)
    ↓
MenuScene (tela inicial)
    ↓
CharCreateScene (4 passos: stack → framework → visual → nome)
    ↓
MapScene ←──────────────────────────────────────┐
    ↓ (ESPAÇO perto de NPC/BUG)                 │
DialogueScene (overlay paralela)                │
    ↓ (escolhe "Batalhar")                      │
BattleScene                                     │
    ↓                                           │
ResultScene ────────────────────────────────────┘
```

---

## Assets — onde obter

Todos gratuitos e livres para uso:

| Asset | Fonte | URL |
|-------|-------|-----|
| Tileset LPC | OpenGameArt | opengameart.org/content/lpc-tile-atlas |
| Sprites de personagem | LPC Character | opengameart.org/content/lpc-characters |
| NPCs | LPC NPC | opengameart.org/content/lpc-npcs |
| Caixa de diálogo | OpenGameArt | opengameart.org/content/rpg-gui |
| Inimigos | Monster Pack | opengameart.org/content/monster-pack |

**Tamanhos esperados:**
- Tiles: 16x16 px
- Player sprites: 48x48 px, 12 frames (4 dir x 3 frames)
- NPC sprites: 32x48 px, 4 frames idle
- Enemy sprites: 48x48 px, 4 frames idle + 4 frames attack

---

## Convenções de commit

```
feat: descrição
fix: descrição
docs: descrição
chore: descrição
```

Commits separados por camada:
```bash
git commit -m "feat(scenes): implement CharCreateScene with 4-step flow"
git commit -m "feat(entities): Player spritesheet animation system"
git commit -m "feat(battle): boss unique behaviors (NullPointer, Deadlock)"
git commit -m "feat(data): expand question bank to 15 per stack per module"
```

---

## O que NÃO fazer

- ❌ Não usar `alert()` ou `confirm()`
- ❌ Não adicionar dependências além de Phaser e Vite
- ❌ Não colocar lógica de jogo dentro das cenas — usar sistemas (systems/)
- ❌ Não hardcodar texto de diálogo dentro das cenas — usar data/npcs.js
- ❌ Não alterar o formato das perguntas em data/questions/
- ❌ Não alterar STACKS ou FRAMEWORKS em data/stacks.js sem atualizar os tipos
- ❌ Não usar `scene.start()` para diálogo — usar `scene.launch()` (roda em paralelo)
- ❌ Não esquecer `pixelArt: true` na config do Phaser — sem isso sprites ficam borrados

---

## Testando localmente

```bash
npm install
npm run dev
# abre http://localhost:3000
```

Deploy (Vercel detecta Vite automaticamente):
```bash
npm run build   # gera dist/
git add .
git commit -m "feat: ..."
git push origin main
# Vercel faz deploy do dist/ automaticamente
```
