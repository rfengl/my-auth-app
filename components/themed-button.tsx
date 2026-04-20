import { useThemeColor } from "@/hooks/use-theme-color";
import { GestureResponderEvent, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText, ThemedTextProps } from "./themed-text";

type ThemedButtonType = 'primary' | 'warning' | 'danger' | 'success'

export default function ThemedButton({ style, type, onPress, ...rest }: Omit<ThemedTextProps, 'type'> & {
    type?: ThemedButtonType
    onPress: ((event: GestureResponderEvent) => void) | undefined
}) {
    const backgroundColor = useThemeColor({}, type || 'primary')

    return <TouchableOpacity style={[styles.button, {
        backgroundColor
    }]} onPress={onPress}>
        <ThemedText {...rest} style={[styles.buttonText, style]} />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    button: { padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});