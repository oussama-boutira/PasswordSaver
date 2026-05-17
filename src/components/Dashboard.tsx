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
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 p-6 glass rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">My Vault</h1>
            <p className="text-sm text-muted-foreground">{vaultData.credentials.length} items</p>
          </div>
        </div>
        <button
          onClick={onLock}
          className="flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-all shadow-lg hover:shadow-destructive/25"
        >
          <Lock className="w-5 h-5" />
          Save & Lock Vault
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credentials..."
            className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Grid */}
      {filteredCredentials.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center glass rounded-3xl border-dashed">
          <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No credentials found</h3>
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
