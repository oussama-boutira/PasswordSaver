import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Credential } from '../types';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credential: Credential) => void;
  credential?: Credential | null;
}

export const CredentialModal: React.FC<CredentialModalProps> = ({ isOpen, onClose, onSave, credential }) => {
  const [formData, setFormData] = useState<Partial<Credential>>({});

  useEffect(() => {
    if (credential) {
      setFormData({ ...credential });
    } else {
      setFormData({
        id: crypto.randomUUID(),
        title: '',
        username: '',
        password: '',
        url: '',
        notes: ''
      });
    }
  }, [credential, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.username) return;
    onSave(formData as Credential);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md p-7 rounded-2xl relative shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        
        <h2 className="text-2xl font-extrabold mb-6 tracking-tight relative z-10">{credential ? 'Edit Credential' : 'Add Credential'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label htmlFor="cred-title" className="text-sm font-medium">Title *</label>
            <input
              id="cred-title"
              required
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-card/40 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-muted-foreground/70"
              placeholder="e.g. Google, GitHub"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cred-username" className="text-sm font-medium">Username / Email *</label>
            <input
              id="cred-username"
              required
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 bg-card/40 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cred-password" className="text-sm font-medium">Password</label>
            <input
              id="cred-password"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-card/40 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cred-url" className="text-sm font-medium">URL</label>
            <input
              id="cred-url"
              type="url"
              autoComplete="off"
              spellCheck={false}
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2.5 bg-card/40 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-muted-foreground/70"
              placeholder="https://"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cred-notes" className="text-sm font-medium">Notes</label>
            <textarea
              id="cred-notes"
              spellCheck={false}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-card/40 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all min-h-[100px] resize-y"
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-[0_0_15px_rgba(120,80,255,0.3)] hover:shadow-[0_0_20px_rgba(120,80,255,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
