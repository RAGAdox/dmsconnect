import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export default supabaseAdmin;
