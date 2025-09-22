import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Search, 
  Pin, 
  Tag, 
  Calendar, 
  FileText, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  BookOpen,
  Filter,
  SortAsc,
  MoreVertical,
  Link,
  Image,
  Paperclip,
  CheckSquare,
  Square
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  color: string;
  type: 'note' | 'checklist' | 'meeting' | 'task';
  linkedItems?: {
    type: 'flight' | 'rfq' | 'pilot' | 'crew' | 'aircraft';
    id: string;
    name: string;
  }[];
}

interface NoteTakingSystemProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  className?: string;
}

const NoteTakingSystem: React.FC<NoteTakingSystemProps> = ({ terminalType, className }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: [],
    type: 'note',
    color: 'blue'
  });

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${terminalType}`);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, [terminalType]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(`notes-${terminalType}`, JSON.stringify(notes));
  }, [notes, terminalType]);

  const createNote = () => {
    if (!newNote.title?.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title || 'Untitled Note',
      content: newNote.content || '',
      tags: newNote.tags || [],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: newNote.color || 'blue',
      type: newNote.type || 'note',
      linkedItems: []
    };

    setNotes(prev => [note, ...prev]);
    setSelectedNote(note);
    setIsCreating(false);
    setNewNote({
      title: '',
      content: '',
      tags: [],
      type: 'note',
      color: 'blue'
    });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
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
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = !filterTag || note.tags.includes(filterTag);
    
    return matchesSearch && matchesFilter;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      red: 'bg-red-100 border-red-300 text-red-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      gray: 'bg-gray-100 border-gray-300 text-gray-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checklist': return <CheckSquare className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'task': return <Square className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={`terminal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          Note Taking System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-terminal-input border-terminal-border"
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
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-terminal-input/50 ${
                      selectedNote?.id === note.id ? 'bg-accent/20 border-accent' : 'border-terminal-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {note.isPinned && <Pin className="w-3 h-3 text-accent" />}
                          {getTypeIcon(note.type)}
                          <span className="font-medium text-sm truncate">{note.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
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
          <div className="lg:col-span-2">
            {isCreating ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Note title..."
                    value={newNote.title || ''}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-terminal-input border-terminal-border"
                  />
                  <select
                    value={newNote.type || 'note'}
                    onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value as any }))}
                    className="px-3 py-2 bg-terminal-input border border-terminal-border rounded-md text-sm"
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
                  className="min-h-[300px] bg-terminal-input border-terminal-border"
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
            ) : selectedNote ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={selectedNote.title}
                    onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                    className="bg-terminal-input border-terminal-border"
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
                  className="min-h-[300px] bg-terminal-input border-terminal-border"
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
                      className="w-24 h-6 text-xs"
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
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-accent/50" />
                  <p>Select a note to edit or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default NoteTakingSystem;
