import { createClient } from '@supabase/supabase-js'

// Supabase configuration - Ready to use!
const supabaseUrl = 'https://rtxmkjzhbwfqvpwlqmyx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eG1ranpoYndmcXZwd2xxbXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDU4NjMsImV4cCI6MjA0NzAyMTg2M30.5N8vC8VdY6cQE9xGHl2qmAzJ3pRt0eK4L5nM7wXyB9I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize database table if it doesn't exist
export const initializeDatabase = async () => {
  try {
    // Check if table exists by trying to select from it
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .limit(1);
      
    if (error && error.code === '42P01') {
      console.log('Table does not exist yet - will be created via Supabase dashboard');
    }
    
    return true;
  } catch (err) {
    console.log('Database initialization check:', err.message);
    return true;
  }
};