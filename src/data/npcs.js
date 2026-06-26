export const NPCS = {
  'von-stack': { name: 'Prof. Von Stack', icon: '🧑‍🏫', spriteKey: 'von-stack' },
  'lady-rest': { name: 'Lady REST',       icon: '👩‍💻', spriteKey: 'lady-rest'  },
};

// Diálogos por NPC — { text, actions? }
export const DIALOGUES = {
  'von-stack': [
    {
      text: 'Bem-vindo a Compile City, jovem desenvolvedor! Eu sou o Prof. Von Stack, guardião do conhecimento desta cidade.',
    },
    {
      text: 'Os BUGs invadiram nossos sistemas! Apenas respondendo perguntas de programação você poderá derrotá-los.',
    },
    {
      text: 'Cada acerto causa dano ao inimigo. Respostas em sequência criam STREAK — e dobram o dano! Boa sorte!',
      actions: [
        { label: '⚔ BATALHAR', type: 'battle' },
        { label: '✖ FECHAR',   type: 'close'  },
      ],
    },
  ],
  'lady-rest': [
    {
      text: 'Olá! Sou Lady REST. Cuido das APIs deste bairro.',
    },
    {
      text: 'Os BUGs estão corrompendo os endpoints. Você consegue limpá-los?',
      actions: [
        { label: '⚔ BATALHAR', type: 'battle' },
        { label: '✖ FECHAR',   type: 'close'  },
      ],
    },
  ],
  'default': [
    {
      text: 'Os BUGs de Compile City precisam ser derrotados! Vamos batalhar?',
      actions: [
        { label: '⚔ BATALHAR', type: 'battle' },
        { label: '✖ FECHAR',   type: 'close'  },
      ],
    },
  ],
  'bug-simple': [
    {
      text: '...bzzzt... ERRO 500... bzzzt...',
      actions: [
        { label: '⚔ BATALHAR', type: 'battle' },
        { label: '✗ FUGIR',    type: 'close'  },
      ],
    },
  ],
};
