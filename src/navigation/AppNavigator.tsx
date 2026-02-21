import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

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
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Save The Date') iconName = 'favorite';
                    else if (route.name === 'Agenda') iconName = 'list-alt';
                    else if (route.name === 'Options') iconName = 'settings';

                    return <MaterialIcons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.slate400,
                tabBarStyle: {
                    backgroundColor: COLORS.backgroundLight,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.primary + '1A',
                    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
                    paddingTop: 10,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    ...SHADOWS.md,
                },
                tabBarLabelStyle: {
                    fontFamily: FONTS.sansMedium,
                    fontSize: 10,
                    marginTop: 2,
                },
            })}
        >
            <Tab.Screen name="Home" component={CountdownScreen} />
            <Tab.Screen name="Save The Date" component={SaveTheDateScreen} />
            <Tab.Screen name="Agenda" component={RemindersScreen} />
            <Tab.Screen name="Options" component={OptionsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { isOnboardingCompleted } = useUserStore();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={isOnboardingCompleted ? 'MainTabs' : 'Welcome'}
            >
                {/* Auth/Onboarding Flow */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
                <Stack.Screen name="StyleSelection" component={StyleSelectionScreen} />
                <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
                <Stack.Screen name="Magic" component={MagicScreen} />

                {/* Main App via Tabs */}
                <Stack.Screen name="MainTabs" component={MainTabs} />

                {/* Modals/Deep Screens over Tabs */}
                <Stack.Screen name="Paywall" component={PaywallScreen} />
                <Stack.Screen name="Gallery" component={GalleryScreen} />
                <Stack.Screen name="LetterGenerator" component={LetterGeneratorScreen} />
                <Stack.Screen
                    name="DailyTips"
                    component={DailyTipsScreen}
                    options={{ animation: 'slide_from_right' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
