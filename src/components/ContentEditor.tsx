import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAllPageContent, PageContent } from '@/hooks/usePageContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Edit2 } from 'lucide-react';

export const ContentEditor = () => {
  const { allContent, loading, refetch } = useAllPageContent();
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    page_name: '',
    section_key: '',
    content: '',
    content_type: 'text'
  });

  const handleSave = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('page_content')
          .update({
            content: formData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Content updated successfully');
      } else if (isCreating) {
        const { error } = await supabase
          .from('page_content')
          .insert({
            page_name: formData.page_name,
            section_key: formData.section_key,
            content: formData.content,
            content_type: formData.content_type
          });

        if (error) throw error;
        toast.success('Content created successfully');
      }

      setEditingItem(null);
      setIsCreating(false);
      setFormData({ page_name: '', section_key: '', content: '', content_type: 'text' });
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save content');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Content deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete content');
    }
  };

  const startEditing = (item: PageContent) => {
    setEditingItem(item);
    setFormData({
      page_name: item.page_name,
      section_key: item.section_key,
      content: item.content,
      content_type: item.content_type
    });
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingItem(null);
    setFormData({ page_name: '', section_key: '', content: '', content_type: 'text' });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({ page_name: '', section_key: '', content: '', content_type: 'text' });
  };

  const groupedContent = allContent.reduce((acc, item) => {
    if (!acc[item.page_name]) {
      acc[item.page_name] = [];
    }
    acc[item.page_name].push(item);
    return acc;
  }, {} as Record<string, PageContent[]>);

  if (loading) {
    return <div className="flex justify-center p-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button onClick={startCreating} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      {(editingItem || isCreating) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Content' : 'Create New Content'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Page Name</label>
                <Input
                  value={formData.page_name}
                  onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                  placeholder="e.g., home, about, privacy"
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Key</label>
                <Input
                  value={formData.section_key}
                  onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                  placeholder="e.g., hero_title, description"
                  disabled={!!editingItem}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your content here..."
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(groupedContent).map(([pageName, items]) => (
          <Card key={pageName}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{pageName}</Badge>
                Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{item.section_key}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated {new Date(item.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(item)}
                        className="gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};