import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Calendar, 
  Clock, 
  Pin, 
  Archive,
  Trash2,
  Edit3,
  Save,
  X,
  Filter,
  Grid,
  List,
  Star,
  FileText,
  TrendingUp,
  Users,
  Plane
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  color: string;
  category: string;
}

interface ModernNotesSystemProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
}

export const ModernNotesSystem: React.FC<ModernNotesSystemProps> = ({ terminalType }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Q4 Charter Opportunities',
      content: 'European routes showing strong demand. Focus on London-NYC corridor. Premium pricing available for weekend flights.',
      tags: ['charter', 'europe', 'opportunity'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isPinned: true,
      isArchived: false,
      color: 'bg-orange-500/10 border-orange-500/20',
      category: 'market'
    },
    {
      id: '2',
      title: 'Client Meeting - Elite Aviation',
      content: 'Meeting scheduled for next Tuesday. Discuss new partnership opportunities and pricing structure. Prepare market analysis.',
      tags: ['meeting', 'client', 'partnership'],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      isPinned: false,
      isArchived: false,
      color: 'bg-blue-500/10 border-blue-500/20',
      category: 'client'
    },
    {
      id: '3',
      title: 'Aircraft Performance Metrics',
      content: 'Gulfstream G650 showing 98% reliability. Citation X efficiency up 12% this quarter. Monitor fuel costs.',
      tags: ['aircraft', 'performance', 'metrics'],
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      isPinned: false,
      isArchived: false,
      color: 'bg-green-500/10 border-green-500/20',
      category: 'operations'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: 'general',
    color: 'bg-slate-500/10 border-slate-500/20'
  });

  const categories = [
    { id: 'all', name: 'All Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'market', name: 'Market', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'client', name: 'Clients', icon: <Users className="w-4 h-4" /> },
    { id: 'operations', name: 'Operations', icon: <Plane className="w-4 h-4" /> },
    { id: 'general', name: 'General', icon: <FileText className="w-4 h-4" /> }
  ];

  const colorOptions = [
    { id: 'orange', class: 'bg-orange-500/10 border-orange-500/20' },
    { id: 'blue', class: 'bg-blue-500/10 border-blue-500/20' },
    { id: 'green', class: 'bg-green-500/10 border-green-500/20' },
    { id: 'purple', class: 'bg-purple-500/10 border-purple-500/20' },
    { id: 'pink', class: 'bg-pink-500/10 border-pink-500/20' },
    { id: 'slate', class: 'bg-slate-500/10 border-slate-500/20' }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory && !note.isArchived;
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        isArchived: false,
        color: newNote.color,
        category: newNote.category
      };
      
      setNotes(prev => [note, ...prev]);
      setNewNote({
        title: '',
        content: '',
        tags: [],
        category: 'general',
        color: 'bg-slate-500/10 border-slate-500/20'
      });
      setIsCreating(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = () => {
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...editingNote, updatedAt: new Date() }
          : note
      ));
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const handleArchiveNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isArchived: true } : note
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Smart Notes</h2>
          <p className="text-slate-400">Capture insights, track opportunities, and stay organized</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5 text-slate-300" /> : <Grid className="w-5 h-5 text-slate-300" />}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category.icon}
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Create New Note</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <textarea
                placeholder="Write your note..."
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-slate-300 mb-2">Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="general">General</option>
                    <option value="market">Market</option>
                    <option value="client">Client</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm text-slate-300 mb-2">Color</label>
                  <div className="flex gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setNewNote(prev => ({ ...prev, color: color.class }))}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          newNote.color === color.class ? 'border-white' : 'border-transparent'
                        } ${color.class}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Create Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Edit Note</h3>
              <button
                onClick={() => setEditingNote(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={editingNote.title}
                onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                rows={6}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid/List */}
      <div className="space-y-6">
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Pin className="w-5 h-5 text-orange-400" />
              Pinned Notes
            </h3>
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {pinnedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onArchive={handleArchiveNote}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        {regularNotes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">All Notes</h3>
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {regularNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onArchive={handleArchiveNote}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No notes found</h3>
            <p className="text-slate-500">Create your first note to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  formatDate: (date: Date) => string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onArchive,
  formatDate
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer ${note.color}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-white text-sm line-clamp-1">{note.title}</h4>
        <div className="flex items-center gap-1">
          {note.isPinned && <Pin className="w-4 h-4 text-orange-400" />}
          {isHovered && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="p-1 hover:bg-slate-600/50 rounded transition-colors"
              >
                <Edit3 className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className="p-1 hover:bg-slate-600/50 rounded transition-colors"
              >
                <Pin className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(note.id);
                }}
                className="p-1 hover:bg-slate-600/50 rounded transition-colors"
              >
                <Archive className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="p-1 hover:bg-red-600/50 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-3 line-clamp-3">{note.content}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-500">{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};
