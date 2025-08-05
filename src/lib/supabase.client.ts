import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建并导出一个单例的 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)