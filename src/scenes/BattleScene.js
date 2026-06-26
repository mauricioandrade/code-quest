import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';
import { AudioSystem }    from '../systems/AudioSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { getQuestionsForBattle } from '../systems/QuestionSystem.js';
import { ENEMIES }        from '../data/enemies.js';

const TIMER_MAX  = 30;
const QUESTIONS  = 5;
const DAMAGE_HIT = 20;
const DAMAGE_MISS = 15;

export default class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  init(data) {
    this.districtId = data.districtId || 0;
    this.enemyId    = data.enemyId    || 'bug-simple';
  }

  create() {
    this.playerHP   = this.registry.get('hp')    || 100;
    this.playerMaxHP = this.registry.get('maxHp') || 100;
    this.streak     = 0;
    this.maxStreak  = 0;
    this.correct    = 0;
    this.total      = 0;
    this.playerErrors = 0;
    this.timerPenalty = 0;

    const stack   = this.registry.get('stack') || 'java';
    this.questions = getQuestionsForBattle(this.districtId, stack, QUESTIONS);
    this.qIndex    = 0;

    const enemyData = ENEMIES[this.enemyId] || ENEMIES['bug-simple'];
    this.enemyHP    = enemyData.hp || 100;
    this.enemyMaxHP = enemyData.hp || 100;
    this.enemyData  = enemyData;

    this.buildBackground();
    this.buildSprites();
    this.buildHPBars();
    this.buildQuestionPanel();
    this.buildTimerBar();

    this.nextQuestion();
  }

  // ── Layout ────────────────────────────────────────────────────
  buildBackground() {
    // Gradiente fake com dois retângulos
    this.add.rectangle(0, 0, GAME_W, GAME_H / 2, 0x0d0d1a).setOrigin(0);
    this.add.rectangle(0, GAME_H / 2, GAME_W, GAME_H / 2, 0x0a0a16).setOrigin(0);

    // Linha divisória
    this.add.rectangle(GAME_W / 2, 0, 2, GAME_H * 0.45, 0x333366).setOrigin(0.5, 0);
    this.add.text(GAME_W / 2, GAME_H * 0.22, 'VS', {
      fontFamily: '"Press Start 2P"', fontSize: 14, color: '#444466',
    }).setOrigin(0.5);
  }

  buildSprites() {
    const spriteKey = this.registry.get('sprite') || 'wizard-m';
    this.playerSprite = this.add.sprite(GAME_W * 0.2, GAME_H * 0.28, `player-${spriteKey}`).setScale(3);

    const animKey = `${spriteKey}-idle-down`;
    if (!this.anims.exists(animKey)) {
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(`player-${spriteKey}`, { start: 1, end: 1 }),
        frameRate: 2, repeat: -1,
      });
    }
    this.playerSprite.play(animKey);

    // Player name + streak
    this.playerNameText = this.add.text(GAME_W * 0.2, GAME_H * 0.08, this.registry.get('playerName') || 'HERO', {
      fontFamily: '"Press Start 2P"', fontSize: 10, color: '#c4a8f5',
    }).setOrigin(0.5);

    this.streakText = this.add.text(GAME_W * 0.2, GAME_H * 0.44, '', {
      fontFamily: '"Press Start 2P"', fontSize: 9, color: '#ffaa00',
    }).setOrigin(0.5);

    // Enemy sprite
    const eKey = `enemy-${this.enemyId}`;
    this.enemySprite = this.add.sprite(GAME_W * 0.78, GAME_H * 0.28, eKey).setScale(3).setFlipX(true);

    const eAnimKey = `${eKey}-idle`;
    if (!this.anims.exists(eAnimKey)) {
      this.anims.create({
        key: eAnimKey,
        frames: this.anims.generateFrameNumbers(eKey, { start: 0, end: 3 }),
        frameRate: 4, repeat: -1,
      });
    }
    if (this.textures.exists(eKey)) this.enemySprite.play(eAnimKey);

    this.enemyNameText = this.add.text(GAME_W * 0.78, GAME_H * 0.08, this.enemyData.name || 'BUG', {
      fontFamily: '"Press Start 2P"', fontSize: 10, color: '#ff5555',
    }).setOrigin(0.5);
  }

  buildHPBars() {
    // Player HP
    this.add.text(GAME_W * 0.07, GAME_H * 0.14, 'HP', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#aaaacc',
    });
    this.playerHPBg  = this.add.rectangle(GAME_W * 0.2, GAME_H * 0.15, 160, 12, 0x333333).setOrigin(0.5);
    this.playerHPBar = this.add.rectangle(GAME_W * 0.2 - 80, GAME_H * 0.15, 160, 12, 0x1ecdb4).setOrigin(0, 0.5);
    this.playerHPTxt = this.add.text(GAME_W * 0.2, GAME_H * 0.15, `${this.playerHP}/${this.playerMaxHP}`, {
      fontFamily: '"Press Start 2P"', fontSize: 7, color: '#ffffff',
    }).setOrigin(0.5).setDepth(1);

    // Enemy HP
    this.add.text(GAME_W * 0.65, GAME_H * 0.14, 'HP', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#aaaacc',
    });
    this.enemyHPBg  = this.add.rectangle(GAME_W * 0.78, GAME_H * 0.15, 160, 12, 0x333333).setOrigin(0.5);
    this.enemyHPBar = this.add.rectangle(GAME_W * 0.78 - 80, GAME_H * 0.15, 160, 12, 0xff5555).setOrigin(0, 0.5);
    this.enemyHPTxt = this.add.text(GAME_W * 0.78, GAME_H * 0.15, `${this.enemyHP}/${this.enemyMaxHP}`, {
      fontFamily: '"Press Start 2P"', fontSize: 7, color: '#ffffff',
    }).setOrigin(0.5).setDepth(1);
  }

  buildQuestionPanel() {
    const panelY = GAME_H * 0.5;
    this.add.rectangle(GAME_W / 2, panelY + 125, GAME_W - 40, 240, 0x111133)
      .setStrokeStyle(2, 0x333366);

    // Tags
    this.moduleTag = this.add.text(30, panelY + 16, '', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#555577',
      backgroundColor: '#1a1a3e', padding: { x: 8, y: 4 },
    });
    this.stackTag = this.add.text(0, panelY + 16, '', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#555577',
      backgroundColor: '#1a1a3e', padding: { x: 8, y: 4 },
    });

    // Pergunta
    this.questionText = this.add.text(GAME_W / 2, panelY + 56, '', {
      fontFamily: '"Noto Sans JP"', fontSize: 15, color: '#f0eeff',
      wordWrap: { width: GAME_W - 100 }, align: 'center',
    }).setOrigin(0.5);

    // Feedback
    this.feedbackText = this.add.text(GAME_W / 2, panelY + 196, '', {
      fontFamily: '"Press Start 2P"', fontSize: 9, color: '#1ecdb4',
      wordWrap: { width: GAME_W - 80 }, align: 'center',
    }).setOrigin(0.5);

    // Botão próximo
    this.nextBtn = this.add.text(GAME_W - 60, panelY + 226, 'PRÓX ▶', {
      fontFamily: '"Press Start 2P"', fontSize: 9, color: '#0d0d1a',
      backgroundColor: '#1ecdb4', padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);
    this.nextBtn.on('pointerdown', () => this.nextQuestion());

    this.optionBtns = [];
  }

  buildTimerBar() {
    const y = GAME_H * 0.48;
    this.add.rectangle(GAME_W / 2, y, GAME_W - 40, 8, 0x222244).setOrigin(0.5);
    this.timerBar = this.add.rectangle(20, y, GAME_W - 40, 8, 0x7c5cbf).setOrigin(0, 0.5);
    this.timerText = this.add.text(GAME_W - 30, y, '30s', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#c4a8f5',
    }).setOrigin(0.5);

    this.timeLeft = TIMER_MAX;
    this.timerFrozen = false;

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      repeat: TIMER_MAX - 1,
      callback: this.tickTimer,
      callbackScope: this,
    });
  }

  tickTimer() {
    if (this.timerFrozen) return;
    this.timeLeft = Math.max(0, this.timeLeft - 1);
    const ratio = this.timeLeft / TIMER_MAX;
    this.timerBar.setDisplaySize((GAME_W - 40) * ratio, 8);
    this.timerText.setText(`${this.timeLeft}s`);
    this.timerBar.setFillStyle(ratio > 0.4 ? 0x7c5cbf : 0xff5555);

    if (this.timeLeft <= 0) {
      this.timerEvent.remove();
      this.onTimeOut();
    }
  }

  freezeTimer(ms) {
    this.timerFrozen = true;
    this.time.delayedCall(ms, () => { this.timerFrozen = false; });
  }

  // ── Question flow ─────────────────────────────────────────────
  nextQuestion() {
    if (this.qIndex >= this.questions.length) {
      this.endBattle(true);
      return;
    }

    const q = this.questions[this.qIndex++];
    this.currentQ = q;

    const stack = this.registry.get('stack') || 'java';
    const stackIcon = this.registry.get('stackIcon') || '☕';

    this.moduleTag.setText(`MÓDULO ${String(this.districtId + 1).padStart(2, '0')}`);
    this.stackTag.setText(`${stackIcon} ${stack.toUpperCase()}`);
    this.stackTag.setX(GAME_W - this.stackTag.width - 30);

    this.questionText.setText(q.q);
    this.feedbackText.setText('');
    this.nextBtn.setVisible(false);

    // Reseta timer
    this.timeLeft = TIMER_MAX - (this.timerPenalty || 0);
    this.timerEvent?.remove();
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      repeat: this.timeLeft - 1,
      callback: this.tickTimer,
      callbackScope: this,
    });

    this.renderOptions(q);
  }

  renderOptions(q) {
    this.optionBtns.forEach(b => b.destroy());
    this.optionBtns = [];

    const panelY = GAME_H * 0.5;
    const cols   = 2;
    const btnW   = (GAME_W - 80) / cols - 10;
    const btnH   = 40;

    q.opts.forEach((opt, i) => {
      const col  = i % cols;
      const row  = Math.floor(i / cols);
      const x    = 30 + col * (btnW + 20);
      const y    = panelY + 106 + row * (btnH + 8);

      const btn = this.add.text(x + btnW / 2, y + btnH / 2, `${String.fromCharCode(65 + i)}. ${opt}`, {
        fontFamily: '"Noto Sans JP"', fontSize: 13, color: '#c4a8f5',
        backgroundColor: '#1a1a3e',
        padding: { x: 12, y: 8 },
        wordWrap: { width: btnW - 20 },
        align: 'center',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover',  () => btn.setStyle({ backgroundColor: '#2a2a5e' }));
      btn.on('pointerout',   () => btn.setStyle({ backgroundColor: '#1a1a3e' }));
      btn.on('pointerdown',  () => this.selectAnswer(i, btn));

      this.optionBtns.push(btn);
    });
  }

  selectAnswer(index, btn) {
    if (!this.currentQ) return;
    this.timerEvent?.remove();
    this.optionBtns.forEach(b => b.disableInteractive());
    this.total++;

    const isCorrect = index === this.currentQ.correct;

    if (isCorrect) {
      this.correct++;
      this.streak++;
      this.maxStreak = Math.max(this.maxStreak, this.streak);

      btn.setStyle({ backgroundColor: '#1a5e2a', color: '#1ecdb4' });

      const dmg = DAMAGE_HIT * (this.streak >= 3 ? 2 : 1);
      this.dealDamageToEnemy(dmg);
      AudioSystem.play('hit');

      const msg = this.streak >= 3
        ? `✓ Correto! 🔥 STREAK x${this.streak} — DANO DOBRADO!`
        : `✓ Correto! +${dmg} dano`;
      this.feedbackText.setText(msg).setStyle({ color: '#1ecdb4' });

      this.attackAnimation(this.playerSprite, this.enemySprite, () => {
        ParticleSystem.burst(this, this.enemySprite.x, this.enemySprite.y, 0x1ecdb4);
        this.hitAnimation(this.enemySprite);
      });

      this.streakText.setText(this.streak >= 2 ? `🔥 STREAK x${this.streak}` : '');

      this.bossBehavior('onPlayerHit');
    } else {
      this.streak = 0;
      this.playerErrors++;
      this.streakText.setText('');

      btn.setStyle({ backgroundColor: '#5e1a1a', color: '#ff5555' });
      this.optionBtns[this.currentQ.correct].setStyle({ backgroundColor: '#1a5e2a', color: '#1ecdb4' });

      this.dealDamageToPlayer(DAMAGE_MISS);
      AudioSystem.play('miss');
      this.feedbackText.setText(`✗ Errado. ${this.currentQ.explain}`).setStyle({ color: '#ff5555' });

      this.attackAnimation(this.enemySprite, this.playerSprite, () => {
        ParticleSystem.burst(this, this.playerSprite.x, this.playerSprite.y, 0xff5555);
        this.hitAnimation(this.playerSprite);
      });

      this.bossBehavior('onPlayerError');
    }

    if (this.enemyHP <= 0) {
      this.time.delayedCall(800, () => this.endBattle(true));
    } else if (this.playerHP <= 0) {
      this.time.delayedCall(800, () => this.endBattle(false));
    } else {
      this.nextBtn.setVisible(true);
    }
  }

  onTimeOut() {
    this.streak = 0;
    this.streakText.setText('');
    this.dealDamageToPlayer(10);
    AudioSystem.play('miss');
    this.feedbackText.setText('⏰ Tempo esgotado! -10 HP').setStyle({ color: '#ff5555' });
    if (this.playerHP <= 0) {
      this.time.delayedCall(800, () => this.endBattle(false));
    } else {
      this.nextBtn.setVisible(true);
    }
  }

  // ── Damage ────────────────────────────────────────────────────
  dealDamageToEnemy(dmg) {
    this.enemyHP = Math.max(0, this.enemyHP - dmg);
    const ratio  = this.enemyHP / this.enemyMaxHP;
    this.enemyHPBar.setDisplaySize(160 * ratio, 12);
    this.enemyHPTxt.setText(`${this.enemyHP}/${this.enemyMaxHP}`);
  }

  dealDamageToPlayer(dmg) {
    const def    = this.registry.get('def') || 5;
    const actual = Math.max(1, dmg - Math.floor(def / 3));
    this.playerHP = Math.max(0, this.playerHP - actual);
    const ratio   = this.playerHP / this.playerMaxHP;
    this.playerHPBar.setDisplaySize(160 * ratio, 12);
    this.playerHPTxt.setText(`${this.playerHP}/${this.playerMaxHP}`);
  }

  // ── Animations ────────────────────────────────────────────────
  attackAnimation(attacker, target, onImpact) {
    const dir    = attacker === this.playerSprite ? 120 : -120;
    const origX  = attacker.x;
    this.tweens.add({
      targets: attacker, x: attacker.x + dir, duration: 180, ease: 'Power2',
      onComplete: () => {
        onImpact();
        this.tweens.add({ targets: attacker, x: origX, duration: 180, ease: 'Power2' });
      },
    });
  }

  hitAnimation(target) {
    this.tweens.add({ targets: target, alpha: 0.2, duration: 50, yoyo: true, repeat: 3 });
    this.cameras.main.shake(150, 0.005);
  }

  // ── Boss behaviors ────────────────────────────────────────────
  bossBehavior(event) {
    const behavior = BOSS_BEHAVIORS[this.enemyId];
    behavior?.[event]?.call(this, this);
  }

  showBossMessage(msg) {
    const txt = this.add.text(GAME_W / 2, GAME_H * 0.38, msg, {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#ff5555',
      wordWrap: { width: GAME_W - 100 }, align: 'center',
    }).setOrigin(0.5);
    this.time.delayedCall(2000, () => txt.destroy());
  }

  removeOneWrongOption() {
    const wrong = this.optionBtns.filter((_, i) => i !== this.currentQ?.correct);
    if (wrong.length) wrong[0].setVisible(false);
  }

  endBattle(victory) {
    this.timerEvent?.remove();
    AudioSystem.stopAmbient();
    AudioSystem.play(victory ? 'victory' : 'defeat');

    const xpGained = victory
      ? 30 + this.correct * 10 + this.maxStreak * 5
      : 5;

    this.registry.set('hp', Math.max(1, this.playerHP));

    this.scene.start('ResultScene', {
      victory,
      correct:    this.correct,
      total:      this.total,
      maxStreak:  this.maxStreak,
      xpGained,
      districtId: this.districtId,
      enemyId:    this.enemyId,
    });
  }
}

// ── Boss behaviors (external defs) ────────────────────────────
const BOSS_BEHAVIORS = {
  'null-pointer-rex': {
    onPlayerError() {
      this.playerErrors = (this.playerErrors || 0) + 1;
      if (this.playerErrors % 2 === 0) {
        this.removeOneWrongOption();
        this.showBossMessage('NullPointer Rex sorri: "Deixa eu te dar uma dica... pelo preço de HP!"');
      }
    },
  },
  'the-undefined': {
    onPlayerHit() {
      this.timerPenalty = (this.timerPenalty || 0) + 5;
      this.showBossMessage('The Undefined grita: "Você está ficando sem tempo!"');
    },
  },
  'the-deadlock': {
    onPlayerHit() {
      this.freezeTimer(3000);
      this.showBossMessage('The Deadlock bloqueia o tempo...');
    },
  },
};
