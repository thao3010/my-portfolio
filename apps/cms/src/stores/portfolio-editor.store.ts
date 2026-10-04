import { create } from 'zustand';

type PortfolioEditorStore = {
  loading: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setMessage: (message: string | null) => void;
  clearFeedback: () => void;
};

export const usePortfolioEditorStore = create<PortfolioEditorStore>((set) => ({
  loading: true,
  saving: false,
  error: null,
  message: null,
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setError: (error) => set({ error, message: null }),
  setMessage: (message) => set({ message, error: null }),
  clearFeedback: () => set({ error: null, message: null }),
}));
