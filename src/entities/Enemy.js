import { ENEMIES } from '../data/enemies.js';

export default class Enemy {
  constructor(scene, x, y, properties = []) {
    this.scene = scene;

    const getProp = name => properties.find(p => p.name === name)?.value;

    this.id      = getProp('id')      || 'bug-simple';
    this.enemyId = getProp('enemyId') || this.id;

    const data = ENEMIES[this.id] || ENEMIES['bug-simple'];
    this.name  = data.name || 'BUG';

    const textureKey = `enemy-${this.id}`;
    if (scene.textures.exists(textureKey)) {
      this.sprite = scene.add.sprite(x, y, textureKey).setScale(2).setDepth(4);

      const animKey = `${textureKey}-idle`;
      if (!scene.anims.exists(animKey)) {
        scene.anims.create({
          key: animKey,
          frames: scene.anims.generateFrameNumbers(textureKey, { start: 0, end: 3 }),
          frameRate: 4,
          repeat: -1,
        });
      }
      this.sprite.play(animKey);
    } else {
      this.sprite = scene.add.text(x, y, data.icon || '🐛', { fontSize: 28 })
        .setOrigin(0.5).setDepth(4);
    }

    // Indicador de batalha
    this.indicator = scene.add.text(x, y - 44, '⚔', {
      fontFamily: '"Press Start 2P"', fontSize: 12, color: '#ff5555',
    }).setOrigin(0.5).setDepth(6).setVisible(false);

    scene.tweens.add({
      targets: this.indicator, y: y - 52, duration: 500,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    // Patrulha leve
    scene.tweens.add({
      targets: this.sprite, x: x + 20, duration: 1200 + Math.random() * 800,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
  }

  update() {}

  showIndicator(show) {
    this.indicator.setVisible(show);
  }
}
