-- Demo seed data for local development.
-- This seed only runs when a real Supabase auth user exists.

with first_user as (
  select id
  from auth.users
  order by created_at asc
  limit 1
)
insert into public.contracts (user_id, title, data, html)
select
  first_user.id,
  'Sample Lease Agreement',
  '{"sellerName":"Demo Landlord","buyerName":"Demo Tenant","productName":"Studio Unit","unitPrice":35000,"depositAmount":70000}',
  '<div><h1>Sample Lease Agreement</h1><p>This is a sample contract seeded for development.</p></div>'
from first_user
on conflict do nothing;