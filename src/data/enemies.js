export const ENEMIES = {
  'bug-simple': {
    name: 'Bug Simples', icon: '🐛', hp: 60,
    description: 'Um bug comum. Fácil de derrotar com conhecimento básico.',
  },
  'bug-mutant': {
    name: 'Bug Mutante', icon: '🐞', hp: 80,
    description: 'Evoluiu após sobreviver a vários patches.',
  },
  'null-pointer-rex': {
    name: 'NullPointer Rex', icon: '☠️', hp: 120,
    description: 'O terrível NullPointerException em forma física.',
    boss: true,
  },
  'the-undefined': {
    name: 'The Undefined', icon: '👾', hp: 100,
    description: 'Existe entre existir e não existir. Perigoso com o tempo.',
    boss: true,
  },
  'the-deadlock': {
    name: 'The Deadlock', icon: '🦑', hp: 110,
    description: 'Congela o tempo. Aguarda eternamente — e você também.',
    boss: true,
  },
  'merge-hydra': {
    name: 'Merge Conflict Hydra', icon: '🐉', hp: 130,
    description: 'Cada branch mal resolvida faz crescer uma nova cabeça.',
    boss: true,
  },
  '404-specter': {
    name: 'The 404 Specter', icon: '👻', hp: 100,
    description: 'Não existe, mas de alguma forma ainda causa erros.',
    boss: true,
  },
  'cors-daemon': {
    name: 'CORS Daemon', icon: '😈', hp: 105,
    description: 'Bloqueia qualquer requisição sem permissão adequada.',
    boss: true,
  },
  'rate-titan': {
    name: 'Rate Limit Titan', icon: '🤖', hp: 115,
    description: 'Você só pode atacá-lo N vezes por segundo.',
    boss: true,
  },
  'spaghetti': {
    name: 'The Spaghetti Monster', icon: '🍝', hp: 120,
    description: 'Código sem arquitetura ganhou vida. Impossível de entender.',
    boss: true,
  },
  'image-not-found': {
    name: 'Image Not Found', icon: '🐳', hp: 100,
    description: 'O container não sobe. A imagem nunca foi buildada.',
    boss: true,
  },
  'schema-dragon': {
    name: 'Schema Dragon', icon: '🐲', hp: 120,
    description: 'Exige schema rígido num banco schema-less.',
    boss: true,
  },
  'code-smell': {
    name: 'The Code Smell', icon: '🦨', hp: 90,
    description: 'Métodos de 500 linhas. Variáveis tipo "x2". Indescritível.',
    boss: true,
  },
  'flakey-test': {
    name: 'The Flakey Test', icon: '🧪', hp: 95,
    description: 'Passa 7 de cada 10 vezes. Ninguém sabe por quê.',
    boss: true,
  },
  'anti-pattern': {
    name: 'The Anti-Pattern', icon: '🎭', hp: 110,
    description: 'Usa Singleton para tudo. God Object. Service Locator.',
    boss: true,
  },
  'memory-leak': {
    name: 'Memory Leak Demon', icon: '🧟', hp: 125,
    description: 'Consome RAM infinitamente até o servidor morrer.',
    boss: true,
  },
  'the-outage': {
    name: 'The Outage', icon: '⛈️', hp: 130,
    description: 'A produção caiu. Pagerduty dispara. Todos acordam às 3h.',
    boss: true,
  },
  'legacy-monolith': {
    name: 'The Legacy Monolith', icon: '🗿', hp: 150,
    description: 'Código de 2003. Sem testes. Deploy manual via FTP.',
    boss: true,
  },
};
