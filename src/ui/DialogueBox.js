import { GAME_W, GAME_H } from '../constants.js';
import { AudioSystem } from '../systems/AudioSystem.js';

export default class DialogueBox {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.onComplete = options.onComplete || null;

    const boxY = options.y || GAME_H - 120;
    const boxH = options.height || 180;

    // Background
    this.bg = scene.add.rectangle(GAME_W / 2, boxY, GAME_W - 80, boxH, 0x1a1a3e)
      .setStrokeStyle(2, 0x7c5cbf)
      .setDepth(30);

    // Name tag
    this.nameBg = scene.add.rectangle(GAME_W / 2, boxY - boxH / 2 - 14, 160, 24, 0x2a1a5e)
      .setStrokeStyle(1, 0x7c5cbf).setDepth(30);
    this.nameText = scene.add.text(GAME_W / 2, boxY - boxH / 2 - 14, '', {
      fontFamily: '"Press Start 2P"', fontSize: 10, color: '#c4a8f5',
    }).setOrigin(0.5).setDepth(31);

    // Body text
    this.bodyText = scene.add.text(GAME_W / 2 - (GAME_W - 120) / 2, boxY - boxH / 2 + 16, '', {
      fontFamily: '"Noto Sans JP"', fontSize: 14, color: '#f0eeff',
      wordWrap: { width: GAME_W - 140 }, lineSpacing: 6,
    }).setDepth(31);

    // Cursor
    this.cursor = scene.add.text(GAME_W - 52, boxY + boxH / 2 - 20, '▼', {
      fontFamily: '"Press Start 2P"', fontSize: 10, color: '#1ecdb4',
    }).setOrigin(0.5).setDepth(32).setVisible(false);

    scene.tweens.add({
      targets: this.cursor, alpha: 0, duration: 400,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
  }

  show(name, text, onDone) {
    this.nameText.setText(name);
    this.cursor.setVisible(false);
    this.typewrite(text, onDone);
  }

  typewrite(text, onDone) {
    this.bodyText.setText('');
    let i = 0;
    this.timer = this.scene.time.addEvent({
      delay: 28,
      repeat: text.length - 1,
      callback: () => {
        this.bodyText.setText(text.slice(0, ++i));
        if (i % 2 === 0) AudioSystem.play('text-blip');
        if (i >= text.length) {
          this.cursor.setVisible(true);
          onDone?.();
        }
      },
    });
  }

  skipToEnd(text) {
    this.timer?.remove();
    this.bodyText.setText(text);
    this.cursor.setVisible(true);
  }

  hide() {
    [this.bg, this.nameBg, this.nameText, this.bodyText, this.cursor]
      .forEach(o => o.setVisible(false));
  }

  destroy() {
    [this.bg, this.nameBg, this.nameText, this.bodyText, this.cursor]
      .forEach(o => o.destroy());
  }
}
