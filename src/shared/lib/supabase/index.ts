/**
 * Barrel de exports do módulo Supabase — APENAS client-side.
 *
 * Uso correto:
 *   Client Components → import { supabaseBrowser } from '@/shared/lib/supabase'
 */

// ✅ Seguro para Client Components
export { supabaseBrowser, createSupabaseBrowserClient } from './client';
