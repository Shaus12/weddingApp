import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    partner1Name: string;
    partner2Name: string;
    weddingDate: string | null; // Stored as ISO string
    baseImage: string | null;
    style: string | null;
    story: string;
    adjectives: string;
    countdownPosition: number; // Percentage from bottom (e.g. 20, 50, 80)
    isOnboardingCompleted: boolean;
    firstTimeHintShown: boolean;
    dailySentenceEnabled: boolean;
    isPremium: boolean;

    setNames: (p1: string, p2: string) => void;
    setWeddingDate: (date: string) => void;
    setBaseImage: (uri: string) => void;
    setStyle: (style: string) => void;
    setStoryDetails: (story: string, adjectives: string) => void;
    setCountdownPosition: (position: number) => void;
    completeOnboarding: () => void;
    setFirstTimeHintShown: (shown: boolean) => void;
    setDailySentenceEnabled: (enabled: boolean) => void;
    setIsPremium: (val: boolean) => void;
    reset: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            partner1Name: '',
            partner2Name: '',
            weddingDate: null,
            baseImage: null,
            style: null,
            story: '',
            adjectives: '',
            countdownPosition: 20, // Default 20% from bottom
            isOnboardingCompleted: false,
            firstTimeHintShown: false,
            dailySentenceEnabled: true,
            isPremium: false,

            setNames: (p1, p2) => set({ partner1Name: p1, partner2Name: p2 }),
            setWeddingDate: (date) => set({ weddingDate: date }),
            setBaseImage: (uri) => set({ baseImage: uri }),
            setStyle: (style) => set({ style }),
            setStoryDetails: (story, adjectives) => set({ story, adjectives }),
            setCountdownPosition: (position) => set({ countdownPosition: position }),
            completeOnboarding: () => set({ isOnboardingCompleted: true }),
            setFirstTimeHintShown: (shown) => set({ firstTimeHintShown: shown }),
            setDailySentenceEnabled: (enabled) => set({ dailySentenceEnabled: enabled }),
            setIsPremium: (val) => set({ isPremium: val }),
            reset: () => set({
                partner1Name: '',
                partner2Name: '',
                weddingDate: null,
                baseImage: null,
                style: null,
                story: '',
                adjectives: '',
                countdownPosition: 20,
                isOnboardingCompleted: false,
                firstTimeHintShown: false,
                dailySentenceEnabled: true,
                isPremium: false,
            }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
