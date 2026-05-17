import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Edit, Trash2, CheckCircle2, Globe, FileText, User } from 'lucide-react';
import type { Credential } from '../types';

interface CredentialCardProps {
  credential: Credential;
  onEdit: (c: Credential) => void;
  onDelete: (id: string) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(120,80,255,0.2)] hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="flex justify-between items-start relative z-10">
        <h3 className="text-lg font-bold tracking-wide truncate text-primary group-hover:text-glow transition-all">{credential.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button type="button" onClick={() => onEdit(credential)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded" aria-label="Edit credential">
            <Edit className="w-4 h-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onDelete(credential.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded" aria-label="Delete credential">
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <div className="flex-1 truncate font-medium">{credential.username}</div>
          <button 
            type="button"
            onClick={() => handleCopy(credential.username, 'username')}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label="Copy username"
          >
            {copiedField === 'username' ? <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>

        {credential.password && (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <span className="text-xl leading-none text-muted-foreground mt-1.5">*</span>
            </div>
            <div className="flex-1 font-mono tracking-widest text-sm truncate">
              {showPassword ? credential.password : '••••••••••••'}
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
            </button>
            <button 
              type="button"
              onClick={() => handleCopy(credential.password!, 'password')}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Copy password"
            >
              {copiedField === 'password' ? <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        )}

        {credential.url && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
            <a href={credential.url.startsWith('http') ? credential.url : `https://${credential.url}`} target="_blank" rel="noopener noreferrer" className="truncate hover:text-primary hover:underline focus-visible:outline-none focus-visible:text-primary focus-visible:underline rounded">
              {credential.url}
            </a>
          </div>
        )}

        {credential.notes && (
          <div className="flex items-start gap-3 text-sm text-muted-foreground mt-2 bg-black/20 dark:bg-white/5 border border-white/5 p-3.5 rounded-xl shadow-inner">
            <FileText className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
            <p className="whitespace-pre-wrap break-words line-clamp-3">{credential.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
