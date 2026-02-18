import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateScenePrompts, generateImage } from '../../services/aiService';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - SPACING.l * 2 - SPACING.m) / 2;

interface GalleryItem {
    id: string;
    title: string;
    imageUri: string | null;
    loading: boolean;
}

export default function GalleryScreen({ navigation }: any) {
    const { partner1Name, partner2Name } = useUserStore();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loadingPrompts, setLoadingPrompts] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadGallery = useCallback(async () => {
        setLoadingPrompts(true);

        // Step 1: Generate scene prompts
        const prompts = await generateScenePrompts(partner1Name, partner2Name, 6);

        // Create items with loading state
        const newItems: GalleryItem[] = prompts.map((prompt, i) => ({
            id: String(i + 1),
            title: prompt,
            imageUri: null,
            loading: true,
        }));
        setItems(newItems);
        setLoadingPrompts(false);

        // Step 2: Generate images one-by-one (to show progress)
        for (let i = 0; i < newItems.length; i++) {
            const imageUri = await generateImage(prompts[i]);
            setItems(prev =>
                prev.map((item, idx) =>
                    idx === i ? { ...item, imageUri, loading: false } : item
                )
            );
        }
    }, [partner1Name, partner2Name]);

    useEffect(() => {
        loadGallery();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadGallery();
        setRefreshing(false);
    }, [loadGallery]);

    const renderItem = ({ item }: { item: GalleryItem }) => (
        <View style={styles.card}>
            {item.loading ? (
                <View style={[styles.imagePlaceholder, { backgroundColor: '#F5F0E8' }]}>
                    <ActivityIndicator size="small" color={COLORS.gold} />
                    <Text style={styles.loadingLabel}>Generating...</Text>
                </View>
            ) : item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: '#F0E6E6' }]}>
                    <Text style={styles.errorLabel}>✗</Text>
                </View>
            )}
            <View style={styles.overlay}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>AI Art Gallery</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LetterGenerator')} style={styles.letterButton}>
                    <Text style={styles.letterButtonText}>💌</Text>
                </TouchableOpacity>
            </View>

            {loadingPrompts ? (
                <View style={styles.centeredLoader}>
                    <ActivityIndicator size="large" color={COLORS.gold} />
                    <Text style={styles.centeredLoaderText}>Dreaming up scenes for you...</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.l,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: SPACING.l,
        padding: SPACING.s,
    },
    backButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.text,
    },
    letterButton: {
        position: 'absolute',
        right: SPACING.l,
        padding: SPACING.s,
    },
    letterButtonText: {
        fontSize: 24,
    },
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 24,
        color: COLORS.text,
    },
    list: {
        padding: SPACING.l,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    card: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE * 1.2,
        borderRadius: SPACING.m,
        backgroundColor: COLORS.white,
        ...SHADOWS.small,
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: SPACING.m,
        borderTopRightRadius: SPACING.m,
    },
    image: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: SPACING.m,
        borderTopRightRadius: SPACING.m,
    },
    overlay: {
        padding: SPACING.s,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottomLeftRadius: SPACING.m,
        borderBottomRightRadius: SPACING.m,
    },
    cardTitle: {
        fontFamily: FONTS.sans,
        fontSize: 11,
        color: COLORS.text,
        textAlign: 'center',
    },
    loadingLabel: {
        marginTop: SPACING.xs,
        fontFamily: FONTS.sans,
        fontSize: 11,
        color: COLORS.textLight,
    },
    errorLabel: {
        fontSize: 24,
        color: COLORS.error,
    },
    centeredLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredLoaderText: {
        marginTop: SPACING.m,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
    },
});
