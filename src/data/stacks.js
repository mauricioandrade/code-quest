export const STACKS = [
  { id: 'java',       icon: '☕', name: 'Java',       title: 'O Arquiteto',    bonus: { int: 2, def: 3, luck: 0 }, frameworks: ['spring-boot', 'quarkus'] },
  { id: 'python',     icon: '🐍', name: 'Python',     title: 'O Cientista',    bonus: { int: 4, def: 0, luck: 1 }, frameworks: ['django', 'flask', 'fastapi'] },
  { id: 'javascript', icon: '⚡', name: 'JavaScript', title: 'O Fullstack',    bonus: { int: 2, def: 0, luck: 3 }, frameworks: ['nestjs', 'express'] },
  { id: 'csharp',     icon: '🔷', name: 'C#',         title: 'O Engenheiro',   bonus: { int: 2, def: 3, luck: 0 }, frameworks: ['aspnet'] },
  { id: 'ruby',       icon: '💎', name: 'Ruby',       title: 'O Artesão',      bonus: { int: 3, def: 0, luck: 2 }, frameworks: ['rails'] },
  { id: 'go',         icon: '🔵', name: 'Go',         title: 'O Minimalista',  bonus: { int: 1, def: 2, luck: 2 }, frameworks: ['gin'] },
  { id: 'php',        icon: '🐘', name: 'PHP',        title: 'O Veterano Web', bonus: { int: 1, def: 2, luck: 2 }, frameworks: ['laravel', 'symfony'] },
  { id: 'cpp',        icon: '⚙️', name: 'C++',        title: 'O Veterano',     bonus: { int: 3, def: 2, luck: 0 }, frameworks: [] },
];

export const FRAMEWORKS = {
  'spring-boot': { id: 'spring-boot', icon: '🍃', name: 'Spring Boot',   stack: 'java'       },
  'quarkus':     { id: 'quarkus',     icon: '⚡', name: 'Quarkus',       stack: 'java'       },
  'django':      { id: 'django',      icon: '🎸', name: 'Django',        stack: 'python'     },
  'flask':       { id: 'flask',       icon: '🧪', name: 'Flask',         stack: 'python'     },
  'fastapi':     { id: 'fastapi',     icon: '🚀', name: 'FastAPI',       stack: 'python'     },
  'nestjs':      { id: 'nestjs',      icon: '🐱', name: 'NestJS',        stack: 'javascript' },
  'express':     { id: 'express',     icon: '📦', name: 'Express',       stack: 'javascript' },
  'aspnet':      { id: 'aspnet',      icon: '🔷', name: 'ASP.NET',       stack: 'csharp'     },
  'rails':       { id: 'rails',       icon: '💎', name: 'Ruby on Rails', stack: 'ruby'       },
  'gin':         { id: 'gin',         icon: '🍸', name: 'Gin',           stack: 'go'         },
  'laravel':     { id: 'laravel',     icon: '🔴', name: 'Laravel',       stack: 'php'        },
  'symfony':     { id: 'symfony',     icon: '🟤', name: 'Symfony',       stack: 'php'        },
};

export const VISUALS = {
  'wizard-m':  { label: 'Mago',      class: 'Mago',      bonus: { int: 3, def: 0 } },
  'wizard-f':  { label: 'Maga',      class: 'Maga',      bonus: { int: 3, def: 0 } },
  'warrior-m': { label: 'Guerreiro', class: 'Guerreiro', bonus: { int: 0, def: 3 } },
  'warrior-f': { label: 'Guerreira', class: 'Guerreira', bonus: { int: 0, def: 3 } },
};
