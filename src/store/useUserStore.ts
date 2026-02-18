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
    isOnboardingCompleted: boolean;

    setNames: (p1: string, p2: string) => void;
    setWeddingDate: (date: string) => void;
    setBaseImage: (uri: string) => void;
    setStyle: (style: string) => void;
    setStoryDetails: (story: string, adjectives: string) => void;
    completeOnboarding: () => void;
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
            isOnboardingCompleted: false,

            setNames: (p1, p2) => set({ partner1Name: p1, partner2Name: p2 }),
            setWeddingDate: (date) => set({ weddingDate: date }),
            setBaseImage: (uri) => set({ baseImage: uri }),
            setStyle: (style) => set({ style }),
            setStoryDetails: (story, adjectives) => set({ story, adjectives }),
            completeOnboarding: () => set({ isOnboardingCompleted: true }),
            reset: () => set({
                partner1Name: '',
                partner2Name: '',
                weddingDate: null,
                baseImage: null,
                style: null,
                story: '',
                adjectives: '',
                isOnboardingCompleted: false,
            }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
