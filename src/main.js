import Phaser from 'phaser';
import BootScene       from './scenes/BootScene.js';
import MenuScene       from './scenes/MenuScene.js';
import CharCreateScene from './scenes/CharCreateScene.js';
import MapScene        from './scenes/MapScene.js';
import DialogueScene   from './scenes/DialogueScene.js';
import BattleScene     from './scenes/BattleScene.js';
import ResultScene     from './scenes/ResultScene.js';
import { DEFAULT_STATE } from './constants.js';

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  backgroundColor: '#0d0d1a',
  pixelArt: true,
  roundPixels: true,
  parent: 'game-container',
  dom: { createContainer: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [
    BootScene,
    MenuScene,
    CharCreateScene,
    MapScene,
    DialogueScene,
    BattleScene,
    ResultScene,
  ],
};

const game = new Phaser.Game(config);

// Seed registry with defaults
game.events.once('ready', () => {
  Object.entries(DEFAULT_STATE).forEach(([k, v]) => {
    game.registry.set(k, v);
  });
});

export default game;
