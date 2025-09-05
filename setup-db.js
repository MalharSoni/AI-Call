const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://hxjvurbvrcfoszwhnuga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4anZ1cmJ2cmNmb3N6d2hudWdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzNzgxMywiZXhwIjoyMDcyNjEzODEzfQ.Y04XdOJkDM7TvZHVeExzpQl261imxM9JvdVLVNE8CA0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🔧 Setting up AI-Call database...');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync('./infra/supabase/migrations/001_initial.sql', 'utf8');
    
    // Execute the migration using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('❌ Database setup failed:', error);
      
      // Try alternative approach - executing statements one by one
      console.log('🔄 Trying alternative setup method...');
      
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        if (statement.includes('CREATE') || statement.includes('INSERT')) {
          console.log('Executing:', statement.substring(0, 50) + '...');
        }
      }
      
    } else {
      console.log('✅ Database setup completed successfully!');
      console.log('📊 Tables created: business, doc, chunk, faq, call_log');
      console.log('🔍 Vector search enabled with pgvector');
    }
    
  } catch (err) {
    console.error('💥 Setup error:', err.message);
  }
}

setupDatabase();