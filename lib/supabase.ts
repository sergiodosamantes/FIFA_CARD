import { createClient } from '@supabase/supabase-js'

// Traemos las variables de entorno de tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Exportamos una única instancia del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)