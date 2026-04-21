import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    ViewStyle
} from 'react-native';
import { ThemedView } from './themed-view';

interface KeyboardDismissProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

export default function KeyboardDismiss({
    children,
    style,
    contentContainerStyle
}: KeyboardDismissProps) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}
        >
            <ScrollView
                contentContainerStyle={[styles.scrollview, contentContainerStyle]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    disabled={Platform.OS === 'web'}
                >
                    {/* We wrap children in a ThemedView to ensure background colors match the theme */}
                    <ThemedView style={[styles.container, style]}>
                        {children}
                    </ThemedView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollview: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
    },
});