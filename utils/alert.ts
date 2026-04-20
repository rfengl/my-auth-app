import { useAlertStore } from '@/store/useAlertStore';

export function showAlert(msg: string) {
    useAlertStore.getState().setMessage(msg)
    // if (Platform.OS === 'web') {
    //     window.alert(msg);
    // } else {
    //     Alert.alert(msg);
    // }
};