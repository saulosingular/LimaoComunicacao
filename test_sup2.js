const SUPABASE_URL = 'https://ewlzljlapixkmzuaxgit.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bHpsamxhcGl4a216dWF4Z2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDI4NjksImV4cCI6MjA4ODExODg2OX0.CY0o58ZQOJsB4_CuvES7MwmE5KVhsBMOPGUO3VRfTFI';

const query = new URLSearchParams({
  select: '*,secoes:template_secoes(*,campos:template_campos(*,opcoes_lista:template_campo_opcoes(*))),template_addons!template_id(addon_id)',
  'ativo': 'eq.true',
  'order': 'nome.asc',
  'secoes.order': 'ordem.asc',
  'secoes.campos.order': 'ordem.asc',
  'secoes.campos.opcoes_lista.order': 'ordem.asc'
});

fetch(`${SUPABASE_URL}/rest/v1/templates?${query.toString()}`, {
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`
  }
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(console.log)
.catch(console.error);
