-- Seed default user and data (id is looked up by email to avoid duplicates)
insert into users (email, password)
values ('usuario@exemplo.com', 'password')
on conflict (email) do update set email = excluded.email;

-- Ensure stats row exists
insert into user_stats (user_id, total_games, total_correct, total_wrong, best_streak, total_score)
select id, 15, 42, 18, 8, 1250
from users
where email = 'usuario@exemplo.com'
on conflict (user_id) do nothing;

-- Seed subjects
insert into subjects (name, description, user_id)
select 'Matemática', 'Conceitos fundamentais de matemática', u.id from users u where u.email = 'usuario@exemplo.com'
on conflict do nothing;

insert into subjects (name, description, user_id)
select 'História', 'Eventos históricos importantes', u.id from users u where u.email = 'usuario@exemplo.com'
on conflict do nothing;

insert into subjects (name, description, user_id)
select 'Programação', 'Conceitos de desenvolvimento de software', u.id from users u where u.email = 'usuario@exemplo.com'
on conflict do nothing;

-- Seed cards using the inserted subjects
-- Matemática
insert into cards (title, content, difficulty, subject_id, user_id)
select
  'Teorema de Pitágoras',
  'Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos. A fórmula é a² + b² = c², onde c é a hipotenusa e a e b são os catetos.',
  2,
  s.id,
  u.id
from subjects s
join users u on u.email = 'usuario@exemplo.com'
where s.name = 'Matemática'
on conflict do nothing;

insert into cards (title, content, difficulty, subject_id, user_id)
select
  'Equação do Segundo Grau',
  'Uma equação do segundo grau tem a forma ax² + bx + c = 0, onde a ≠ 0. Suas raízes podem ser encontradas usando a fórmula de Bhaskara: x = (-b ± √(b²-4ac)) / 2a.',
  4,
  s.id, u.id
from subjects s
join users u on u.email = 'usuario@exemplo.com'
where s.name = 'Matemática'
on conflict do nothing;

-- História
insert into cards (title, content, difficulty, subject_id, user_id)
select
  'Revolução Francesa',
  'A Revolução Francesa foi um período de mudança política e social radical na França que durou de 1789 a 1799. Começou com a convocação dos Estados Gerais e terminou com o golpe de Napoleão Bonaparte.',
  3,
  s.id, u.id
from subjects s
join users u on u.email = 'usuario@exemplo.com'
where s.name = 'História'
on conflict do nothing;

insert into cards (title, content, difficulty, subject_id, user_id)
select
  'Segunda Guerra Mundial',
  'A Segunda Guerra Mundial foi um conflito militar global que durou de 1939 a 1945. Envolveu a maioria das nações do mundo e foi marcada pelo Holocausto e pelo uso de armas nucleares.',
  3,
  s.id, u.id
from subjects s
join users u on u.email = 'usuario@exemplo.com'
where s.name = 'História'
on conflict do nothing;

-- Programação
insert into cards (title, content, difficulty, subject_id, user_id)
select
  'Função JavaScript',
  'Uma função em JavaScript é um bloco de código projetado para executar uma tarefa específica. É definida com a palavra-chave function, seguida por um nome, parênteses () e chaves {}.',
  1,
  s.id, u.id
from subjects s
join users u on u.email = 'usuario@exemplo.com'
where s.name = 'Programação'
on conflict do nothing;

insert into cards (title, content, difficulty, subject_id, user_id)
select
  'React Hooks',
  'Hooks são funções que permitem usar estado e outras funcionalidades do React em componentes funcionais. Os hooks mais comuns são useState para gerenciar estado e useEffect para efeitos colaterais.',
  3,
  s.id, u.id
from subjects s
join users u on u.email = 'usuario@exemplo.com'
where s.name = 'Programação'
on conflict do nothing;
