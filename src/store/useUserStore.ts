import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeddingTask {
    id: string;
    title: string;
    completed: boolean;
    date?: string;
    priority?: boolean;
}

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
    tasks: WeddingTask[];

    // New fields for Daily AI Image Feature & Paywall
    dailyImageUrl: string | null;
    lastDailyImageDate: string | null; // ISO Date String to track when it was generated
    isTrialActive: boolean;
    trialStartDate: string | null;

    // Preferences
    language: string;
    hasRecreatedToday: boolean;
    lastRecreatedDate: string | null;

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

    setDailyImage: (url: string, date: string) => void;
    startFreeTrial: () => void;
    setLanguage: (lang: string) => void;
    setHasRecreatedToday: (hasRecreated: boolean, date: string) => void;

    // Task actions
    toggleTask: (id: string) => void;
    addTask: (title: string, date?: string, priority?: boolean) => void;
    deleteTask: (id: string) => void;

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
            dailyImageUrl: null,
            lastDailyImageDate: null,
            isTrialActive: false,
            trialStartDate: null,
            language: 'en',
            hasRecreatedToday: false,
            lastRecreatedDate: null,
            tasks: [
                { id: '1', title: 'Secure the Dream Venue', completed: false, priority: true },
                { id: '2', title: 'Finalize Guest List', completed: false, priority: true },
                { id: '3', title: 'Book Wedding Photographer', completed: false },
                { id: '4', title: 'Start Dress Shopping', completed: false },
            ],

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

            setDailyImage: (url, date) => set({ dailyImageUrl: url, lastDailyImageDate: date }),
            startFreeTrial: () => set({ isTrialActive: true, trialStartDate: new Date().toISOString() }),
            setLanguage: (lang) => set({ language: lang }),
            setHasRecreatedToday: (hasRecreated, date) => set({ hasRecreatedToday: hasRecreated, lastRecreatedDate: date }),

            // Tasks
            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            })),
            addTask: (title, date, priority) => set((state) => ({
                tasks: [...state.tasks, { id: Math.random().toString(36).substr(2, 9), title, completed: false, date, priority }]
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

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
                dailyImageUrl: null,
                lastDailyImageDate: null,
                isTrialActive: false,
                trialStartDate: null,
                language: 'en',
                hasRecreatedToday: false,
                lastRecreatedDate: null,
                tasks: [
                    { id: '1', title: 'Secure the Dream Venue', completed: false, priority: true },
                    { id: '2', title: 'Finalize Guest List', completed: false, priority: true },
                    { id: '3', title: 'Book Wedding Photographer', completed: false },
                    { id: '4', title: 'Start Dress Shopping', completed: false },
                ],
            }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
