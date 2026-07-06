import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error(`Missing url or service role key: ${url}, ${!!serviceKey}`);
}
const admin = createClient(url, serviceKey);
const email = `apitest${Date.now()}@example.com`;
const password = "Password1!";
console.log("Creating user", email);
const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
console.log("createUser error", error);
console.log("data", JSON.stringify(data, null, 2));
