import Phaser from 'phaser';
import { GAME_W, GAME_H, DEFAULT_STATE } from '../constants.js';
import { STACKS, FRAMEWORKS, VISUALS } from '../data/stacks.js';
import { AudioSystem } from '../systems/AudioSystem.js';

export default class CharCreateScene extends Phaser.Scene {
  constructor() { super('CharCreateScene'); }

  create() {
    this.currentStep = 0;
    this.choices = {
      stack: null, framework: null, visual: null, name: 'HERO',
    };

    // Fundo
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x0d0d1a).setOrigin(0);

    this.add.text(GAME_W / 2, 30, 'CRIAR PERSONAGEM', {
      fontFamily: '"Press Start 2P"', fontSize: 12, color: '#c4a8f5',
    }).setOrigin(0.5);

    // Indicador de passo
    this.stepIndicator = this.add.text(GAME_W / 2, 52, 'PASSO 1 / 4', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#555577',
    }).setOrigin(0.5);

    this.containers = [];
    this.buildStep1();
    this.buildStep2();
    this.buildStep3();
    this.buildStep4();

    this.showStep(0);
  }

  // ── Passo 1: Stack ────────────────────────────────────────────
  buildStep1() {
    const c = this.add.container(0, 0);
    this.containers.push(c);

    c.add(this.make.text({ x: GAME_W / 2, y: 88, text: 'Escolha sua Stack', style: {
      fontFamily: '"Press Start 2P"', fontSize: 11, color: '#1ecdb4',
      origin: { x: 0.5, y: 0.5 },
    }}));

    const cols = 4, rows = 2;
    const cardW = 180, cardH = 110, gapX = 20, gapY = 16;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const startX = (GAME_W - totalW) / 2;
    const startY = 118;

    STACKS.forEach((s, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX);
      const cy = startY + row * (cardH + gapY);

      const bg = this.add.rectangle(cx + cardW / 2, cy + cardH / 2, cardW, cardH, 0x1a1a3e)
        .setStrokeStyle(2, 0x333366)
        .setInteractive({ useHandCursor: true });

      const icon = this.add.text(cx + cardW / 2, cy + 22, s.icon, { fontSize: 22 }).setOrigin(0.5);
      const name = this.add.text(cx + cardW / 2, cy + 52, s.name, {
        fontFamily: '"Press Start 2P"', fontSize: 9, color: '#c4a8f5',
      }).setOrigin(0.5);
      const title = this.add.text(cx + cardW / 2, cy + 70, s.title, {
        fontFamily: '"Press Start 2P"', fontSize: 7, color: '#888899',
      }).setOrigin(0.5);
      const bonus = this.add.text(cx + cardW / 2, cy + 90, this.bonusStr(s.bonus), {
        fontFamily: '"Press Start 2P"', fontSize: 7, color: '#1ecdb4',
      }).setOrigin(0.5);

      bg.on('pointerover',  () => bg.setStrokeStyle(2, 0x1ecdb4));
      bg.on('pointerout',   () => {
        if (this.choices.stack !== s.id) bg.setStrokeStyle(2, 0x333366);
      });
      bg.on('pointerdown', () => {
        this.choices.stack = s.id;
        this.choices.stackObj = s;
        AudioSystem.play('select');
        // Reset borders
        this.containers[0].each(obj => {
          if (obj instanceof Phaser.GameObjects.Rectangle) obj.setStrokeStyle(2, 0x333366);
        });
        bg.setStrokeStyle(2, 0x1ecdb4);
        this.tweens.add({ targets: bg, scaleX: 1.05, scaleY: 1.05, duration: 100, yoyo: true });
        this.time.delayedCall(200, () => this.advanceStep());
      });

      c.add([bg, icon, name, title, bonus]);
    });
  }

  bonusStr(b) {
    const parts = [];
    if (b.int)  parts.push(`+${b.int} INT`);
    if (b.def)  parts.push(`+${b.def} DEF`);
    if (b.luck) parts.push(`+${b.luck} LUCK`);
    return parts.join('  ');
  }

  // ── Passo 2: Framework ────────────────────────────────────────
  buildStep2() {
    const c = this.add.container(0, 0);
    this.containers.push(c);
    // Construído dinamicamente em showStep(1)
  }

  renderFrameworks() {
    const c = this.containers[1];
    c.removeAll(true);

    const s = this.choices.stackObj;
    if (!s) return;

    const fws = s.frameworks.map(id => FRAMEWORKS[id]).filter(Boolean);

    if (fws.length === 0) {
      // C++ — sem framework, pula
      this.choices.framework = null;
      this.choices.frameworkName = 'Nenhum';
      this.advanceStep();
      return;
    }

    c.add(this.makeText(GAME_W / 2, 88, 'Escolha seu Framework', 11, '#1ecdb4', true));

    const cardW = 200, cardH = 120, gap = 24;
    const totalW = fws.length * cardW + (fws.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const y = 200;

    fws.forEach((fw, i) => {
      const cx = startX + i * (cardW + gap);

      const bg = this.add.rectangle(cx + cardW / 2, y + cardH / 2, cardW, cardH, 0x1a1a3e)
        .setStrokeStyle(2, 0x333366)
        .setInteractive({ useHandCursor: true });

      const icon = this.add.text(cx + cardW / 2, y + 28, fw.icon, { fontSize: 26 }).setOrigin(0.5);
      const name = this.add.text(cx + cardW / 2, y + 66, fw.name, {
        fontFamily: '"Press Start 2P"', fontSize: 9, color: '#c4a8f5',
      }).setOrigin(0.5);

      bg.on('pointerover',  () => bg.setStrokeStyle(2, 0x1ecdb4));
      bg.on('pointerout',   () => {
        if (this.choices.framework !== fw.id) bg.setStrokeStyle(2, 0x333366);
      });
      bg.on('pointerdown', () => {
        this.choices.framework = fw.id;
        this.choices.frameworkName = fw.name;
        AudioSystem.play('select');
        this.tweens.add({ targets: bg, scaleX: 1.05, scaleY: 1.05, duration: 100, yoyo: true });
        this.time.delayedCall(200, () => this.advanceStep());
      });

      c.add([bg, icon, name]);
    });
  }

  // ── Passo 3: Visual ───────────────────────────────────────────
  buildStep3() {
    const c = this.add.container(0, 0);
    this.containers.push(c);

    c.add(this.makeText(GAME_W / 2, 88, 'Escolha seu Visual', 11, '#1ecdb4', true));

    const visuals = Object.entries(VISUALS);
    const cardW = 160, cardH = 180, gap = 24;
    const totalW = visuals.length * cardW + (visuals.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const y = 118;

    visuals.forEach(([id, v], i) => {
      const cx = startX + i * (cardW + gap);

      const bg = this.add.rectangle(cx + cardW / 2, y + cardH / 2, cardW, cardH, 0x1a1a3e)
        .setStrokeStyle(2, 0x333366)
        .setInteractive({ useHandCursor: true });

      // Sprite real animado
      const sprite = this.add.sprite(cx + cardW / 2, y + 70, `player-${id}`).setScale(3);
      if (!this.anims.exists(`${id}-idle-down`)) {
        this.anims.create({
          key: `${id}-idle-down`,
          frames: this.anims.generateFrameNumbers(`player-${id}`, { start: 1, end: 1 }),
          frameRate: 2, repeat: -1,
        });
      }
      sprite.play(`${id}-idle-down`);

      const label = this.add.text(cx + cardW / 2, y + 130, v.label, {
        fontFamily: '"Press Start 2P"', fontSize: 9, color: '#c4a8f5',
      }).setOrigin(0.5);
      const bonus = this.add.text(cx + cardW / 2, y + 152, this.bonusStr(v.bonus), {
        fontFamily: '"Press Start 2P"', fontSize: 7, color: '#1ecdb4',
      }).setOrigin(0.5);

      bg.on('pointerover',  () => bg.setStrokeStyle(2, 0x1ecdb4));
      bg.on('pointerout',   () => {
        if (this.choices.visual !== id) bg.setStrokeStyle(2, 0x333366);
      });
      bg.on('pointerdown', () => {
        this.choices.visual = id;
        this.choices.visualObj = v;
        AudioSystem.play('select');
        this.tweens.add({ targets: bg, scaleX: 1.05, scaleY: 1.05, duration: 100, yoyo: true });
        this.time.delayedCall(200, () => this.advanceStep());
      });

      c.add([bg, sprite, label, bonus]);
    });
  }

  // ── Passo 4: Nome ─────────────────────────────────────────────
  buildStep4() {
    const c = this.add.container(0, 0);
    this.containers.push(c);

    c.add(this.makeText(GAME_W / 2, 88, 'Nome do Personagem', 11, '#1ecdb4', true));

    // Input via DOM
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.maxLength = 12;
    inputEl.placeholder = 'HERO';
    inputEl.style.cssText = `
      font-family: "Press Start 2P", monospace;
      font-size: 16px;
      color: #c4a8f5;
      background: #1a1a3e;
      border: 2px solid #7c5cbf;
      padding: 10px 20px;
      outline: none;
      text-align: center;
      text-transform: uppercase;
      width: 260px;
    `;
    inputEl.addEventListener('input', () => {
      this.choices.name = (inputEl.value.toUpperCase() || 'HERO').slice(0, 12);
      this.updatePreview();
    });

    this.domInput = this.add.dom(GAME_W / 2, 180, inputEl);
    c.add(this.domInput);

    // Preview card
    this.previewSprite = this.add.sprite(GAME_W / 2 - 180, 340, 'player-wizard-m').setScale(3);

    this.previewText = this.add.text(GAME_W / 2 - 20, 280, '', {
      fontFamily: '"Press Start 2P"', fontSize: 9, color: '#f0eeff', lineSpacing: 10,
    });

    c.add([this.previewSprite, this.previewText]);

    // Botão confirmar
    const btnConfirm = this.add.text(GAME_W / 2, 490, '▸ COMEÇAR AVENTURA', {
      fontFamily: '"Press Start 2P"', fontSize: 12, color: '#0d0d1a',
      backgroundColor: '#1ecdb4', padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnConfirm.on('pointerover',  () => btnConfirm.setStyle({ backgroundColor: '#27e8c8' }));
    btnConfirm.on('pointerout',   () => btnConfirm.setStyle({ backgroundColor: '#1ecdb4' }));
    btnConfirm.on('pointerdown',  () => this.confirmCreate());

    c.add(btnConfirm);
  }

  updatePreview() {
    const v = this.choices.visualObj || VISUALS['wizard-m'];
    const s = this.choices.stackObj  || { bonus: { int: 0, def: 0, luck: 0 } };
    const id = this.choices.visual   || 'wizard-m';

    const int  = 10 + (s.bonus?.int  || 0) + (v.bonus?.int  || 0);
    const def  = 5  + (s.bonus?.def  || 0) + (v.bonus?.def  || 0);
    const luck = 5  + (s.bonus?.luck || 0);

    this.previewText.setText([
      `NOME:  ${this.choices.name}`,
      `CLASSE: ${v.class}`,
      ``,
      `HP:   100`,
      `INT:  ${int}`,
      `DEF:  ${def}`,
      `LUCK: ${luck}`,
    ]);

    if (this.previewSprite.texture.key !== `player-${id}`) {
      this.previewSprite.setTexture(`player-${id}`);
      if (this.anims.exists(`${id}-idle-down`)) this.previewSprite.play(`${id}-idle-down`);
    }
  }

  confirmCreate() {
    const stackObj  = this.choices.stackObj  || { id: 'java', name: 'Java', icon: '☕', bonus: { int: 2, def: 3, luck: 0 }, frameworks: [] };
    const visualObj = this.choices.visualObj || VISUALS['wizard-m'];
    const s = stackObj.bonus  || { int: 0, def: 0, luck: 0 };
    const v = visualObj.bonus || { int: 0, def: 0 };

    const state = {
      playerName:    this.choices.name || 'HERO',
      sprite:        this.choices.visual || 'wizard-m',
      visualClass:   visualObj.class,
      stack:         stackObj.id,
      stackName:     stackObj.name,
      stackIcon:     stackObj.icon,
      framework:     this.choices.framework,
      frameworkName: this.choices.frameworkName,
      hp: 100, maxHp: 100,
      xp: 0, xpNext: 100,
      int:  10 + (s.int  || 0) + (v.int  || 0),
      def:  5  + (s.def  || 0) + (v.def  || 0),
      luck: 5  + (s.luck || 0),
      titleIndex: 0,
      currentDistrict: 0,
      districtsUnlocked: [0],
      districtsDone: [],
    };

    Object.entries(state).forEach(([k, v]) => this.registry.set(k, v));
    AudioSystem.play('level-up');
    this.scene.start('MapScene');
  }

  // ── Nav helpers ───────────────────────────────────────────────
  showStep(i) {
    this.stepIndicator.setText(`PASSO ${i + 1} / 4`);

    this.containers.forEach((c, idx) => c.setVisible(idx === i).setAlpha(idx === i ? 1 : 0));

    if (i === 1) this.renderFrameworks();
    if (i === 3) this.updatePreview();
  }

  advanceStep() {
    const next = this.currentStep + 1;
    if (next >= this.containers.length) return;

    const cur = this.containers[this.currentStep];
    this.tweens.add({
      targets: cur, alpha: 0, x: '-=40', duration: 200,
      onComplete: () => {
        cur.setVisible(false).setX(cur.x + 40);
        this.currentStep = next;
        const nxt = this.containers[next];
        nxt.setAlpha(0).setX(nxt.x + 40).setVisible(true);
        this.tweens.add({ targets: nxt, alpha: 1, x: '-=40', duration: 200 });
        this.showStep(next);
      },
    });
  }

  // Util
  makeText(x, y, text, size, color, centered = false) {
    return this.add.text(x, y, text, {
      fontFamily: '"Press Start 2P"', fontSize: size, color,
    }).setOrigin(centered ? 0.5 : 0);
  }
}
