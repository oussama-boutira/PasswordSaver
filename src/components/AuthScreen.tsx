import React, { useState } from 'react';
import { Lock, FileKey2, Upload, KeyRound } from 'lucide-react';
import { readFileContent } from '../utils/fileOperations';
import { decryptVault } from '../utils/crypto';
import type { VaultData } from '../types';

interface AuthScreenProps {
  onUnlock: (password: string, data: VaultData) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onUnlock }) => {
  const [mode, setMode] = useState<'open' | 'create'>('open');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'create') {
      if (!password || password.length < 8) {
        setError('Master password must be at least 8 characters long.');
        return;
      }
      // Create an empty vault
      const emptyVault: VaultData = { version: 1, credentials: [] };
      onUnlock(password, emptyVault);
      return;
    }

    // Open existing
    if (!file) {
      setError('Please select a .vault file.');
      return;
    }
    if (!password) {
      setError('Please enter your master password.');
      return;
    }

    try {
      const ciphertext = await readFileContent(file);
      const data = decryptVault(ciphertext, password);
      onUnlock(password, data);
    } catch (err: any) {
      setError(err.message || 'Failed to unlock vault.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-center mb-6 relative z-10">
          <div className="p-4 bg-primary/20 rounded-full">
            <Lock className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-glow">PasswordSaver</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm font-medium tracking-wide uppercase">
          Zero-Trust • 100% Offline
        </p>

        <div className="flex gap-3 mb-8 relative z-10">
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${mode === 'open' ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(120,80,255,0.4)]' : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'}`}
            onClick={() => { setMode('open'); setError(null); }}
          >
            Open Vault
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${mode === 'create' ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(120,80,255,0.4)]' : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'}`}
            onClick={() => { setMode('create'); setError(null); }}
          >
            Create New
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'open' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Vault File (.vault)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".vault"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="vault-file"
                />
                <label
                  htmlFor="vault-file"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors border-border"
                >
                  {file ? (
                    <div className="flex items-center text-primary">
                      <FileKey2 className="w-5 h-5 mr-2" aria-hidden="true" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <Upload className="w-5 h-5 mr-2" aria-hidden="true" />
                      <span>Select .vault file</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="master-password" className="text-sm font-medium">Master Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <input
                id="master-password"
                type="password"
                autoComplete="current-password"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all duration-300 active:scale-[0.98] shadow-[0_0_20px_rgba(120,80,255,0.3)] hover:shadow-[0_0_25px_rgba(120,80,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center relative z-10"
          >
            {mode === 'open' ? 'Unlock Vault' : 'Create Secure Vault'}
          </button>
        </form>
      </div>
    </div>
  );
};
