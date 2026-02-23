import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { View, AppState, AppStateStatus } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import { NotoSerif_400Regular, NotoSerif_700Bold } from '@expo-google-fonts/noto-serif';
import { NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold } from '@expo-google-fonts/noto-sans';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUserStore } from './src/store/useUserStore';
import { ensureInstallationId } from './src/services/deviceIdService';
import { incrementLaunchCount, getPremiumPopupShown } from './src/services/launchCountService';
import { getNotifPromptDismissed } from './src/services/notificationSettingsService';
import { loadNotificationSettings } from './src/services/notificationSettingsService';
import { topUp } from './src/services/notificationScheduler';
import { navigateToHome } from './src/navigation/navigationRef';
import NotifPromptBottomSheet from './src/components/NotifPromptBottomSheet';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// So scheduled notifications are shown when triggered
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const weddingDate = useUserStore((s) => s.weddingDate);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          NotoSerif_400Regular,
          NotoSerif_700Bold,
          NotoSans_400Regular,
          NotoSans_500Medium,
          NotoSans_600SemiBold,
        });
        // Device-based installation ID for Save The Date video cache/quota
        const id = await ensureInstallationId();
        useUserStore.getState().setInstallationId(id);
        // One-time premium promo on 2nd app open
        const launchCount = await incrementLaunchCount();
        const popupShown = await getPremiumPopupShown();
        const isPremium = useUserStore.getState().isPremium;
        const isTrialActive = useUserStore.getState().isTrialActive;
        if (launchCount === 2 && !popupShown && !isPremium && !isTrialActive) {
          useUserStore.getState().setShowPremiumPromoPopup(true);
        }
        // Notification permission prompt on 2nd app open (do not show if dismissed or already enabled)
        if (launchCount === 2) {
          const dismissed = await getNotifPromptDismissed();
          const notifSettings = await loadNotificationSettings();
          if (!dismissed && !notifSettings.dailyReminderEnabled) {
            setShowNotifPrompt(true);
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Deep link to Home when user taps a countdown notification
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = response.notification.request.content.data?.route;
      if (route === 'Home') navigateToHome();
    });
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification.request.content.data?.route === 'Home') {
        navigateToHome();
      }
    });
    return () => sub.remove();
  }, []);

  // Rolling window top-up: on app start (after settings loaded)
  useEffect(() => {
    if (!appIsReady) return;
    const wedding = useUserStore.getState().weddingDate;
    if (!wedding) return;
    loadNotificationSettings().then((settings) => {
      if (settings.dailyReminderEnabled) {
        topUp(wedding, settings).catch((e) => console.warn('Notif topUp on start', e));
      }
    });
  }, [appIsReady]);

  // Rolling window top-up: on app resume (AppState active)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;
      const wedding = useUserStore.getState().weddingDate;
      if (!wedding) return;
      loadNotificationSettings().then((settings) => {
        if (settings.dailyReminderEnabled) {
          topUp(wedding, settings).catch((e) => console.warn('Notif topUp on resume', e));
        }
      });
    });
    return () => subscription.remove();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppNavigator />
        <NotifPromptBottomSheet
          visible={showNotifPrompt}
          onClose={() => setShowNotifPrompt(false)}
          weddingDate={weddingDate}
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
