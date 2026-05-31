import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase ortam degiskenleri eksik. REACT_APP_SUPABASE_URL ve REACT_APP_SUPABASE_PUBLISHABLE_KEY degerlerini tanimlayin.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
