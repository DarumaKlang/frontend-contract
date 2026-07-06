import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });
import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  throw new Error('Missing env values');
}
const admin = createClient(url, serviceKey);
const email = `apitest-${Date.now()}@example.com`;
const password = 'Password1!';
console.log('Creating user', email);
const createResult = await admin.auth.admin.createUser({ email, password, email_confirm: true });
console.log('create error:', createResult.error);
console.log('create user id:', createResult.data?.user?.id);
const client = createClient(url, anonKey);
const signIn = await client.auth.signInWithPassword({ email, password });
console.log('signIn error:', signIn.error);
console.log('session:', JSON.stringify(signIn.data?.session, null, 2));
