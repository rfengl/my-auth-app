import { useRouter } from 'expo-router';
import React, { memo, RefObject, useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useAuth } from '@/context/AuthContext';

import FormGroup from '@/components/form-group';
import KeyboardDismiss from '@/components/keyboard-dismiss';
import PasswordInput from '@/components/password-input';
import ThemedButton from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import ValidateInput from '@/components/validate-input';
import { useSignupStore } from '@/store/useSignupStore';
import { showAlert } from '@/utils/alert';
import { validateEmail } from '@/utils/validate-utils';

export default function SignupScreen() {
    const router = useRouter();
    const { signup } = useAuth();

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

    const checkPassword = useCallback(() => {
        const { form } = useSignupStore.getState();
        if (form.password !== form.confirmPassword && form.confirmPassword) {
            return 'Passwords do not match with confirm password.';
        }
    }, []);

    const checkEmail = useCallback(() => {
        const { form } = useSignupStore.getState();
        if (!validateEmail(form.email)) {
            return 'Invalid email format'
        }
    }, []);

    return (
        <KeyboardDismiss>
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
                    validate={checkPassword}
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
        </KeyboardDismiss>
    );
}

type SignupFormKey = keyof ReturnType<typeof useSignupStore.getState>['form'];

interface ControlledFieldProps {
    formKey: SignupFormKey;
    label: string;
    errorsRef: RefObject<any>;
    validate?: (value: string) => string | undefined;
    isRequired?: boolean;
    minLength?: number;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric';
}

// We reuse ControlledField to keep things efficient. No need to re-render the whole screen for every single input changed. 
// This one solves the performance 'overload' especially when you have many fields.
const ControlledField = memo(({
    formKey,
    label,
    errorsRef,
    validate,
    isRequired = true,
    minLength,
    secureTextEntry,
    ...inputProps
}: ControlledFieldProps) => {
    const value = useSignupStore((state) => state.form[formKey]);
    const setField = useSignupStore((state) => state.setField);

    return (
        <FormGroup>
            {secureTextEntry
                ? <PasswordInput
                    placeholder={label}
                    value={value}
                    onChangeText={(val) => setField(formKey, val)}
                    {...inputProps}
                />
                : <ThemedTextInput
                    placeholder={label}
                    value={value}
                    onChangeText={(val) => setField(formKey, val)}
                    {...inputProps}
                />}
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
