import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    const loadText = this.add.text(GAME_W / 2, GAME_H / 2 - 20, 'CARREGANDO...', {
      font: '16px monospace', fill: '#c4a8f5',
    }).setOrigin(0.5);

    const bar = this.add.graphics();
    this.load.on('progress', v => {
      bar.clear();
      bar.fillStyle(0x7c5cbf);
      bar.fillRect(GAME_W / 2 - 200, GAME_H / 2, 400 * v, 12);
    });

    // Tilesets
    this.load.image('tileset-compile-city', 'assets/tilesets/compile-city.png');

    // Tilemaps
    this.load.tilemapTiledJSON('map-01', 'assets/tilemaps/district-01.json');
    this.load.tilemapTiledJSON('map-02', 'assets/tilemaps/district-02.json');
    this.load.tilemapTiledJSON('map-03', 'assets/tilemaps/district-03.json');

    // Player spritesheets (48x48, 12 frames: 4 dirs x 3 frames)
    ['wizard-m', 'wizard-f', 'warrior-m', 'warrior-f'].forEach(k =>
      this.load.spritesheet(`player-${k}`, `assets/sprites/player/${k}.png`, {
        frameWidth: 48, frameHeight: 48,
      })
    );

    // NPCs (32x48, 4 frames idle)
    this.load.spritesheet('npc-von-stack', 'assets/sprites/npcs/von-stack.png', {
      frameWidth: 32, frameHeight: 48,
    });
    this.load.spritesheet('npc-lady-rest', 'assets/sprites/npcs/lady-rest.png', {
      frameWidth: 32, frameHeight: 48,
    });

    // Enemies (48x48, 4 frames idle)
    ['bug-simple', 'bug-mutant', 'null-pointer-rex', 'the-undefined', 'the-deadlock'].forEach(k =>
      this.load.spritesheet(`enemy-${k}`, `assets/sprites/enemies/${k}.png`, {
        frameWidth: 48, frameHeight: 48,
      })
    );

    // UI
    this.load.image('dialogue-box', 'assets/ui/dialogue-box.png');
    this.load.spritesheet('cursor', 'assets/ui/cursor.png', {
      frameWidth: 16, frameHeight: 16,
    });
    this.load.spritesheet('hp-bar', 'assets/ui/hp-bar.png', {
      frameWidth: 128, frameHeight: 16,
    });

    // Placeholder pixel for particles
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff);
    gfx.fillRect(0, 0, 4, 4);
    gfx.generateTexture('pixel', 4, 4);
    gfx.destroy();

    // Placeholder star for menu particles
    const star = this.make.graphics({ x: 0, y: 0, add: false });
    star.fillStyle(0xffffff);
    star.fillRect(0, 0, 2, 2);
    star.generateTexture('star-pixel', 2, 2);
    star.destroy();

    this.load.on('loaderror', () => {
      // Assets opcionais — silencia erros de arquivos ausentes
    });
  }

  create() {
    this.scene.start('MenuScene');
  }
}
