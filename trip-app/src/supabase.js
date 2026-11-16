import { createClient } from '@supabase/supabase-js'

// family 玩樂網站專用 Supabase 專案(「教育與玩樂網站」,與功課網共用)。
// anon 公開金鑰本來就設計給前端用，真正權限由資料庫 RLS 控制（非 service_role）。
const SUPABASE_URL = 'https://nikijysochwdfcqscgby.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2lqeXNvY2h3ZGZjcXNjZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MzQ2MTYsImV4cCI6MjEwODExMDYxNn0.1QDaEfWr9HgI5_jd_SGSca9m95arRFcYi22Xtacb_5s'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
})
