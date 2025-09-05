const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hxjvurbvrcfoszwhnuga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4anZ1cmJ2cmNmb3N6d2hudWdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzNzgxMywiZXhwIjoyMDcyNjEzODEzfQ.Y04XdOJkDM7TvZHVeExzpQl261imxM9JvdVLVNE8CA0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Simple SQL query to test connection
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .limit(1);
    
    if (error) {
      console.error('Connection failed:', error);
      
      // Try a more basic approach
      const { data: data2, error: error2 } = await supabase.auth.getSession();
      console.log('Auth test:', error2 ? 'Failed' : 'Success');
      
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('Can access database tables');
    }
    
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

testConnection();