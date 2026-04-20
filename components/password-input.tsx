import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'; // 1. Need useState
import { Pressable, StyleSheet } from "react-native";
import { ThemedTextInput, ThemedTextInputProps } from "./themed-text-input";
import { ThemedView } from "./themed-view";

export default function PasswordInput(props: ThemedTextInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <ThemedView style={styles.inputContainer}>
            <ThemedTextInput
                {...props}
                style={[styles.default, props.style]}
                secureTextEntry={!isPasswordVisible}
            />

            <Pressable
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.iconContainer}
            >
                <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={22}
                    color="#808080"
                />
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderLeftWidth: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        height: '100%',
        minHeight: 50,
    },
    default: {
        flex: 1,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
});