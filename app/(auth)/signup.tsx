import FormGroup from '@/components/form-group';
import PasswordInput from '@/components/password-input';
import ThemedButton from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import ValidateInput from '@/components/validate-input';
import { showAlert } from '@/utils/alert';
import startValidate from '@/utils/start-validation';
import { validateEmail } from '@/utils/validate-utils';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { signup } = useAuth();
    const router = useRouter();

    const errorsRef = useRef<any>({})

    const handleSignup = useCallback(() => {
        // 1. Basic Validation
        if (!name || !email || !password || !confirmPassword) {
            startValidate(name, setName)
            startValidate(email, setEmail)
            startValidate(password, setPassword)
            startValidate(confirmPassword, setConfirmPassword)

            const errors: string[] = []
            for (var i in errorsRef.current) {
                errors.push(errorsRef.current[i])
            }

            showAlert(`Please fill in all fields:\r\n${errors.join('\r\n')}`);
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Passwords do not match");
            return;
        }

        // 2. Mock Registration Logic
        // Here you would normally use fetch() to POST to your backend
        const newUser = { userName: name, email, password };

        // 3. Log the user in immediately after signup
        signup(newUser, (error) => {
            if (error) {
                setErrorMsg(error)
            } else {
                showAlert(`Your account was created successfully.\r\nWe are preparing your path to the login page.`);
                // 4. Redirect to the login
                router.replace('/(auth)/login');
            }
        });
    }, [name, email, password, confirmPassword]);

    const checkPassword = useCallback(() => {
        if ((password || '') !== (confirmPassword || '')) {
            return 'Password confirmation does not match.'
        }
    }, [password, confirmPassword])

    const checkEmail = useCallback(() => {
        if (!validateEmail(email)) {
            return 'Invalid email format'
        }
    }, [email])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={styles.scrollview}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === 'web'}>
                    <ThemedView style={styles.container}>
                        <ThemedText type='title' style={styles.title}>Create Account</ThemedText>

                        <FormGroup>
                            <ThemedTextInput
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                            />
                            <ValidateInput errorsRef={errorsRef} name="Full Name" value={name} isRequired />
                        </FormGroup>

                        <FormGroup>
                            <ThemedTextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <ValidateInput errorsRef={errorsRef} name="Email" value={email} isRequired validate={checkEmail} />
                        </FormGroup>

                        <FormGroup>
                            <PasswordInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            <ValidateInput errorsRef={errorsRef} name="Password" value={password} isRequired minLength={6} />
                        </FormGroup>

                        <FormGroup>
                            <PasswordInput
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                            <ValidateInput errorsRef={errorsRef} name="Confirm Password" value={confirmPassword} isRequired validate={checkPassword} />
                        </FormGroup>

                        {!!errorMsg && <FormGroup>
                            <ThemedText type="error">{errorMsg}</ThemedText>
                        </FormGroup>}

                        <ThemedButton type='success' onPress={handleSignup}>Sign Up</ThemedButton>

                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <ThemedText style={styles.linkText}>Already have an account? Login</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollview: { flex: 1, justifyContent: 'center' },
    container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    title: { marginBottom: 30, textAlign: 'center' },
    linkText: { color: '#007AFF', marginTop: 20, textAlign: 'center' },
});