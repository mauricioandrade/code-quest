import Phaser from 'phaser';
import { GAME_W, GAME_H, TITLES } from '../constants.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';

export default class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  init(data) {
    this.victory    = data.victory;
    this.correct    = data.correct    || 0;
    this.total      = data.total      || 0;
    this.maxStreak  = data.maxStreak  || 0;
    this.xpGained   = data.xpGained   || 0;
    this.districtId = data.districtId || 0;
    this.enemyId    = data.enemyId    || 'bug-simple';
  }

  create() {
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x0d0d1a).setOrigin(0);

    // Resultado principal
    const resultEmoji = this.victory ? '⭐' : '💀';
    const resultColor = this.victory ? '#ffdd00' : '#ff5555';
    const resultLabel = this.victory ? 'VITÓRIA!' : 'DERROTA...';

    const emojiTxt = this.add.text(GAME_W / 2, 100, resultEmoji, { fontSize: 64 }).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: emojiTxt, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.easeOut' });

    this.add.text(GAME_W / 2, 180, resultLabel, {
      fontFamily: '"Press Start 2P"', fontSize: 28, color: resultColor,
      shadow: { blur: 20, color: resultColor, fill: true },
    }).setOrigin(0.5);

    // Stats
    const statsY = 250;
    [
      [`Acertos:      ${this.correct} / ${this.total}`,         '#c4a8f5'],
      [`Max streak:   ${this.maxStreak}x`,                       '#ffaa00'],
      [`XP ganho:     +${this.xpGained}`,                       '#1ecdb4'],
    ].forEach(([text, color], i) => {
      this.add.text(GAME_W / 2, statsY + i * 36, text, {
        fontFamily: '"Press Start 2P"', fontSize: 11, color,
      }).setOrigin(0.5);
    });

    // XP bar animada
    this.drawXPBar();

    // Botões
    if (this.victory) {
      this.createButton(GAME_W / 2, GAME_H - 80, '▸ CONTINUAR', () => {
        AudioSystem.play('select');
        this.scene.start('MapScene');
      }, '#1ecdb4');

      if (this.maxStreak >= 3) {
        ParticleSystem.levelUp(this, GAME_W / 2, GAME_H / 2);
      }
    } else {
      this.createButton(GAME_W / 2 - 120, GAME_H - 80, '↩ TENTAR DE NOVO', () => {
        AudioSystem.play('select');
        this.scene.start('BattleScene', {
          districtId: this.districtId,
          enemyId:    this.enemyId,
        });
      }, '#e85555');

      this.createButton(GAME_W / 2 + 120, GAME_H - 80, '🗺 MAPA', () => {
        AudioSystem.play('select');
        this.scene.start('MapScene');
      }, '#555577');
    }
  }

  drawXPBar() {
    const xp    = this.registry.get('xp')     || 0;
    const xpMax = this.registry.get('xpNext') || 100;
    const newXP = Math.min(xp + this.xpGained, xpMax);

    const barY  = 380;
    const barW  = 400;

    this.add.text(GAME_W / 2, barY - 20, 'XP', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#888899',
    }).setOrigin(0.5);

    this.add.rectangle(GAME_W / 2, barY, barW, 16, 0x222244).setOrigin(0.5);
    const bar = this.add.rectangle(GAME_W / 2 - barW / 2, barY, 0, 16, 0x7c5cbf).setOrigin(0, 0.5);

    this.tweens.add({
      targets: bar,
      displayWidth: barW * (newXP / xpMax),
      duration: 1200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        const leveled = this.applyXP(newXP, xpMax);
        if (leveled) this.showLevelUp();
      },
    });

    this.add.text(GAME_W / 2, barY + 20, `${xp} → ${newXP} / ${xpMax}`, {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#c4a8f5',
    }).setOrigin(0.5);
  }

  applyXP(newXP, xpMax) {
    let xp      = newXP;
    let xpNext  = xpMax;
    let titleIdx = this.registry.get('titleIndex') || 0;
    let leveled  = false;

    if (xp >= xpNext) {
      xp      -= xpNext;
      xpNext   = Math.floor(xpNext * 1.5);
      titleIdx = Math.min(titleIdx + 1, TITLES.length - 1);
      leveled  = true;
    }

    this.registry.set('xp', xp);
    this.registry.set('xpNext', xpNext);
    this.registry.set('titleIndex', titleIdx);

    if (this.victory) {
      const done = this.registry.get('districtsDone') || [];
      if (!done.includes(this.districtId)) {
        done.push(this.districtId);
        this.registry.set('districtsDone', done);
        const unlocked = this.registry.get('districtsUnlocked') || [0];
        if (!unlocked.includes(this.districtId + 1)) {
          unlocked.push(this.districtId + 1);
          this.registry.set('districtsUnlocked', unlocked);
          this.registry.set('currentDistrict', this.districtId + 1);
        }
      }
    }

    SaveSystem.save(this.registry);
    return leveled;
  }

  showLevelUp() {
    const titleIdx = this.registry.get('titleIndex') || 0;
    const title    = TITLES[titleIdx];

    const banner = this.add.text(GAME_W / 2, 440, `✨ LEVEL UP! ${title}`, {
      fontFamily: '"Press Start 2P"', fontSize: 12, color: '#ffdd00',
      backgroundColor: '#1a1200', padding: { x: 20, y: 12 },
    }).setOrigin(0.5).setScale(0);

    this.tweens.add({ targets: banner, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.easeOut' });
    AudioSystem.play('level-up');
    ParticleSystem.levelUp(this, GAME_W / 2, 440);
  }

  createButton(x, y, label, callback, color = '#1ecdb4') {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"', fontSize: 10, color: '#0d0d1a',
      backgroundColor: color, padding: { x: 16, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => btn.setAlpha(0.8));
    btn.on('pointerout',   () => btn.setAlpha(1));
    btn.on('pointerdown',  callback);
    return btn;
  }
}
