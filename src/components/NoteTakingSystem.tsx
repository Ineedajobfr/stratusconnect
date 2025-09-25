import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, Pin, PinOff, Search, Tag, CheckSquare, List, Calendar, Square, Save, BookOpen, X } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: 'note' | 'checklist' | 'meeting' | 'task';
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteTakingSystemProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  className?: string;
}

const NoteTakingSystem: React.FC<NoteTakingSystemProps> = ({ terminalType, className }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: [],
    type: 'note',
    color: '#ffffff',
    isPinned: false
  });

  // Load notes from localStorage on mount
  useEffect(() => {
    const storedNotes = localStorage.getItem(`stratusconnect-notes-${terminalType}`);
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, [terminalType]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(`stratusconnect-notes-${terminalType}`, JSON.stringify(notes));
  }, [notes, terminalType]);

  const createNote = () => {
    if (!newNote.title?.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content || '',
      tags: newNote.tags || [],
      type: newNote.type || 'note',
      color: newNote.color || '#ffffff',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes(prev => [note, ...prev]);
    setSelectedNote(note);
    setNewNote({ title: '', content: '', tags: [], type: 'note', color: '#ffffff', isPinned: false });
    setIsCreating(false);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
    
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const togglePin = (id: string) => {
    updateNote(id, { isPinned: !notes.find(n => n.id === id)?.isPinned });
  };

  const addTag = (noteId: string, tag: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note && !note.tags.includes(tag)) {
      updateNote(noteId, { tags: [...note.tags, tag] });
    }
  };

  const removeTag = (noteId: string, tag: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { tags: note.tags.filter(t => t !== tag) });
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checklist': return <CheckSquare className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'task': return <Square className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-terminal-card from-opacity-50 to-terminal-card to-opacity-30 backdrop-blur-sm border border-terminal-border rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent bg-opacity-20 rounded-xl">
          <BookOpen className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Note Taking System</h2>
          <p className="text-sm text-muted-foreground">Organize your thoughts and ideas</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-terminal-bg bg-opacity-10 border-terminal-border text-white placeholder-gray-400 focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTag(null)}
                className="text-xs"
              >
                All
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={filterTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Create New Note */}
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full btn-terminal-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>

          {/* Notes List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {sortedNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                    selectedNote?.id === note.id 
                      ? 'bg-gradient-to-r from-accent from-opacity-20 to-accent to-opacity-10 border-accent shadow-lg' 
                      : 'bg-terminal-bg bg-opacity-5 border-terminal-bg border-opacity-10 hover:bg-terminal-bg hover:bg-opacity-10 hover:border-terminal-bg hover:border-opacity-20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {note.isPinned && <Pin className="w-3 h-3 text-accent" />}
                        {getTypeIcon(note.type)}
                        <span className="font-medium text-sm truncate">{note.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {note.content}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className="p-1 h-6 w-6"
                      >
                        <Pin className={`w-3 h-3 ${note.isPinned ? 'text-accent' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-2 bg-terminal-bg bg-opacity-5 rounded-xl p-6 border border-terminal-bg border-opacity-10">
          {isCreating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Note title..."
                  value={newNote.title || ''}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-terminal-bg bg-opacity-10 border-terminal-border text-white placeholder-gray-400 focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200"
                />
                <select
                  value={newNote.type || 'note'}
                  onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value as any }))}
                  className="px-3 py-2 bg-terminal-bg bg-opacity-10 border border-terminal-border rounded-md text-sm text-white focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200"
                >
                  <option value="note">Note</option>
                  <option value="checklist">Checklist</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>
              </div>
              
              <Textarea
                placeholder="Start writing your note..."
                value={newNote.content || ''}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[300px] bg-terminal-bg bg-opacity-10 border-terminal-border text-white placeholder-gray-400 focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200 resize-none"
              />
              
              <div className="flex gap-2">
                <Button onClick={createNote} className="btn-terminal-accent">
                  <Save className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {!isCreating && selectedNote && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="bg-terminal-bg bg-opacity-10 border-terminal-border text-white placeholder-gray-400 focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePin(selectedNote.id)}
                >
                  <Pin className={`w-4 h-4 ${selectedNote.isPinned ? 'text-accent' : 'text-muted-foreground'}`} />
                </Button>
              </div>
              
              <Textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                className="min-h-[300px] bg-terminal-bg bg-opacity-10 border-terminal-border text-white placeholder-gray-400 focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200 resize-none"
              />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(selectedNote.id, tag)}
                      />
                    </Badge>
                  ))}
                  <Input
                    placeholder="Add tag..."
                    className="w-24 h-6 text-xs bg-terminal-bg bg-opacity-10 border-terminal-border text-white placeholder-gray-400 focus:bg-terminal-bg focus:bg-opacity-20 focus:border-accent transition-all duration-200"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const tag = e.currentTarget.value.trim();
                        if (tag) {
                          addTag(selectedNote.id, tag);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {!isCreating && !selectedNote && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="p-4 bg-accent bg-opacity-10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Note Selected</h3>
                <p className="text-sm">Select a note from the sidebar or create a new one to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteTakingSystem;