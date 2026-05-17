export interface Credential {
  id: string;
  title: string;
  username: string;
  password?: string; // Optional because sometimes it's just a note
  url?: string;
  notes?: string;
}

export interface VaultData {
  version: number;
  credentials: Credential[];
}
