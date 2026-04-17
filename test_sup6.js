const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://ewlzljlapixkmzuaxgit.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bHpsamxhcGl4a216dWF4Z2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDI4NjksImV4cCI6MjA4ODExODg2OX0.CY0o58ZQOJsB4_CuvES7MwmE5KVhsBMOPGUO3VRfTFI';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function checkTriggers() {
  const { data, error } = await supabase.from('templates').select('*').limit(1);
  console.log(data, error);
}

checkTriggers();
