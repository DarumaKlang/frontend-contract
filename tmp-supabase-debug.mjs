import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });
import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) throw new Error('Missing env');
const client = createClient(url, anonKey);
const email = `apitest${Date.now()}@example.com`;
const password = 'Password1!';
console.log('email', email);
const signUp = await client.auth.signUp({ email, password });
console.log('signUp error', signUp.error);
console.log('signUp data', JSON.stringify(signUp.data, null, 2));
// If signUp returns session, use it; else sign in
let token = signUp.data.session?.access_token;
if (!token) {
  const signIn = await client.auth.signInWithPassword({ email, password });
  console.log('signIn error', signIn.error);
  console.log('signIn data', JSON.stringify(signIn.data, null, 2));
  token = signIn.data.session?.access_token;
}
console.log('token', token);
if (!token) throw new Error('No token');
const user = await client.auth.getUser(token);
console.log('getUser error', user.error);
console.log('getUser data', JSON.stringify(user.data, null, 2));
