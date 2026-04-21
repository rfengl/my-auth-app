import FormGroup from '@/components/form-group';
import PasswordInput from '@/components/password-input';
import ThemedButton from '@/components/themed-button';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import ValidateInput from '@/components/validate-input';
import { useAuth } from '@/context/AuthContext';
import { showAlert } from '@/utils/alert';
import { validateEmail } from '@/utils/validate-utils';
import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
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

export default function SignupScreen() {
    const router = useRouter();
    const { signup } = useAuth();

    // Connect to Zustand
    const { form, setField, isValid, loading } = useSignupStore();
    const errorsRef = useRef<Record<string, string>>({});

    const handleSignup = useCallback(() => {
        if (!isValid()) {
            showAlert("Please ensure all fields are correct.");
            return;
        }

        const { form } = useSignupStore.getState()
        signup(form, (error) => {
            if (error) {
                showAlert(error);
            } else {
                router.replace('/(auth)/login');
            }
        });
    }, [signup, isValid]);

    const checkPassword = useCallback(() => {
        const { form } = useSignupStore.getState()
        if ((form.password || '') !== (form.confirmPassword || '')) {
            return 'Password confirmation does not match.'
        }
    }, [])

    const checkEmail = useCallback(() => {
        const { form } = useSignupStore.getState()
        if (!validateEmail(form.email)) {
            return 'Invalid email format'
        }
    }, [])

    return (
        <ThemedView style={styles.container}>
            <FormGroup>
                <ThemedTextInput
                    placeholder="Full Name"
                    value={form.name}
                    onChangeText={(val) => setField('name', val)}
                />
                <ValidateInput errorsRef={errorsRef} name="Full Name" value={form.name} isRequired />
            </FormGroup>

            <FormGroup>
                <ThemedTextInput
                    placeholder="Email"
                    value={form.email}
                    onChangeText={(val) => setField('email', val)}
                    autoCapitalize="none"
                />
                <ValidateInput errorsRef={errorsRef} name="Email" value={form.email} isRequired validate={checkEmail} />
            </FormGroup>

            <FormGroup>
                <PasswordInput
                    placeholder="Password"
                    value={form.password}
                    onChangeText={(val) => setField('password', val)}
                    secureTextEntry
                />
                <ValidateInput errorsRef={errorsRef} name="Password" value={form.password} isRequired minLength={6} />
            </FormGroup>
            <FormGroup>
                <PasswordInput
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChangeText={(val) => setField('confirmPassword', val)}
                    secureTextEntry
                />
                <ValidateInput errorsRef={errorsRef} name="Confirm Password" value={form.confirmPassword} isRequired validate={checkPassword} />
            </FormGroup>

            <ThemedButton type='success' onPress={handleSignup} disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
            </ThemedButton>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    scrollview: { flex: 1, justifyContent: 'center' },
    container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    title: { marginBottom: 30, textAlign: 'center' },
    linkText: { color: '#007AFF', marginTop: 20, textAlign: 'center' },
});