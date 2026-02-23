import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateToHome(): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate('MainTabs', { screen: 'Home' });
  }
}
