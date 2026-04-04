import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://totmafmeowdcukohpqza.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdG1hZm1lb3dkY3Vrb2hwcXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyODY3NjQsImV4cCI6MjA5MDg2Mjc2NH0.wmf0Dk8iIBbtIKzApRHHhLZCWhcOQREVooH_dhmBdtQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
