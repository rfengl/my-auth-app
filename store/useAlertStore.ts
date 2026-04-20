import { create } from 'zustand';

interface AlertState {
    message: string;
    title: string;
    setMessage: (message: string, title?: string) => void;
    clearMessage: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    message: '',
    title: 'Notice',
    setMessage: (message, title = 'Notice...') =>
        set({ message, title }),
    clearMessage: () => set({ message: '', title: 'Notice' }),
}));