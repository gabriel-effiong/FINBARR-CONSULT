import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://zbmuvcegrtdhlwthhtaa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXV2Y2VncnRkaGx3dGhodGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDM3MDEsImV4cCI6MjA5NTU3OTcwMX0.US3YMlrdgPh2e0Z-vY2jq8pSoOZiiIvYTW9XgVhh2R4";

export const supabase = createClient(supabaseUrl, supabaseKey);
