import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dwdzvxghcdxnakaoxxke.supabase.co";
const supabaseKey = "sb_publishable_BZXwzUYSky1HIQhjhpSfBQ_6ja89POfY";

export const supabase = createClient(supabaseUrl, supabaseKey);
