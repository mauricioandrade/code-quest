import { GAME_W, TITLES } from '../constants.js';

export default class HUD {
  constructor(scene) {
    this.scene    = scene;
    this.registry = scene.registry;
    this.build();
    this.registry.events.on('changedata', this.onDataChange, this);
  }

  build() {
    const r = this.registry;

    // HP bar container
    this.hpLabel = this.scene.add.text(10, 10, 'HP', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#aaaacc',
    }).setScrollFactor(0).setDepth(20);

    this.hpBg  = this.scene.add.rectangle(40, 14, 120, 10, 0x333333).setOrigin(0, 0.5).setScrollFactor(0).setDepth(20);
    this.hpBar = this.scene.add.rectangle(40, 14, 120, 10, 0x1ecdb4).setOrigin(0, 0.5).setScrollFactor(0).setDepth(21);
    this.hpTxt = this.scene.add.text(165, 10, '', {
      fontFamily: '"Press Start 2P"', fontSize: 7, color: '#c4a8f5',
    }).setScrollFactor(0).setDepth(22);

    // XP bar
    this.xpLabel = this.scene.add.text(10, 26, 'XP', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#aaaacc',
    }).setScrollFactor(0).setDepth(20);

    this.xpBg  = this.scene.add.rectangle(40, 30, 120, 6, 0x222244).setOrigin(0, 0.5).setScrollFactor(0).setDepth(20);
    this.xpBar = this.scene.add.rectangle(40, 30, 0, 6, 0x7c5cbf).setOrigin(0, 0.5).setScrollFactor(0).setDepth(21);

    // Title + stack
    this.titleTxt = this.scene.add.text(GAME_W - 10, 10, '', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#c4a8f5',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);

    this.stackTxt = this.scene.add.text(GAME_W - 10, 24, '', {
      fontFamily: '"Press Start 2P"', fontSize: 8, color: '#1ecdb4',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);

    this.refresh();
  }

  refresh() {
    const r = this.registry;
    const hp    = r.get('hp')    || 100;
    const maxHp = r.get('maxHp') || 100;
    const xp    = r.get('xp')    || 0;
    const xpMax = r.get('xpNext')|| 100;

    this.hpBar.setDisplaySize(120 * (hp / maxHp), 10);
    this.hpBar.setFillStyle(hp / maxHp > 0.3 ? 0x1ecdb4 : 0xff5555);
    this.hpTxt.setText(`${hp}/${maxHp}`);

    this.xpBar.setDisplaySize(120 * (xp / xpMax), 6);

    const titleIdx = r.get('titleIndex') || 0;
    const icon     = r.get('stackIcon')  || '?';
    const stack    = r.get('stackName')  || '';

    this.titleTxt.setText(TITLES[titleIdx] || TITLES[0]);
    this.stackTxt.setText(`${icon} ${stack}`);
  }

  onDataChange(parent, key) {
    if (['hp', 'maxHp', 'xp', 'xpNext', 'titleIndex', 'stackIcon', 'stackName'].includes(key)) {
      this.refresh();
    }
  }

  destroy() {
    this.registry.events.off('changedata', this.onDataChange, this);
  }
}
