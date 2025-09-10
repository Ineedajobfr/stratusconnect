import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PageContent {
  id: string;
  page_name: string;
  section_key: string;
  content: string;
  content_type: string;
  updated_at: string;
  created_at: string;
}

export const usePageContent = (pageName: string) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [pageName, fetchContent]);

  const fetchContent = useCallback(async () => {
              try {
                setLoading(true);
                const { data, error } = await supabase
                  .from('page_content')
                  .select('*')
                  .eq('page_name', pageName);

                if (error) throw error;

                const contentMap = data.reduce((acc, item) => {
                  acc[item.section_key] = item.content;
                  return acc;
                }, {} as Record<string, string>);

                setContent(contentMap);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
              } finally {
                setLoading(false);
              }
            }, [data, error, from, select, eq, reduce, section_key, content, Record, Error, message]);

  const updateContent = async (sectionKey: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_name: pageName,
          section_key: sectionKey,
          content: newContent,
          content_type: 'text'
        });

      if (error) throw error;

      setContent(prev => ({
        ...prev,
        [sectionKey]: newContent
      }));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    updateContent,
    refetch: fetchContent
  };
};

export const useAllPageContent = () => {
  const [allContent, setAllContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_name', { ascending: true })
        .order('section_key', { ascending: true });

      if (error) throw error;
      setAllContent(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    allContent,
    loading,
    error,
    refetch: fetchAllContent
  };
};