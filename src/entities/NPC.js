import { NPCS } from '../data/npcs.js';

export default class NPC {
  constructor(scene, x, y, properties = []) {
    this.scene = scene;

    const getProp = name => properties.find(p => p.name === name)?.value;

    this.id        = getProp('id')        || 'von-stack';
    this.spriteKey = getProp('spriteKey') || this.id;
    this.enemyId   = getProp('enemyId')   || null;

    const npcData = NPCS[this.id] || {};
    this.name = npcData.name || 'NPC';

    const textureKey = `npc-${this.spriteKey}`;
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
      this.sprite = scene.add.text(x, y, npcData.icon || '🧑‍💻', { fontSize: 24 })
        .setOrigin(0.5).setDepth(4);
    }

    // Indicador de interação
    this.indicator = scene.add.text(x, y - 40, '!', {
      fontFamily: '"Press Start 2P"', fontSize: 14, color: '#ffdd00',
    }).setOrigin(0.5).setDepth(6).setVisible(false);

    scene.tweens.add({
      targets: this.indicator, y: y - 48, duration: 600,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
  }

  update() {
    // Mostra indicador se jogador está próximo (verificado no MapScene)
  }

  showIndicator(show) {
    this.indicator.setVisible(show);
  }
}
