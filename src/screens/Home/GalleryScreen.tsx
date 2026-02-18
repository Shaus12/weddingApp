import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - SPACING.l * 2 - SPACING.m) / 2;

// Mock data for gallery
const GALLERY_DATA = [
    { id: '1', title: 'Vintage Dream', color: '#E6D7C3' },
    { id: '2', title: 'Royal Bloom', color: '#F0E6FA' },
    { id: '3', title: 'Modern Love', color: '#E0F7FA' },
    { id: '4', title: 'Boho Sunset', color: '#FFF3E0' },
    { id: '5', title: 'Classic B&W', color: '#EEEEEE' },
    { id: '6', title: 'Golden Hour', color: '#FFF8E1' },
];

export default function GalleryScreen({ navigation }: any) {
    const { baseImage } = useUserStore();

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.card}>
            <View style={[styles.imagePlaceholder, { backgroundColor: item.color }]}>
                {baseImage && <Image source={{ uri: baseImage }} style={[styles.image, { opacity: 0.7 }]} />}
                <View style={styles.overlay}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Daily AI Art</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LetterGenerator')} style={styles.letterButton}>
                    <Text style={styles.letterButtonText}>💌</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={GALLERY_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
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
        overflow: 'hidden',
        ...SHADOWS.small,
        backgroundColor: COLORS.white,
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        padding: SPACING.s,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    cardTitle: {
        fontFamily: FONTS.serifBold,
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
    },
});
