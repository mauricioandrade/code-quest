export default class Player {
  constructor(scene, x, y) {
    this.scene   = scene;
    const sprite = scene.registry.get('sprite') || 'wizard-m';

    this.sprite = scene.physics.add.sprite(x, y, `player-${sprite}`)
      .setScale(2)
      .setDepth(5);

    this.facing = 'down';
    this.createAnims(scene, sprite);
  }

  createAnims(scene, sprite) {
    const dirs = ['down', 'left', 'right', 'up'];
    dirs.forEach((dir, row) => {
      ['walk', 'idle'].forEach(type => {
        const key = `${sprite}-${type}-${dir}`;
        if (scene.anims.exists(key)) return;
        scene.anims.create({
          key,
          frames: scene.anims.generateFrameNumbers(`player-${sprite}`, {
            start: row * 3 + (type === 'idle' ? 1 : 0),
            end:   row * 3 + (type === 'idle' ? 1 : 2),
          }),
          frameRate: type === 'walk' ? 8 : 2,
          repeat: -1,
        });
      });
    });
  }

  update(cursors, wasd) {
    const speed  = 80;
    let vx = 0, vy = 0;
    const sprite = this.scene.registry.get('sprite') || 'wizard-m';

    if (cursors.left.isDown  || wasd.A.isDown) { vx = -speed; this.facing = 'left';  }
    if (cursors.right.isDown || wasd.D.isDown) { vx =  speed; this.facing = 'right'; }
    if (cursors.up.isDown    || wasd.W.isDown) { vy = -speed; this.facing = 'up';    }
    if (cursors.down.isDown  || wasd.S.isDown) { vy =  speed; this.facing = 'down';  }

    this.sprite.setVelocity(vx, vy);

    const anim = (vx || vy)
      ? `${sprite}-walk-${this.facing}`
      : `${sprite}-idle-${this.facing}`;

    if (this.sprite.anims.currentAnim?.key !== anim) {
      this.sprite.play(anim, true);
    }
  }
}
