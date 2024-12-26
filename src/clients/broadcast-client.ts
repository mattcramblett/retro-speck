import { createClient } from '@supabase/supabase-js';

export function makeBroadcastClient() {
  const url = process.env.supabasePublicUrl;
  const key = process.env.supabaseKey;
  if (!url) throw "supabase public url not defined!"
  if (!key) throw "supabase key not defined!"

  return createClient(url, key);
}
