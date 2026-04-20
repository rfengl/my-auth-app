import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export default function LoadingPleaseWait() {
    return <ThemedView style={styles.layout}>
        <ThemedText type="title" style={styles.text}>Brewing a dream in silence...</ThemedText>
    </ThemedView>
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center'
    }
});
