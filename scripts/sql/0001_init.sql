-- Enable UUID generator
create extension if not exists "pgcrypto";

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
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
create index if not exists idx_subjects_user on subjects(user_id);

-- Cards
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  difficulty smallint not null check (difficulty between 1 and 5),
  subject_id uuid not null references subjects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_cards_user on cards(user_id);
create index if not exists idx_cards_subject on cards(subject_id);

-- Game sessions (summary per session)
create table if not exists game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  total_cards integer not null,
  time_per_card integer,
  score integer not null default 0,
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  completed boolean not null default true,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_game_sessions_user on game_sessions(user_id);

-- Aggregated user stats (one row per user)
create table if not exists user_stats (
  user_id uuid primary key references users(id) on delete cascade,
  total_games integer not null default 0,
  total_correct integer not null default 0,
  total_wrong integer not null default 0,
  best_streak integer not null default 0,
  total_score integer not null default 0,
  updated_at timestamptz not null default now()
);
