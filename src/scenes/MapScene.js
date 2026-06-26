import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';
import Player  from '../entities/Player.js';
import NPC     from '../entities/NPC.js';
import Enemy   from '../entities/Enemy.js';
import { AudioSystem } from '../systems/AudioSystem.js';

export default class MapScene extends Phaser.Scene {
  constructor() { super('MapScene'); }

  create() {
    const did = this.registry.get('currentDistrict') || 0;
    this.currentDistrict = did;

    const mapKey = `map-0${did + 1}`;
    const mapExists = this.cache.tilemap.exists(mapKey);

    if (mapExists) {
      this.setupTilemap(did, mapKey);
    } else {
      this.setupFallback(did);
    }

    // Input
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.wasd     = this.input.keyboard.addKeys('W,A,S,D');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // HUD overlay
    // scene.launch('HUDScene'); // descomente quando HUDScene for uma scene separada

    AudioSystem.startAmbient();
  }

  setupTilemap(did, mapKey) {
    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage('compile-city', 'tileset-compile-city');

    this.groundLayer     = map.createLayer('Ground',     tileset, 0, 0);
    this.decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
    this.collisionLayer  = map.createLayer('Collision',  tileset, 0, 0);
    this.aboveLayer      = map.createLayer('Above',      tileset, 0, 0);

    this.collisionLayer.setCollisionByProperty({ collides: true });

    const spawn = map.findObject('Objects', o => o.name === 'PlayerSpawn')
      || { x: 100, y: 100 };

    this.player = new Player(this, spawn.x, spawn.y);
    this.physics.add.collider(this.player.sprite, this.collisionLayer);

    // NPCs e inimigos do tilemap
    const npcLayer = map.getObjectLayer('NPCs');
    this.npcs = npcLayer
      ? npcLayer.objects.map(obj => new NPC(this, obj.x, obj.y, obj.properties))
      : [];

    const enemyLayer = map.getObjectLayer('Enemies');
    this.enemies = enemyLayer
      ? enemyLayer.objects.map(obj => new Enemy(this, obj.x, obj.y, obj.properties))
      : [];

    this.cameras.main
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      .startFollow(this.player.sprite, true, 0.08, 0.08);

    this.aboveLayer?.setDepth(10);
    this.player.sprite.setDepth(5);
  }

  setupFallback(did) {
    // Mapa placeholder até assets reais existirem
    const W = 1920, H = 1200;

    // Grade de tiles fake
    const gfx = this.add.graphics();
    for (let x = 0; x < W; x += 16) {
      for (let y = 0; y < H; y += 16) {
        const shade = ((x + y) / 32) % 2 === 0 ? 0x111122 : 0x141428;
        gfx.fillStyle(shade);
        gfx.fillRect(x, y, 16, 16);
      }
    }

    // Nome do bairro
    this.add.text(GAME_W / 2, 40, this.getDistrictName(did), {
      fontFamily: '"Press Start 2P"', fontSize: 11, color: '#c4a8f5',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

    this.player = new Player(this, 200, 200);

    // NPCs de exemplo
    this.npcs = [
      new NPC(this, 400, 300, [{ name: 'id', value: 'von-stack' }, { name: 'spriteKey', value: 'von-stack' }]),
    ];

    // Inimigos de exemplo
    this.enemies = [
      new Enemy(this, 700, 350, [{ name: 'id', value: 'bug-simple' }, { name: 'enemyId', value: 'bug-simple' }]),
    ];

    this.cameras.main
      .setBounds(0, 0, W, H)
      .startFollow(this.player.sprite, true, 0.08, 0.08);

    this.player.sprite.setDepth(5);
  }

  getDistrictName(id) {
    const names = [
      'Silicon District', 'Code Academy', 'Data Harbor', 'Git Gate', 'Net District',
      'Web Front', 'API Plaza', 'Framework Towers', 'Container Port', 'NoSQL Jungle',
      'Clean Hills', 'Test Lab', 'Pattern Palace', 'Performance Peak', 'Cloud Summit',
      "Architect's Citadel",
    ];
    return names[id] || 'Compile City';
  }

  update() {
    this.player?.update(this.cursors, this.wasd);
    this.npcs?.forEach(n => n.update?.());
    this.enemies?.forEach(e => e.update?.());
    this.checkInteraction();
  }

  checkInteraction() {
    if (!Phaser.Input.Keyboard.JustDown(this.spaceKey)) return;

    const entity = this.findNearEntity();
    if (!entity) return;

    AudioSystem.play('open');
    this.scene.pause('MapScene');
    this.scene.launch('DialogueScene', {
      entity,
      districtId: this.currentDistrict,
    });
  }

  findNearEntity() {
    const px = this.player.sprite.x;
    const py = this.player.sprite.y;
    const range = 80;

    const allEntities = [...(this.npcs || []), ...(this.enemies || [])];
    return allEntities.find(e => {
      const s = e.sprite;
      return s && Phaser.Math.Distance.Between(px, py, s.x, s.y) < range;
    });
  }
}
