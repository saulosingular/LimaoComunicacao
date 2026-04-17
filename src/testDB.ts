import { supabaseBrowser } from '@/shared/lib/supabase/client';

export async function testDB() {
  const { data, error } = await supabaseBrowser.from('clientes').insert({nome: 'test', whatsapp: '123'}).select();
  console.log(data, error);
}
