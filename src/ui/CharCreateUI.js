// Utilitários de UI para CharCreateScene
export function makeCard(scene, x, y, w, h, color = 0x1a1a3e) {
  return scene.add.rectangle(x + w / 2, y + h / 2, w, h, color)
    .setStrokeStyle(2, 0x333366)
    .setInteractive({ useHandCursor: true });
}

export function makeLabel(scene, x, y, text, size = 9, color = '#c4a8f5') {
  return scene.add.text(x, y, text, {
    fontFamily: '"Press Start 2P"', fontSize: size, color,
  }).setOrigin(0.5);
}

export function makeButton(scene, x, y, label, callback, bgColor = '#1ecdb4') {
  const btn = scene.add.text(x, y, label, {
    fontFamily: '"Press Start 2P"', fontSize: 12, color: '#0d0d1a',
    backgroundColor: bgColor, padding: { x: 20, y: 12 },
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });

  btn.on('pointerover',  () => btn.setAlpha(0.8));
  btn.on('pointerout',   () => btn.setAlpha(1));
  btn.on('pointerdown',  callback);

  return btn;
}

export function animateIn(scene, targets) {
  scene.tweens.add({
    targets, alpha: 1, x: '-=40', duration: 200,
    from: { alpha: 0 },
  });
}

export function animateOut(scene, targets, onComplete) {
  scene.tweens.add({
    targets, alpha: 0, x: '-=40', duration: 200,
    onComplete,
  });
}
