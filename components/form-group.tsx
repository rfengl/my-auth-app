import { StyleSheet, View, ViewProps } from "react-native";

export default function FormGroup({ children }: ViewProps) {
    return <View style={styles.viewStyle}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    viewStyle: {
        marginBottom: 15
    }
})