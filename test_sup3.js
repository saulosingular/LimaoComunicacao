const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://ewlzljlapixkmzuaxgit.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bHpsamxhcGl4a216dWF4Z2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDI4NjksImV4cCI6MjA4ODExODg2OX0.CY0o58ZQOJsB4_CuvES7MwmE5KVhsBMOPGUO3VRfTFI';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function test1() {
  const { data, error } = await supabase
    .from('templates')
    .select(`
      *,
      secoes:template_secoes (
        *,
        campos:template_campos (
          *,
          opcoes_lista:template_campo_opcoes ( * )
        )
      ),
      template_addons!template_id ( addon_id )
    `)
    .eq('ativo', true)
    .order('nome', { ascending: true })
    .order('ordem', { referencedTable: 'secoes', ascending: true })
    .order('ordem', { referencedTable: 'secoes.campos', ascending: true })
    .order('ordem', { referencedTable: 'secoes.campos.opcoes_lista', ascending: true });

  if (error) console.error('Test 1 failed:', error);
  else console.log('Test 1 succeeded, count:', data.length);
}

async function test2() {
  const { data, error } = await supabase
    .from('templates')
    .select(`
      *,
      secoes:template_secoes (
        *,
        campos:template_campos (
          *,
          opcoes_lista:template_campo_opcoes ( * )
        )
      ),
      template_addons!template_id ( addon_id )
    `)
    .eq('ativo', true)
    .order('nome', { ascending: true })
    .order('ordem', { referencedTable: 'secoes', ascending: true })
    .order('ordem', { foreignTable: 'secoes.campos', ascending: true }) // sometimes it's foreignTable
    .order('ordem', { foreignTable: 'secoes.campos.opcoes_lista', ascending: true });

  if (error) console.error('Test 2 failed:', error);
  else console.log('Test 2 succeeded, count:', data.length);
}

test1().then(test2);
