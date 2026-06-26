export const ParticleSystem = {
  burst(scene, x, y, tint = 0xffffff, count = 20) {
    if (!scene.textures.exists('pixel')) return;
    const emitter = scene.add.particles(x, y, 'pixel', {
      speed:    { min: 80, max: 200 },
      angle:    { min: 0, max: 360 },
      scale:    { start: 1.5, end: 0 },
      tint,
      lifespan: 600,
      quantity: count,
      emitting: false,
    });
    emitter.explode(count);
    scene.time.delayedCall(800, () => emitter.destroy());
  },

  streak(scene, x, y) {
    if (!scene.textures.exists('pixel')) return;
    const emitter = scene.add.particles(x, y, 'pixel', {
      speed:    { min: 20, max: 60 },
      angle:    { min: -30, max: 30 },
      scale:    { start: 1, end: 0 },
      tint:     0xffaa00,
      lifespan: 400,
      quantity: 8,
      emitting: false,
    });
    emitter.explode(8);
    scene.time.delayedCall(600, () => emitter.destroy());
  },

  levelUp(scene, x, y) {
    if (!scene.textures.exists('pixel')) return;
    const colors = [0xffdd00, 0x1ecdb4, 0xc4a8f5, 0xff5555];
    colors.forEach((tint, i) => {
      scene.time.delayedCall(i * 80, () => {
        const emitter = scene.add.particles(x, y, 'pixel', {
          speed:    { min: 100, max: 300 },
          angle:    { min: 0, max: 360 },
          scale:    { start: 2, end: 0 },
          tint,
          lifespan: 800,
          quantity: 15,
          emitting: false,
        });
        emitter.explode(15);
        scene.time.delayedCall(1000, () => emitter.destroy());
      });
    });
  },
};
