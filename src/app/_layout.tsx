import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { setupStore } from '@/src/store/store';
import { useColorScheme } from '@/src/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const store = setupStore();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'A.AlleycatICG.Alen_.Rus_': require('./../assets/fonts/A.AlleycatICG.Alen_.Rus_.ttf'),
    'lombardina-initial-two': require('./../assets/fonts/lombardina-initial-two.ttf'),
    'ofont.ru_Palatino-Normal': require('./../assets/fonts/ofont.ru_Palatino-Normal.ttf'),
    'VezitsaCyrillic': require('./../assets/fonts/VezitsaCyrillic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}