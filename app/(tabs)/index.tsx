import { Image } from 'expo-image';
import { Appearance, StyleSheet, useColorScheme, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import ThemedButton from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useCallback } from 'react';

export default function HomeScreen() {
  const { user } = useAuth()
  const { userName, email } = user || {}
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    // Mock Logout logic
    // In a real app, you'd fetch() from an API here
    logout()
  }, []);

  const colorScheme = useColorScheme();
  const handleSwitchTheme = useCallback(() => {
    Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      <ThemedView style={styles.infoCard}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Hello {userName}!</ThemedText>
          <HelloWave />
        </View>
        <ThemedText type="default">
          Your Email: <ThemedText type="defaultSemiBold">{email}</ThemedText>
        </ThemedText>
      </ThemedView>

      <ThemedButton type="primary" onPress={handleSwitchTheme}>Switch Theme</ThemedButton>
      <ThemedButton type="danger" onPress={handleLogout}>Logout</ThemedButton>

      <ThemedView style={styles.contentSection}>
        <ThemedText style={styles.poeticText}>
          "To know oneself is the beginning of all wisdom."
        </ThemedText>

        <ThemedText>
          Your account was established within the digital ether. Here, you can manage your presence and security settings.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subTitleContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    gap: 8,
  },
  contentSection: {
    gap: 16,
    marginBottom: 40,
  },
  poeticText: {
    fontStyle: 'italic',
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 20,
  },
});
