-- Create the products table
create table products (
  id text primary key,
  name text not null,
  tagline text,
  price text not null,
  accent text not null,
  type text not null,
  image_url text,
  imported boolean default false
);

-- Create the feedback table
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  product_id text references products(id) on delete cascade not null,
  text text not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  video_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table products enable row level security;
alter table feedback enable row level security;

-- Allow anonymous read access to products
create policy "Allow anonymous read access to products"
  on products for select
  to anon
  using (true);

-- Allow anonymous insert access to products
create policy "Allow anonymous insert access to products"
  on products for insert
  to anon
  with check (true);

-- Allow anonymous read access to feedback
create policy "Allow anonymous read access to feedback"
  on feedback for select
  to anon
  using (true);

-- Allow anonymous insert access to feedback
create policy "Allow anonymous insert access to feedback"
  on feedback for insert
  to anon
  with check (true);
