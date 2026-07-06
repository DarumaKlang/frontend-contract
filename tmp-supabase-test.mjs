import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });
import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log('url', url);
const supabase = createClient(url, key);
for (const [email, password] of [['admin@Nuc7.com','Admin@5577'], ['test@example.com','Password1!'], ['user@example.com','Password1!']]) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log('TRY', email, 'ERROR', JSON.stringify(error), 'DATA', JSON.stringify(data));
}
