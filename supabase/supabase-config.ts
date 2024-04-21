import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabaseUrl = process.env.SUPABASE_PROJECT || "";

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

export { supabase };