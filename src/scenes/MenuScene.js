import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';
import { AudioSystem } from '../systems/AudioSystem.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    // Fundo com estrelas
    this.add.particles(0, 0, 'star-pixel', {
      quantity: 80,
      lifespan: Infinity,
      x: { min: 0, max: GAME_W },
      y: { min: 0, max: GAME_H },
      alpha: { min: 0.2, max: 1.0 },
      scale: { min: 0.5, max: 1.5 },
      speedX: 0,
      speedY: 0,
    });

    // Título
    this.add.text(GAME_W / 2, 140, 'CODE\nQUEST', {
      fontFamily: '"Press Start 2P"',
      fontSize: 48,
      color: '#c4a8f5',
      align: 'center',
      lineSpacing: 16,
      shadow: { blur: 32, color: '#7c5cbf', fill: true },
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 270, '▸ COMPILE CITY RPG ◂', {
      fontFamily: '"Press Start 2P"',
      fontSize: 11,
      color: '#1ecdb4',
    }).setOrigin(0.5);

    // Sprite preview (último personagem salvo ou default)
    const sprite = this.registry.get('sprite') || 'wizard-m';
    this.heroSprite = this.add.sprite(GAME_W / 2, 360, `player-${sprite}`)
      .setScale(3);

    // Animação idle — cria se não existir
    if (!this.anims.exists(`${sprite}-idle-down`)) {
      this.anims.create({
        key: `${sprite}-idle-down`,
        frames: this.anims.generateFrameNumbers(`player-${sprite}`, { start: 1, end: 1 }),
        frameRate: 2,
        repeat: -1,
      });
    }
    this.heroSprite.play(`${sprite}-idle-down`);

    // Flutuação
    this.tweens.add({
      targets: this.heroSprite,
      y: 350,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Botão
    this.createButton(GAME_W / 2, 470, 'NOVA AVENTURA', () => {
      AudioSystem.play('select');
      this.scene.start('CharCreateScene');
    });

    // Versão
    this.add.text(GAME_W - 10, GAME_H - 10, 'v2.0', {
      fontFamily: '"Press Start 2P"',
      fontSize: 8,
      color: '#444466',
    }).setOrigin(1, 1);
  }

  createButton(x, y, label, callback) {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: 14,
      color: '#f0eeff',
      backgroundColor: '#2a1a5e',
      padding: { x: 20, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => btn.setStyle({ color: '#1ecdb4' }));
    btn.on('pointerout',   () => btn.setStyle({ color: '#f0eeff' }));
    btn.on('pointerdown',  callback);

    return btn;
  }
}
