import create from 'zustand';

interface Borrower {
  id: string;
  name: string;
}

interface SavingsAccount {
  accountNumber: string;
  balance: number;
  status: string;
}

interface AppState {
  borrower: Borrower | null;
  selectedAccount: SavingsAccount | null;
  setBorrower: (borrower: Borrower | null) => void;
  setSelectedAccount: (account: SavingsAccount | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  borrower: null,
  selectedAccount: null,
  setBorrower: (borrower) => set({ borrower }),
  setSelectedAccount: (account) => set({ selectedAccount })
}));