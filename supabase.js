// supabase.js
const supabaseUrl = 'https://tsfpxhabxsaslsmfypypp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZnB4aGFieHNhc2xzbWZ5cHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDM4ODgsImV4cCI6MjA2NDg3OTg4OH0.3Pr6b4voB7VQMTVaTtI0dfMDqpPBC90f1c84n0LwvaU';

window.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);