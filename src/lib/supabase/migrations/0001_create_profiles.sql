-- Create a table for public profiles
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text,
    avatar_url text,
    user_id uuid references auth.users not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = user_id );

-- Create indexes
create index profiles_user_id_idx on public.profiles(user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, user_id)
    values (new.id, new.id);
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 