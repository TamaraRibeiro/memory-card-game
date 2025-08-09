-- Enable UUID generation (pgcrypto)
create extension if not exists pgcrypto;

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text,
  created_at timestamptz not null default now()
);

-- Subjects
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cards
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  difficulty int not null check (difficulty between 1 and 5),
  subject_id uuid not null references subjects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Game Sessions
create table if not exists game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  total_cards int not null,
  time_per_card int,
  score int not null default 0,
  correct_answers int not null default 0,
  wrong_answers int not null default 0,
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

-- User Stats
create table if not exists user_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id) on delete cascade,
  total_games int not null default 0,
  total_correct int not null default 0,
  total_wrong int not null default 0,
  best_streak int not null default 0,
  total_score int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_subjects_user_id on subjects(user_id);
create index if not exists idx_cards_user_id on cards(user_id);
create index if not exists idx_cards_subject_id on cards(subject_id);
create index if not exists idx_game_sessions_user_id on game_sessions(user_id);
create index if not exists idx_user_stats_total_score on user_stats(total_score desc);
