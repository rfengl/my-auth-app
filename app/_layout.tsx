import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import GlobalModal from '@/components/alert-modal';
import LoadingPleaseWait from '@/components/loading-please-wait';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth()
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't redirect while checking login status

    // Check if the user is currently inside the (auth) folder group
    const inAuthGroup = segments[0] === '(auth)';

    if ((!user || !user.token) && !inAuthGroup) {
      // 1. If NOT logged in and trying to access (tabs) or other pages
      // Redirect them to the login page immediately
      router.replace('/(auth)/login');
    } else if (user.token && inAuthGroup) {
      // 2. If ALREADY logged in and trying to go back to login/signup
      // Redirect them to the main app (tabs)
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <LoadingPleaseWait />
    </ThemeProvider>
  }

  return <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
    <GlobalModal />
    <StatusBar style="auto" />
  </ThemeProvider>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
