export const GAME_W    = 960;
export const GAME_H    = 600;
export const TILE_SIZE = 16;

export const DEFAULT_STATE = {
  playerName:   'HERO',
  sprite:       'wizard-m',
  visualClass:  'Mago',
  stack:        'java',
  stackName:    'Java',
  stackIcon:    '☕',
  framework:    'spring-boot',
  frameworkName:'Spring Boot',

  hp: 100, maxHp: 100,
  xp: 0,   xpNext: 100,
  int: 10, def: 5, luck: 5,
  titleIndex: 0,

  currentDistrict:    0,
  districtsUnlocked:  [0],
  districtsDone:      [],
};

export const TITLES = [
  '🟢 Estagiário',
  '🔵 Júnior',
  '🟣 Pleno',
  '🟠 Sênior',
  '🔴 Arquiteto',
];
