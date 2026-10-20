import { create } from 'zustand';
import { notify } from '../lib/notify';

type PortfolioEditorStore = {
  loading: boolean;
  saving: boolean;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setMessage: (message: string | null) => void;
  clearFeedback: () => void;
};

export const usePortfolioEditorStore = create<PortfolioEditorStore>((set) => ({
  loading: true,
  saving: false,
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setError: (error) => {
    if (error) {
      notify.error(error);
    }
  },
  setMessage: (message) => {
    if (message) {
      notify.success(message);
    }
  },
  clearFeedback: () => {},
}));
