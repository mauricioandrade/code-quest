import { QUESTIONS } from '../data/questions/index.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestionsForBattle(districtId, playerStack, count = 5) {
  const moduleKey = `module_${districtId + 1}`;

  const general  = QUESTIONS.general?.[moduleKey]  || [];
  const specific = QUESTIONS[playerStack]?.[moduleKey] || [];

  let pool;
  if (specific.length > 0) {
    // 60% geral + 40% específica, mínimo 1 específica
    const genCount = Math.max(1, Math.floor(count * 0.6));
    const specCount = count - genCount;
    pool = [
      ...shuffle(general).slice(0, genCount),
      ...shuffle(specific).slice(0, specCount),
    ];
  } else {
    pool = [...general];
  }

  return shuffle(pool).slice(0, count);
}
