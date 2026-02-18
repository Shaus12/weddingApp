import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const REMINDERS = [
    { id: '1', title: 'Shoe Check 👠', message: 'Have you broken in your wedding shoes yet? Walk around in them for 15 mins today!' },
    { id: '2', title: 'Hydrate 💧', message: 'Glowing skin starts with water. Drink an extra glass today.' },
    { id: '3', title: 'Date Night 🍷', message: 'No wedding talk tonight! Go out and enjoy being a couple.' },
    { id: '4', title: 'Vendor Call 📞', message: 'Confirm the flower arrangements with the florist this week.' },
];

export default function RemindersScreen({ navigation }: any) {
    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>AI Reminders</Text>
            </View>

            <FlatList
                data={REMINDERS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
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
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 24,
        color: COLORS.text,
    },
    list: {
        padding: SPACING.l,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
    },
    cardTitle: {
        fontFamily: FONTS.sansBold,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    cardMessage: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.textLight,
    },
});
