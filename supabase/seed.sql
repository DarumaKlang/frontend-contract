-- Demo seed data for local development
-- Insert a sample contract for the first user created via Supabase Auth.
-- Replace the user_id below with the actual UUID from your auth.users record if needed.

insert into public.contracts (user_id, title, data, html)
values (
  '00000000-0000-0000-0000-000000000000',
  'Sample Lease Agreement',
  '{"sellerName":"Demo Landlord","buyerName":"Demo Tenant","productName":"Studio Unit","unitPrice":35000,"depositAmount":70000}',
  '<div><h1>Sample Lease Agreement</h1><p>This is a sample contract seeded for development.</p></div>'
)
on conflict do nothing;