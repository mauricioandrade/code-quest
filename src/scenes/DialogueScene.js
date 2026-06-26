import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';
import { DIALOGUES } from '../data/npcs.js';
import { AudioSystem } from '../systems/AudioSystem.js';

export default class DialogueScene extends Phaser.Scene {
  constructor() { super('DialogueScene'); }

  init(data) {
    this.entity     = data.entity;
    this.districtId = data.districtId || 0;
    this.step       = 0;
  }

  create() {
    // Overlay escuro
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000, 0.65).setOrigin(0);

    // Caixa de diálogo (fallback rect se asset ausente)
    const boxY = GAME_H - 120;
    if (this.textures.exists('dialogue-box')) {
      this.dialogueBox = this.add.nineslice(
        GAME_W / 2, boxY, 'dialogue-box',
        null, GAME_W - 80, 180, 16, 16, 16, 16
      );
    } else {
      this.add.rectangle(GAME_W / 2, boxY, GAME_W - 80, 180, 0x1a1a3e)
        .setStrokeStyle(2, 0x7c5cbf);
    }

    // Avatar NPC
    const spriteKey = `npc-${this.entity?.spriteKey || 'von-stack'}`;
    if (this.textures.exists(spriteKey)) {
      this.avatar = this.add.sprite(80, boxY, spriteKey).setScale(2);
      if (this.anims.exists(`${spriteKey}-idle`)) this.avatar.play(`${spriteKey}-idle`);
    } else {
      this.add.text(60, boxY, '🧑‍💻', { fontSize: 32 }).setOrigin(0.5);
    }

    // Nome do NPC
    this.nameText = this.add.text(130, GAME_H - 195, '', {
      fontFamily: '"Press Start 2P"', fontSize: 11, color: '#c4a8f5',
    });

    // Texto com typewriter
    this.dialogueText = this.add.text(130, GAME_H - 170, '', {
      fontFamily: '"Noto Sans JP"', fontSize: 14, color: '#f0eeff',
      wordWrap: { width: GAME_W - 200 }, lineSpacing: 6,
    });

    // Cursor piscando
    if (this.textures.exists('cursor')) {
      if (!this.anims.exists('cursor-blink')) {
        this.anims.create({
          key: 'cursor-blink',
          frames: this.anims.generateFrameNumbers('cursor', { start: 0, end: 1 }),
          frameRate: 3, repeat: -1,
        });
      }
      this.cursor = this.add.sprite(GAME_W - 60, GAME_H - 50, 'cursor').play('cursor-blink');
    } else {
      this.cursor = this.add.text(GAME_W - 60, GAME_H - 50, '▼', {
        fontFamily: '"Press Start 2P"', fontSize: 10, color: '#1ecdb4',
      }).setOrigin(0.5);
      this.tweens.add({ targets: this.cursor, alpha: 0, duration: 400, yoyo: true, repeat: -1 });
    }
    this.cursor.setVisible(false);

    // Ações
    this.actionButtons = [];

    // Input
    this.input.keyboard.on('keydown-SPACE', () => this.advance());
    this.input.keyboard.on('keydown-ENTER', () => this.advance());

    this.showStep(0);
  }

  showStep(i) {
    const steps = DIALOGUES[this.entity?.id] || DIALOGUES['default'] || [];
    const step  = steps[i];

    if (!step) {
      this.closeDialogue();
      return;
    }

    this.nameText.setText(this.entity?.name || 'NPC');
    this.typewriterEffect(step.text, () => this.cursor.setVisible(true));
    this.renderActions(step.actions || []);
  }

  typewriterEffect(text, onComplete) {
    this.cursor.setVisible(false);
    this.dialogueText.setText('');
    let i = 0;
    this.twTimer = this.time.addEvent({
      delay: 28,
      repeat: text.length - 1,
      callback: () => {
        this.dialogueText.setText(text.slice(0, ++i));
        if (i % 2 === 0) AudioSystem.play('text-blip');
        if (i === text.length) onComplete?.();
      },
    });
  }

  advance() {
    const progress = this.twTimer ? this.twTimer.getProgress() : 1;

    if (progress < 1) {
      // Pular para o fim
      this.twTimer.remove();
      const steps = DIALOGUES[this.entity?.id] || DIALOGUES['default'] || [];
      const step  = steps[this.step];
      this.dialogueText.setText(step?.text || '');
      this.cursor.setVisible(true);
      return;
    }

    const steps = DIALOGUES[this.entity?.id] || DIALOGUES['default'] || [];
    const step  = steps[this.step];
    if (step?.actions?.length) return; // Aguarda botão ser clicado

    this.step++;
    if (this.step < steps.length) {
      this.showStep(this.step);
    } else {
      this.closeDialogue();
    }
  }

  renderActions(actions) {
    this.actionButtons.forEach(b => b.destroy());
    this.actionButtons = [];
    if (!actions.length) return;

    const startX = GAME_W / 2 - (actions.length * 130) / 2;
    actions.forEach((action, i) => {
      const btn = this.add.text(startX + i * 140, GAME_H - 56, action.label, {
        fontFamily: '"Press Start 2P"', fontSize: 9, color: '#0d0d1a',
        backgroundColor: action.type === 'battle' ? '#e85555' : '#1ecdb4',
        padding: { x: 14, y: 8 },
      }).setInteractive({ useHandCursor: true });

      btn.on('pointerover',  () => btn.setAlpha(0.8));
      btn.on('pointerout',   () => btn.setAlpha(1));
      btn.on('pointerdown',  () => this.handleAction(action));

      this.actionButtons.push(btn);
    });
  }

  handleAction(action) {
    switch (action.type) {
      case 'battle':  this.startBattle(); break;
      case 'next':    this.step++; this.showStep(this.step); break;
      case 'close':   this.closeDialogue(); break;
    }
  }

  startBattle() {
    AudioSystem.stopAmbient();
    AudioSystem.play('attack');
    this.scene.stop('DialogueScene');
    this.scene.stop('MapScene');
    this.scene.start('BattleScene', {
      districtId: this.districtId,
      enemyId:    this.entity?.enemyId || 'bug-simple',
    });
  }

  closeDialogue() {
    this.scene.stop('DialogueScene');
    this.scene.resume('MapScene');
  }
}
