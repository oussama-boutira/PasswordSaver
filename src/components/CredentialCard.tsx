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
    <div className="glass p-5 rounded-xl flex flex-col gap-4 group">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold truncate text-primary">{credential.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(credential)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(credential.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 truncate font-medium">{credential.username}</div>
          <button 
            onClick={() => handleCopy(credential.username, 'username')}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            {copiedField === 'username' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handleCopy(credential.password!, 'password')}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              {copiedField === 'password' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}

        {credential.url && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Globe className="w-4 h-4 shrink-0" />
            <a href={credential.url.startsWith('http') ? credential.url : `https://${credential.url}`} target="_blank" rel="noreferrer" className="truncate hover:text-primary hover:underline">
              {credential.url}
            </a>
          </div>
        )}

        {credential.notes && (
          <div className="flex items-start gap-3 text-sm text-muted-foreground mt-2 bg-black/10 dark:bg-white/5 p-3 rounded-md">
            <FileText className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="whitespace-pre-wrap break-words line-clamp-3">{credential.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
