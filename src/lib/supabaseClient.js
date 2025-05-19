
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmaaxboltyjpzzljtogm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYWF4Ym9sdHlqcHp6bGp0b2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyODM5ODksImV4cCI6MjA2Mjg1OTk4OX0.mGkaLcPPooXb8SQ63effGQkHpj43SzoJqhTxephRTPA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
