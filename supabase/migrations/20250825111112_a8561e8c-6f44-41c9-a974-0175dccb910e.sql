-- Add verification and document management tables
CREATE TABLE public.verification_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL, -- 'license', 'certificate', 'insurance', 'company_registration'
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add message attachments table
CREATE TABLE public.message_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add marketplace filters and saved searches
CREATE TABLE public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  alert_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_documents
CREATE POLICY "Users can view their own verification documents"
ON public.verification_documents
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own verification documents"
ON public.verification_documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification documents"
ON public.verification_documents
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for message_attachments
CREATE POLICY "Deal participants can view message attachments"
ON public.message_attachments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN deals d ON m.deal_id = d.id
    WHERE m.id = message_attachments.message_id
    AND (d.operator_id = auth.uid() OR d.broker_id = auth.uid())
  )
);

CREATE POLICY "Deal participants can upload message attachments"
ON public.message_attachments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN deals d ON m.deal_id = d.id
    WHERE m.id = message_attachments.message_id
    AND m.sender_id = auth.uid()
    AND (d.operator_id = auth.uid() OR d.broker_id = auth.uid())
  )
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for saved_searches
CREATE POLICY "Users can manage their own saved searches"
ON public.saved_searches
FOR ALL
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_verification_documents_updated_at
BEFORE UPDATE ON public.verification_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at
BEFORE UPDATE ON public.saved_searches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('message-attachments', 'message-attachments', false);

-- Storage policies for verification documents
CREATE POLICY "Users can upload their own verification documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for message attachments
CREATE POLICY "Deal participants can upload message attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'message-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Deal participants can view message attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'message-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);