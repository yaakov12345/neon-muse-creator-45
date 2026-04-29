-- Ensure project-images bucket exists and is private
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop any existing permissive policies for this bucket (safe if not present)
DROP POLICY IF EXISTS "Users access own project images" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own project images" ON storage.objects;
DROP POLICY IF EXISTS "Users update own project images" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own project images" ON storage.objects;

-- Per-user folder access: filename must start with "<user_id>/..."
CREATE POLICY "Users access own project images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users upload own project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users update own project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users delete own project images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Explicitly deny privilege escalation on user_roles for non-admins
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));