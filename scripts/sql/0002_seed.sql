-- Optional seed user and data
insert into users (email)
values ('usuario@exemplo.com')
on conflict (email) do nothing;

-- Link to user id variable
with u as (
  select id from users where email = 'usuario@exemplo.com' limit 1
)
insert into subjects (name, description, user_id)
select s.name, s.description, u.id
from u,
lateral (values
  ('Matemática', 'Conceitos fundamentais de matemática'),
  ('História', 'Eventos históricos importantes'),
  ('Programação', 'Conceitos de desenvolvimento de software')
) as s(name, description)
on conflict do nothing;

-- Insert some cards for each subject if none exist
with u as (select id from users where email = 'usuario@exemplo.com' limit 1),
m as (select id from subjects where name='Matemática' limit 1),
h as (select id from subjects where name='História' limit 1),
p as (select id from subjects where name='Programação' limit 1)
insert into cards (title, content, difficulty, subject_id, user_id)
select x.title, x.content, x.difficulty, x.subject_id, x.user_id
from (
  select 'Teorema de Pitágoras' as title,
         'Em um triângulo retângulo, a² + b² = c²...' as content,
         2 as difficulty,
         (select id from m) as subject_id,
         (select id from u) as user_id
  union all
  select 'Equação do Segundo Grau','Bhaskara: x = (-b ± √(b²-4ac)) / 2a.',4,(select id from m),(select id from u)
  union all
  select 'Revolução Francesa','Período 1789-1799...',3,(select id from h),(select id from u)
  union all
  select 'React Hooks','useState e useEffect...',3,(select id from p),(select id from u)
) x
on conflict do nothing;
