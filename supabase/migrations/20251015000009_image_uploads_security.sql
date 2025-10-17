-- ========================================
-- IMAGE UPLOADS SECURITY & AUDIT TRAIL
-- Creates tables for image upload monitoring and AI moderation
-- ========================================

-- 1. Create image_uploads table for audit trail
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_hash TEXT NOT NULL,
  file_type TEXT NOT NULL,
  ai_classification JSONB DEFAULT '{}'::jsonb,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  storage_path TEXT,
  public_url TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create image_moderation_logs table for detailed AI results
CREATE TABLE IF NOT EXISTS image_moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES image_uploads(id) ON DELETE CASCADE,
  model_version TEXT,
  confidence_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_time_ms INTEGER,
  server_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create security_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Supabase Storage bucket for aircraft images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aircraft-images',
  'aircraft-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 5. Create RLS policies for image_uploads
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;

-- Users can view their own uploads
CREATE POLICY "Users can view own uploads" ON image_uploads FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- Users can insert their own uploads
CREATE POLICY "Users can insert own uploads" ON image_uploads FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can update their own uploads
CREATE POLICY "Users can update own uploads" ON image_uploads FOR UPDATE TO authenticated 
USING (user_id = auth.uid());

-- Admins can view all uploads
CREATE POLICY "Admins can view all uploads" ON image_uploads FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'stratuscharters@gmail.com'
  )
);

-- 6. Create RLS policies for image_moderation_logs
ALTER TABLE image_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Users can view logs for their own uploads
CREATE POLICY "Users can view own moderation logs" ON image_moderation_logs FOR SELECT TO authenticated 
USING (
  upload_id IN (
    SELECT id FROM image_uploads WHERE user_id = auth.uid()
  )
);

-- Admins can view all moderation logs
CREATE POLICY "Admins can view all moderation logs" ON image_moderation_logs FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'stratuscharters@gmail.com'
  )
);

-- 7. Create RLS policies for security_events
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own security events
CREATE POLICY "Users can view own security events" ON security_events FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- Admins can view all security events
CREATE POLICY "Admins can view all security events" ON security_events FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'stratuscharters@gmail.com'
  )
);

-- Anyone can insert security events (for logging)
CREATE POLICY "Anyone can insert security events" ON security_events FOR INSERT TO authenticated 
WITH CHECK (true);

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_image_uploads_user_id ON image_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_image_uploads_status ON image_uploads(moderation_status);
CREATE INDEX IF NOT EXISTS idx_image_uploads_created_at ON image_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_image_uploads_file_hash ON image_uploads(file_hash);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_upload_id ON image_moderation_logs(upload_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created_at ON image_moderation_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for updated_at
CREATE TRIGGER update_image_uploads_updated_at 
    BEFORE UPDATE ON image_uploads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Create function to log image moderation results
CREATE OR REPLACE FUNCTION log_image_moderation(
  p_upload_id UUID,
  p_model_version TEXT,
  p_confidence_scores JSONB,
  p_processing_time_ms INTEGER,
  p_server_processed BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO image_moderation_logs (
    upload_id,
    model_version,
    confidence_scores,
    processing_time_ms,
    server_processed
  ) VALUES (
    p_upload_id,
    p_model_version,
    p_confidence_scores,
    p_processing_time_ms,
    p_server_processed
  );
END;
$$ LANGUAGE plpgsql;

-- 12. Create function to get image upload statistics
CREATE OR REPLACE FUNCTION get_image_upload_stats(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_uploads BIGINT,
  approved_uploads BIGINT,
  rejected_uploads BIGINT,
  pending_uploads BIGINT,
  total_size_bytes BIGINT,
  avg_processing_time_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_uploads,
    COUNT(*) FILTER (WHERE moderation_status = 'approved') as approved_uploads,
    COUNT(*) FILTER (WHERE moderation_status = 'rejected') as rejected_uploads,
    COUNT(*) FILTER (WHERE moderation_status = 'pending') as pending_uploads,
    COALESCE(SUM(file_size), 0) as total_size_bytes,
    COALESCE(AVG(iml.processing_time_ms), 0) as avg_processing_time_ms
  FROM image_uploads iu
  LEFT JOIN image_moderation_logs iml ON iu.id = iml.upload_id
  WHERE (p_user_id IS NULL OR iu.user_id = p_user_id);
END;
$$ LANGUAGE plpgsql;

-- 13. Grant permissions
GRANT SELECT, INSERT, UPDATE ON image_uploads TO authenticated;
GRANT SELECT, INSERT ON image_moderation_logs TO authenticated;
GRANT SELECT, INSERT ON security_events TO authenticated;
GRANT EXECUTE ON FUNCTION log_image_moderation TO authenticated;
GRANT EXECUTE ON FUNCTION get_image_upload_stats TO authenticated;

-- 14. Create storage policies for aircraft-images bucket
CREATE POLICY "Users can upload aircraft images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'aircraft-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view aircraft images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'aircraft-images');

CREATE POLICY "Users can update own aircraft images" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'aircraft-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own aircraft images" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'aircraft-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ========================================
-- IMAGE UPLOADS SECURITY SYSTEM READY
-- ========================================
