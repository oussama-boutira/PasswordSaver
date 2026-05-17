import React, { useState, useMemo } from 'react';
import { Search, Plus, ShieldCheck, Lock } from 'lucide-react';
import type { Credential, VaultData } from '../types';
import { CredentialCard } from './CredentialCard';
import { CredentialModal } from './CredentialModal';

interface DashboardProps {
  vaultData: VaultData;
  onUpdateVault: (data: VaultData) => void;
  onLock: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ vaultData, onUpdateVault, onLock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);

  const filteredCredentials = useMemo(() => {
    if (!searchQuery) return vaultData.credentials;
    const lowerQuery = searchQuery.toLowerCase();
    return vaultData.credentials.filter(
      (c) => 
        c.title.toLowerCase().includes(lowerQuery) || 
        c.username.toLowerCase().includes(lowerQuery) ||
        (c.url && c.url.toLowerCase().includes(lowerQuery))
    );
  }, [vaultData.credentials, searchQuery]);

  const handleSaveCredential = (credential: Credential) => {
    let newCredentials;
    if (editingCredential) {
      newCredentials = vaultData.credentials.map((c) => 
        c.id === credential.id ? credential : c
      );
    } else {
      newCredentials = [...vaultData.credentials, credential];
    }
    onUpdateVault({ ...vaultData, credentials: newCredentials });
    setIsModalOpen(false);
    setEditingCredential(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      const newCredentials = vaultData.credentials.filter((c) => c.id !== id);
      onUpdateVault({ ...vaultData, credentials: newCredentials });
    }
  };

  const openAddModal = () => {
    setEditingCredential(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 p-6 glass-panel rounded-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-primary/30 to-accent/10 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(120,80,255,0.2)]">
            <ShieldCheck className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-glow">My Secure Vault</h1>
            <p className="text-sm text-muted-foreground">{vaultData.credentials.length} items</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLock}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background relative z-10"
        >
          <Lock className="w-5 h-5" aria-hidden="true" />
          Save & Lock Vault
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="text"
            aria-label="Search credentials"
            autoComplete="off"
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credentials..."
            className="w-full pl-11 pr-4 py-3.5 bg-card/40 backdrop-blur-md border border-white/10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-card/60 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(120,80,255,0.3)] hover:shadow-[0_0_25px_rgba(120,80,255,0.5)] whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          Add Item
        </button>
      </div>

      {/* Grid */}
      {filteredCredentials.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-white/5 border-dashed">
          <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4 opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" aria-hidden="true" />
          <h3 className="text-2xl font-bold mb-2 tracking-tight">No credentials found</h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery ? "No items match your search query." : "Your vault is empty. Click 'Add Item' to securely store your first credential."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((cred) => (
            <CredentialCard 
              key={cred.id} 
              credential={cred} 
              onEdit={(c) => { setEditingCredential(c); setIsModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CredentialModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingCredential(null); }}
        onSave={handleSaveCredential}
        credential={editingCredential}
      />
    </div>
  );
};
