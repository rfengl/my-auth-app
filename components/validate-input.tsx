import { RefObject, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";

export default function ValidateInput({ errorsRef, name, value, isRequired, minLength, validate }: {
    errorsRef?: RefObject<any>
    name: string
    value: string
    isRequired?: boolean
    minLength?: number
    validate?: (v: string) => string | null | undefined
}) {
    const [isStart, setIsStart] = useState<boolean | null>(null)

    useEffect(() => {
        if (isStart === false) {
            setIsStart(true)
        } else if (isStart === null) {
            setIsStart(false)
        }
    }, [value])

    let errorMsg: string | null | undefined = null
    if (isRequired && !value) {
        errorMsg = `${name} is mandatory to fill in.`
    } else if (validate) {
        errorMsg = validate(value)
    }

    if (minLength && !errorMsg && (value || '').length < minLength) {
        errorMsg = `${name} length less than ${minLength} characters..`
    }

    if (errorsRef) {
        errorsRef.current = {
            ...errorsRef.current,
            [name]: errorMsg
        }
    }

    if (!errorMsg || !isStart) {
        return null
    }

    return <ThemedText type="error" style={[styles.errorText]}>
        {errorMsg}
    </ThemedText>
}

const styles = StyleSheet.create({
    errorText: {
        marginTop: 3
    }
})