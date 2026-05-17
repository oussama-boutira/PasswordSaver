import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { encryptVault } from './utils/crypto';
import { downloadBlob } from './utils/fileOperations';
import type { VaultData } from './types';

function App() {
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const [vaultData, setVaultData] = useState<VaultData | null>(null);

  const handleUnlock = (password: string, data: VaultData) => {
    setMasterPassword(password);
    setVaultData(data);
  };

  const handleUpdateVault = (data: VaultData) => {
    setVaultData(data);
  };

  const handleLock = () => {
    if (!vaultData || !masterPassword) return;

    try {
      // 1. Encrypt current state
      const ciphertext = encryptVault(vaultData, masterPassword);
      
      // Generate filename as requested: pss_1.vault
      const filename = 'pss_1.vault';
      downloadBlob(ciphertext, filename);

      // 3. Clear State (Zero Persistence)
      setMasterPassword(null);
      setVaultData(null);
    } catch (error) {
      console.error("Failed to encrypt and save vault:", error);
      alert("Failed to save vault securely. Please check console.");
    }
  };

  // Enforce dark mode by default for premium feel
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {!masterPassword || !vaultData ? (
        <AuthScreen onUnlock={handleUnlock} />
      ) : (
        <Dashboard 
          vaultData={vaultData} 
          onUpdateVault={handleUpdateVault} 
          onLock={handleLock} 
        />
      )}
    </div>
  );
}

export default App;
