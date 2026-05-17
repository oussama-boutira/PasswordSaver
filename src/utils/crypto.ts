import CryptoJS from 'crypto-js';
import type { VaultData } from '../types';

export const encryptVault = (data: VaultData, masterPassword: string): string => {
  const jsonString = JSON.stringify(data);
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(jsonString, masterPassword).toString();
  return ciphertext;
};

export const decryptVault = (ciphertext: string, masterPassword: string): VaultData => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, masterPassword);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Invalid master password or corrupted file.');
    }
    
    const data: VaultData = JSON.parse(decryptedString);
    if (!data.credentials) {
       throw new Error('Invalid vault format.');
    }
    return data;
  } catch (error) {
    throw new Error('Failed to decrypt. Incorrect master password or corrupted file.');
  }
};
