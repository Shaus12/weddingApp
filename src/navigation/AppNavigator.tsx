import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import CountdownScreen from '../screens/Home/CountdownScreen';
import ImageUploadScreen from '../screens/Onboarding/ImageUploadScreen';
import StyleSelectionScreen from '../screens/Onboarding/StyleSelectionScreen';
import QuestionnaireScreen from '../screens/Onboarding/QuestionnaireScreen';
import MagicScreen from '../screens/Onboarding/MagicScreen';
import SaveTheDateScreen from '../screens/Home/SaveTheDateScreen';
import GalleryScreen from '../screens/Home/GalleryScreen';
import LetterGeneratorScreen from '../screens/Home/LetterGeneratorScreen';
import PaywallScreen from '../screens/Paywall/PaywallScreen';
import RemindersScreen from '../screens/Home/RemindersScreen';
import OptionsScreen from '../screens/Home/OptionsScreen';
import DailyTipsScreen from '../screens/Home/DailyTipsScreen';
import { useUserStore } from '../store/useUserStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isOnboardingCompleted } = useUserStore();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={isOnboardingCompleted ? 'Countdown' : 'Welcome'}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
                <Stack.Screen name="StyleSelection" component={StyleSelectionScreen} />
                <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
                <Stack.Screen name="Magic" component={MagicScreen} />
                <Stack.Screen name="Countdown" component={CountdownScreen} />
                <Stack.Screen name="SaveTheDate" component={SaveTheDateScreen} />
                <Stack.Screen name="Paywall" component={PaywallScreen} />
                <Stack.Screen name="Gallery" component={GalleryScreen} />
                <Stack.Screen name="LetterGenerator" component={LetterGeneratorScreen} />
                <Stack.Screen name="Reminders" component={RemindersScreen} />
                <Stack.Screen
                    name="Options"
                    component={OptionsScreen}
                    options={{ animation: 'slide_from_left' }}
                />
                <Stack.Screen
                    name="DailyTips"
                    component={DailyTipsScreen}
                    options={{ animation: 'slide_from_right' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
