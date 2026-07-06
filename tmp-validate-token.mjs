import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const client = createClient(url, anonKey);
const email = 'apitest1783341430050@example.com';
const password = 'Password1!';
const signIn = await client.auth.signInWithPassword({ email, password });
console.log('signIn error', JSON.stringify(signIn.error));
console.log('session access token', signIn.data.session?.access_token);
const token = signIn.data.session?.access_token;
if (!token) throw new Error('No token');
const userResult = await client.auth.getUser(token);
console.log('getUser error', JSON.stringify(userResult.error));
console.log('getUser data', JSON.stringify(userResult.data, null, 2));
