import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type ContentType = 'Insight' | 'Prompt' | 'Fact' | 'Memory';

interface DailyItem {
    type: ContentType;
    title: string;
    content: string;
    emoji: string;
}

const DAILY_CONTENT: DailyItem[] = [
    {
        type: 'Insight',
        title: 'Wedding Journey Insight',
        content: "You're entering the planning phase. Take a deep breath and enjoy the creative process of designing your special day.",
        emoji: '✨'
    },
    {
        type: 'Prompt',
        title: 'Emotional Prompt',
        content: "Talk about your first dance tonight. What song feels like 'you' as a couple?",
        emoji: '💃'
    },
    {
        type: 'Fact',
        title: 'Wedding Fact',
        content: "Most invitations are sent 60 days before the wedding to give guests plenty of time to RSVP.",
        emoji: '✉️'
    },
    {
        type: 'Memory',
        title: 'Memory Trigger',
        content: "Take a photo together today. These little moments in your journey are just as precious as the big day.",
        emoji: '📸'
    },
    {
        type: 'Insight',
        title: 'Wedding Journey Insight',
        content: "This is a great time to think about music. What melodies will define the atmosphere of your ceremony?",
        emoji: '🎵'
    },
    {
        type: 'Prompt',
        title: 'Emotional Prompt',
        content: "What moment are you most excited for? Share it with each other and visualize the joy.",
        emoji: '❤️'
    },
    {
        type: 'Fact',
        title: 'Wedding Fact',
        content: "Average planning time is 12 months, allowing for a relaxed pace and thoughtful decisions.",
        emoji: '📅'
    },
    {
        type: 'Prompt',
        title: 'Emotional Prompt',
        content: "What made you say yes? Reflect on the early days of your love and the growth of your bond.",
        emoji: '💍'
    },
    {
        type: 'Insight',
        title: 'Wedding Journey Insight',
        content: "Most couples start choosing outfits around this stage. Explore styles that make you feel truly yourself.",
        emoji: '👔'
    },
    {
        type: 'Memory',
        title: 'Memory Trigger',
        content: "Capture this moment in your journey. Write down one thing that made you smile today.",
        emoji: '📝'
    }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const SPACING_X = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function DailyTipsScreen({ navigation }: any) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Selection logic: deterministic rotation based on local calendar day
    const today = new Date();
    const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // Create a simple hash from the date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0;
    }
    const dailyHash = Math.abs(hash);

    // Filter items by type and pick one for each based on the day
    const categories: ContentType[] = ['Insight', 'Prompt', 'Fact', 'Memory'];
    const activeItems = categories.map(type => {
        const typeItems = DAILY_CONTENT.filter(item => item.type === type);
        return typeItems[dailyHash % typeItems.length];
    });

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollOffset / SCREEN_WIDTH);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const renderItem = ({ item }: { item: DailyItem }) => (
        <View style={styles.cardWrapper}>
            <View style={styles.card}>
                <View style={styles.typeTag}>
                    <Text style={styles.typeEmoji}>{item.emoji}</Text>
                    <Text style={styles.typeText}>{item.title.toUpperCase()}</Text>
                </View>

                <Text style={styles.mainContent}>
                    {item.content}
                </Text>

                <View style={styles.footerDecoration}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.dotLarge]} />
                    <View style={styles.dot} />
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF5F5', '#FFE4E1']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Text style={styles.title}>Daily Moments</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <FlatList
                    data={activeItems}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.flatListContent}
                    snapToInterval={SCREEN_WIDTH}
                    decelerationRate="fast"
                />

                <View style={styles.pagination}>
                    {activeItems.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === activeIndex && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.hintContainer}>
                <Text style={styles.hintText}>Swipe to explore your moments.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        marginBottom: SPACING.m,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        right: SPACING.l,
        top: SPACING.m,
        padding: SPACING.xs,
    },
    backButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 24,
        color: COLORS.textLight,
    },
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 22,
        color: COLORS.text,
        letterSpacing: 1,
    },
    flatListContent: {
        alignItems: 'center',
    },
    cardWrapper: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING_X,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 32,
        padding: SPACING.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        minHeight: 350,
        justifyContent: 'center',
    },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 140, 148, 0.1)',
        paddingHorizontal: SPACING.m,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: SPACING.xl,
    },
    typeEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    typeText: {
        fontFamily: FONTS.sansBold,
        fontSize: 12,
        color: COLORS.accent || '#FF8C94',
        letterSpacing: 2,
    },
    mainContent: {
        fontFamily: FONTS.serifBold,
        fontSize: 28,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 38,
    },
    footerDecoration: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xxl,
        gap: SPACING.s,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dotLarge: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 140, 148, 0.3)',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.l,
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    paginationDotActive: {
        width: 20,
        backgroundColor: COLORS.accent || '#FF8C94',
    },
    hintContainer: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    hintText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        opacity: 0.8,
    },
});
