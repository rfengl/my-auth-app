import { useRouter } from 'expo-router';
import React, { memo, useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// Store & Context
import { useAuth } from '@/context/AuthContext';

// Components
import FormGroup from '@/components/form-group';
import ThemedButton from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import ValidateInput from '@/components/validate-input';
import { showAlert } from '@/utils/alert';
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

export default function SignupScreen() {
    const router = useRouter();
    const { signup } = useAuth();

    // We grab the actions (functions), but NOT the form data here.
    // This keeps the Parent SignupScreen from re-rendering on every keystroke!
    const isValid = useSignupStore((state) => state.isValid);
    const loading = useSignupStore((state) => state.loading);
    const resetForm = useSignupStore((state) => state.resetForm);
    const errorsRef = useRef<Record<string, string>>({});

    const handleSignup = useCallback(() => {
        if (!isValid()) {
            showAlert("Please ensure all fields are correct.");
            return;
        }

        // Get snapshot of state only at the moment of submission
        const currentForm = useSignupStore.getState().form;

        signup(currentForm, (error) => {
            if (error) {
                showAlert(error);
            } else {
                resetForm();
                router.replace('/(auth)/login');
            }
        });
    }, [signup, isValid, router, resetForm]);

    // Validation callbacks (Memoized to prevent prop-drilling re-renders)
    const checkPassword = useCallback(() => {
        const { form } = useSignupStore.getState();
        if (form.password !== form.confirmPassword) {
            return 'Passwords do not match.';
        }
    }, []);

    const checkEmail = useCallback(() => {
        const { form } = useSignupStore.getState();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return 'Invalid email format';
        }
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type='title' style={styles.title}>Create Account</ThemedText>

            <ControlledField
                formKey="name"
                label="Full Name"
                errorsRef={errorsRef}
            />

            <ControlledField
                formKey="email"
                label="Email"
                errorsRef={errorsRef}
                autoCapitalize="none"
                keyboardType="email-address"
                validate={checkEmail}
            />

            <ControlledField
                formKey="password"
                label="Password"
                errorsRef={errorsRef}
                secureTextEntry
                minLength={6}
            />

            <ControlledField
                formKey="confirmPassword"
                label="Confirm Password"
                errorsRef={errorsRef}
                secureTextEntry
                validate={checkPassword}
            />

            <ThemedButton type='success' onPress={handleSignup} disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
            </ThemedButton>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.linkText}>Already have an account? Login</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

type SignupFormKey = keyof ReturnType<typeof useSignupStore.getState>['form'];

interface ControlledFieldProps {
    formKey: SignupFormKey;
    label: string;
    errorsRef: any;
    validate?: (value: string) => string | undefined;
    isRequired?: boolean;
    minLength?: number;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric';
}

const ControlledField = memo(({
    formKey,
    label,
    errorsRef,
    validate,
    isRequired = true,
    minLength,
    ...inputProps
}: ControlledFieldProps) => {

    // SELECTOR: This is the magic part. 
    // It only re-renders this specific field when its own key in Zustand changes.
    const value = useSignupStore((state) => state.form[formKey]);
    const setField = useSignupStore((state) => state.setField);

    return (
        <FormGroup>
            <ThemedTextInput
                placeholder={label}
                value={value}
                onChangeText={(val) => setField(formKey, val)}
                {...inputProps}
            />
            <ValidateInput
                errorsRef={errorsRef}
                name={label}
                value={value}
                isRequired={isRequired}
                minLength={minLength}
                validate={validate}
            />
        </FormGroup>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { marginBottom: 30, textAlign: 'center' },
    linkText: { color: '#007AFF', marginTop: 20, textAlign: 'center' },
});
