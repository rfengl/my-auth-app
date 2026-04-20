import { useThemeColor } from '@/hooks/use-theme-color'; // Path based on Expo template
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    ...rest
}: ThemedTextInputProps) {
    // 1. Get the theme-appropriate colors
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const placeholderColor = useThemeColor({}, 'tabIconDefault'); // or any muted color from your constants
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <TextInput
            style={[{ color, backgroundColor }, styles.default, style]}
            placeholderTextColor={placeholderColor}
            // On iOS, this makes the keyboard dark/light automatically
            keyboardAppearance={color === '#fff' ? 'dark' : 'light'}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc', // You can also theme the border color!
    },
});