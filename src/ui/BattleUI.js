import { GAME_W, GAME_H } from '../constants.js';

export default class BattleUI {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
  }

  renderOptions(opts, onSelect) {
    this.clearButtons();

    const panelY = GAME_H * 0.5 + 100;
    const cols   = 2;
    const btnW   = (GAME_W - 80) / cols - 10;
    const btnH   = 40;

    opts.forEach((opt, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x   = 30 + col * (btnW + 20);
      const y   = panelY + row * (btnH + 8);

      const btn = this.scene.add.text(x + btnW / 2, y + btnH / 2, `${String.fromCharCode(65 + i)}. ${opt}`, {
        fontFamily: '"Noto Sans JP"', fontSize: 13, color: '#c4a8f5',
        backgroundColor: '#1a1a3e',
        padding: { x: 12, y: 8 },
        wordWrap: { width: btnW - 20 },
        align: 'center',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover',  () => btn.setStyle({ backgroundColor: '#2a2a5e' }));
      btn.on('pointerout',   () => btn.setStyle({ backgroundColor: '#1a1a3e' }));
      btn.on('pointerdown',  () => onSelect(i, btn));

      this.buttons.push(btn);
    });
  }

  highlightCorrect(correctIndex) {
    this.buttons[correctIndex]?.setStyle({ backgroundColor: '#1a5e2a', color: '#1ecdb4' });
  }

  highlightWrong(wrongIndex) {
    this.buttons[wrongIndex]?.setStyle({ backgroundColor: '#5e1a1a', color: '#ff5555' });
  }

  disableAll() {
    this.buttons.forEach(b => b.disableInteractive());
  }

  clearButtons() {
    this.buttons.forEach(b => b.destroy());
    this.buttons = [];
  }

  updateHPBar(bar, txt, current, max, isPlayer) {
    const ratio = current / max;
    bar.setDisplaySize(160 * ratio, 12);
    bar.setFillStyle(isPlayer
      ? (ratio > 0.3 ? 0x1ecdb4 : 0xff5555)
      : 0xff5555
    );
    txt.setText(`${current}/${max}`);
  }
}
