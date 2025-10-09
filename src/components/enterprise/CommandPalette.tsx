import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, Search, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Command {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  action: () => void;
  icon?: React.ReactNode;
  category?: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  commands,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on query
  const filteredCommands = query
    ? commands.filter((cmd) => {
        const searchText = `${cmd.label} ${cmd.description} ${cmd.keywords?.join(' ')}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
    : commands.filter((cmd) => recentCommands.includes(cmd.id)).slice(0, 5);

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    const category = cmd.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Reset selection when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  const executeCommand = (command: Command | undefined) => {
    if (!command) return;
    
    // Add to recent commands
    setRecentCommands((prev) => {
      const updated = [command.id, ...prev.filter((id) => id !== command.id)];
      return updated.slice(0, 10); // Keep last 10
    });
    
    command.action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="command-palette p-0 max-h-[600px] overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 command-palette-input border-b border-enterprise-primary/20">
          <Search className="w-5 h-5 text-enterprise-primary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 font-mono"
          />
          <kbd className="kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div className="command-palette-results">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="p-8 text-center text-white/40 font-mono">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-6 py-2 text-xs font-semibold text-enterprise-gold uppercase tracking-wider font-mono bg-black/20">
                  {category}
                </div>
                {cmds.map((cmd, index) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <div
                      key={cmd.id}
                      className={cn(
                        'command-palette-item',
                        isSelected && 'active bg-enterprise-primary/10 border-l-enterprise-primary'
                      )}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {cmd.icon && (
                            <div className="text-enterprise-primary">
                              {cmd.icon}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-white font-medium font-mono">
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div className="text-xs text-white/60 font-mono mt-1">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cmd.shortcut && (
                            <kbd className="kbd">{cmd.shortcut}</kbd>
                          )}
                          {recentCommands.includes(cmd.id) && (
                            <Clock className="w-3 h-3 text-white/40" />
                          )}
                          <ArrowRight className={cn(
                            'w-4 h-4 transition-opacity',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-enterprise-primary/20 flex items-center justify-between text-xs text-white/60 font-mono bg-black/20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="kbd">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="kbd">↵</kbd> Execute
            </span>
            <span className="flex items-center gap-1">
              <kbd className="kbd">ESC</kbd> Close
            </span>
          </div>
          <div className="flex items-center gap-1 text-enterprise-primary">
            <Zap className="w-3 h-3" />
            <span>Power Mode</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook to use command palette with keyboard shortcut
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
};

// Pre-defined commands for common actions
export const createDefaultCommands = (navigate: ReturnType<typeof useNavigate>): Command[] => [
  // Navigation
  {
    id: 'nav-dashboard',
    label: 'Go to Dashboard',
    description: 'View your main dashboard',
    category: 'Navigation',
    keywords: ['home', 'overview'],
    shortcut: 'G D',
    action: () => navigate('/'),
  },
  {
    id: 'nav-rfqs',
    label: 'Go to RFQs',
    description: 'View all requests for quotes',
    category: 'Navigation',
    keywords: ['requests', 'quotes'],
    shortcut: 'G R',
    action: () => navigate('/rfqs'),
  },
  {
    id: 'nav-analytics',
    label: 'Go to Analytics',
    description: 'View analytics and reports',
    category: 'Navigation',
    keywords: ['stats', 'metrics', 'reports'],
    shortcut: 'G A',
    action: () => navigate('/analytics'),
  },
  
  // Actions
  {
    id: 'action-new-rfq',
    label: 'Create New RFQ',
    description: 'Create a new request for quote',
    category: 'Actions',
    keywords: ['new', 'create', 'request'],
    shortcut: 'Cmd N',
    action: () => {/* Implement */},
  },
  {
    id: 'action-export',
    label: 'Export Current View',
    description: 'Export current data to CSV',
    category: 'Actions',
    keywords: ['download', 'save', 'csv'],
    shortcut: 'Cmd E',
    action: () => {/* Implement */},
  },
  {
    id: 'action-refresh',
    label: 'Refresh Data',
    description: 'Reload current page data',
    category: 'Actions',
    keywords: ['reload', 'update'],
    shortcut: 'Cmd R',
    action: () => window.location.reload(),
  },
  
  // Settings
  {
    id: 'settings-profile',
    label: 'Profile Settings',
    description: 'Edit your profile settings',
    category: 'Settings',
    keywords: ['account', 'preferences'],
    action: () => navigate('/settings/profile'),
  },
  {
    id: 'settings-security',
    label: 'Security Settings',
    description: 'Manage security and privacy',
    category: 'Settings',
    keywords: ['password', 'auth', 'privacy'],
    action: () => navigate('/settings/security'),
  },
];

