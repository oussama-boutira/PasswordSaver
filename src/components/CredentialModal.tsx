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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass w-full max-w-md p-6 rounded-2xl relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-6">{credential ? 'Edit Credential' : 'Add Credential'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <input
              required
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="e.g. Google, GitHub"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Username / Email *</label>
            <input
              required
              type="text"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="text"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL</label>
            <input
              type="url"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="https://"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[100px] resize-y"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
