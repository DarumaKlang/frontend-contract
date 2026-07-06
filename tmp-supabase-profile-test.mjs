import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";
const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
const sv=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!sv){ throw new Error('missing env'); }
const admin=createClient(url, sv);
const userId='ea983073-74ca-4107-88cf-52d79c31606a';
const profile = await admin.from('user_profiles').select('*').eq('user_id', userId).maybeSingle();
console.log('READ', JSON.stringify(profile, null,2));
const upsert = await admin.from('user_profiles').upsert({ user_id:userId, frequent_profile_data:{ print_usage:{ month:'2026-07', used:1}} }, { onConflict:'user_id' }).select('*').single();
console.log('UPSERT', JSON.stringify(upsert, null,2));
