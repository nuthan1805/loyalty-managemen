import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhegtiebgfqoinzdhsvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZWd0aWViZ2Zxb2luemRoc3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NjU3OTIsImV4cCI6MjAzMTI0MTc5Mn0.P0IvuDsM8Wp0VGW8Oe2W97alkm7pwnJHdrfTJlcfZCE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
