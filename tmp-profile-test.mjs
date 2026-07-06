import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) throw new Error('Missing Supabase env');
const client = createClient(url, anonKey);
const email = 'apitest1783341430050@example.com';
const password = 'Password1!';
const result = await client.auth.signInWithPassword({ email, password });
if (result.error) {
  console.error('signIn error', result.error);
  process.exit(1);
}
const token = result.data.session?.access_token;
console.log('token=', token);
const fetch = globalThis.fetch;
if (!fetch) throw new Error('fetch unavailable');
const profileUrl = 'http://localhost:3000/api/profile';
const getRes = await fetch(profileUrl, { headers: { Authorization: `Bearer ${token}` } });
console.log('GET', getRes.status, await getRes.text());
const body = JSON.stringify({ frequent_profile_data: { print_usage: { month: '2026-07', used: 1 } } });
const postRes = await fetch(profileUrl, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body });
console.log('POST', postRes.status, await postRes.text());
