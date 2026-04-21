
import { validateEmail } from '@/utils/validate-utils';
import { create } from 'zustand';

interface SignupState {
    form: {
        name: '';
        email: '';
        password: '';
        confirmPassword: '';
    };
    loading: boolean;
    setField: (field: string, value: string) => void;
    resetForm: () => void;
    isValid: () => boolean;
}

export const useSignupStore = create<SignupState>((set, get) => ({
    form: { name: '', email: '', password: '', confirmPassword: '' },
    loading: false,

    setField: (field, value) =>
        set((state) => ({
            form: { ...state.form, [field]: value }
        })),

    resetForm: () =>
        set({ form: { name: '', email: '', password: '', confirmPassword: '' } }),

    isValid: () => {
        const { name, email, password, confirmPassword } = get().form;
        return (
            name.length > 0 &&
            validateEmail(email) &&
            password.length >= 6 &&
            password === confirmPassword
        );
    },
}));
