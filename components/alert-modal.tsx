import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlertStore } from '@/store/useAlertStore';
import { StyleSheet } from 'react-native';
import ThemedButton from './themed-button';

export default function GlobalModal() {
    const { message, title, clearMessage } = useAlertStore();

    const handleClose = () => {
        clearMessage();
    };

    if (!message) return null;

    return (
        // This outer view covers the whole screen and dims the background
        <ThemedView style={styles.overlay}>
            {/* This is the actual centered card */}
            <ThemedView style={styles.modalCard}>
                {!!title && <ThemedText type="title" style={styles.title}>{title}</ThemedText>}

                <ThemedText style={styles.message}>
                    {message}
                </ThemedText>

                <ThemedButton onPress={handleClose}>
                    OK
                </ThemedButton>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        // This ensures it breaks out of any parent containers
        ...StyleSheet.absoluteFillObject,

        // Ensure it sits on top of everything
        zIndex: 1000,

        // This makes the background transparent/dimmed
        backgroundColor: 'rgba(0,0,0,0.7)',

        // Standard centering logic
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: {
        width: '90%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        // Elevation for Android
        elevation: 10,
    },
    title: { marginBottom: 15, color: '#E5484D', textAlign: 'center' },
    message: { textAlign: 'center', marginBottom: 40, opacity: 0.7, lineHeight: 22 },
});