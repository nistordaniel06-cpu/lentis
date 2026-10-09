-- LENTIS dedicated project migration. Run ONLY on database chosen for Lentis.
-- SQL editor: create auth user via Supabase Auth first; then add their UUID to lentis_admins.
create extension if not exists pgcrypto;
create table if not exists public.lentis_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create or replace function public.is_lentis_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.lentis_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.is_lentis_admin() from public;
grant execute on function public.is_lentis_admin() to authenticated;
create table if not exists public.site_products (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(name) between 2 and 120),
 category text not null check (category in ('vedere','soare','lentile')),
 description text not null default '',
 image_url text not null default '' check (image_url='' or image_url ~ '^https://'),
 price numeric(12,2) not null check (price>=0),
 stock integer not null default 0 check(stock>=0),
 tag text not null default '',
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
 key text primary key check(length(key) between 2 and 90),
 value text not null default '' check(length(value)<=10000),
 updated_at timestamptz not null default now()
);
create table if not exists public.partner_requests (
 id uuid primary key default gen_random_uuid(),
 clinic text not null check(length(clinic) between 2 and 120),
 contact text not null check(length(contact) between 2 and 120),
 email text not null check(length(email)<=200),
 city text not null check(length(city) between 2 and 120),
 status text not null default 'new' check(status in ('new','contacted','approved','rejected')),
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create table if not exists public.analytics_events (
 id bigint generated always as identity primary key,
 session_hash text not null check(length(session_hash)<=100),
 country text not null default 'Unknown',
 page text not null default '/',
 created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists partner_requests_created_idx on public.partner_requests(created_at desc);
create table if not exists public.lentis_audit_log (
 id bigint generated always as identity primary key,
 actor uuid,
 table_name text not null,
 record_id text,
 action text not null,
 created_at timestamptz not null default now()
);
create or replace function public.lentis_set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end;$$;
drop trigger if exists product_updated_at on public.site_products;
create trigger product_updated_at before update on public.site_products for each row execute function public.lentis_set_updated_at();
drop trigger if exists setting_updated_at on public.site_settings;
create trigger setting_updated_at before update on public.site_settings for each row execute function public.lentis_set_updated_at();
create or replace function public.lentis_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.lentis_audit_log(actor,table_name,record_id,action) values(auth.uid(),TG_TABLE_NAME,coalesce(new.id::text,old.id::text),TG_OP);return coalesce(new,old);end;$$;
-- Audit log on products. Site settings use a separate function as settings primary key is 'key'.
drop trigger if exists product_audit on public.site_products;
create trigger product_audit after insert or update or delete on public.site_products for each row execute function public.lentis_audit();
create or replace function public.lentis_setting_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.lentis_audit_log(actor,table_name,record_id,action) values(auth.uid(),TG_TABLE_NAME,coalesce(new.key,old.key),TG_OP);return coalesce(new,old);end;$$;
drop trigger if exists settings_audit on public.site_settings;
create trigger settings_audit after insert or update or delete on public.site_settings for each row execute function public.lentis_setting_audit();
alter table public.lentis_admins enable row level security;
alter table public.site_products enable row level security;
alter table public.site_settings enable row level security;
alter table public.partner_requests enable row level security;
alter table public.analytics_events enable row level security;
alter table public.lentis_audit_log enable row level security;
create policy "admin reads own membership" on public.lentis_admins for select to authenticated using (user_id=auth.uid());
create policy "published products publicly visible" on public.site_products for select to anon,authenticated using (published or public.is_lentis_admin());
create policy "admins manage products" on public.site_products for all to authenticated using (public.is_lentis_admin()) with check (public.is_lentis_admin());
create policy "settings public read" on public.site_settings for select to anon,authenticated using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.is_lentis_admin()) with check (public.is_lentis_admin());
create policy "admins read and manage requests" on public.partner_requests for all to authenticated using (public.is_lentis_admin()) with check (public.is_lentis_admin());
create policy "admins read analytics" on public.analytics_events for select to authenticated using (public.is_lentis_admin());
create policy "admins read audit" on public.lentis_audit_log for select to authenticated using (public.is_lentis_admin());
-- Anonymous users cannot read partner inquiries, analytics logs, or edit content.
-- Partner requests + analytics inserts are handled by server-only service-role key, not from the browser.
-- Suggested cleanup policy (create as cron job in production): delete analytics older than 90 days.
-- Bootstrap example AFTER manually creating a user in Authentication > Users:
-- insert into public.lentis_admins(user_id) values('YOUR_SUPABASE_AUTH_USER_UUID');