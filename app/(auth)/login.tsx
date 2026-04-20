import FormGroup from '@/components/form-group';
import PasswordInput from '@/components/password-input';
import ThemedButton from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import ValidateInput from '@/components/validate-input';
import { showAlert } from '@/utils/alert';
import startValidate from '@/utils/start-validation';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = useCallback(() => {
        // Basic validation
        if (!email || !password) {
            startValidate(email, setEmail)
            startValidate(password, setPassword)

            showAlert("Please enter your email and password to continue...");
            return;
        }

        // Mock Authentication logic
        // In a real app, you'd fetch() from an API here
        login(email, password, (error) => {
            if (error) {
                setErrorMsg(error)
            } else {
                // Redirect to the home screen after successful login
                router.replace('/(tabs)');
            }
        })
    }, [email, password]);

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
                        <ThemedText type='title' style={styles.title}>Welcome Back</ThemedText>

                        <FormGroup>
                            <ThemedTextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <ValidateInput name="Email" value={email} isRequired />
                        </FormGroup>

                        <FormGroup>
                            <PasswordInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <ValidateInput name="Password" value={password} isRequired />
                        </FormGroup>

                        {!!errorMsg && <FormGroup>
                            <ThemedText type="error">{errorMsg}</ThemedText>
                        </FormGroup>}

                        <ThemedButton onPress={handleLogin}>Login</ThemedButton>

                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <ThemedText style={styles.linkText}>Don't have an account? Sign Up</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollview: { flex: 1, justifyContent: 'center' },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { marginBottom: 30, textAlign: 'center' },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    linkText: { color: '#007AFF', marginTop: 20, textAlign: 'center' },
});