CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_messages_select_public" ON public.contact_messages;
CREATE POLICY "contact_messages_select_public"
ON public.contact_messages
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "contact_messages_insert_public" ON public.contact_messages;
CREATE POLICY "contact_messages_insert_public"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "consultations_select_public" ON public.consultations;
CREATE POLICY "consultations_select_public"
ON public.consultations
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "consultations_insert_public" ON public.consultations;
CREATE POLICY "consultations_insert_public"
ON public.consultations
FOR INSERT
WITH CHECK (true);
