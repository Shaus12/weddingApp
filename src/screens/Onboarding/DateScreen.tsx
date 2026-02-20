import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

export default function DateScreen({ navigation }: any) {
    const { setWeddingDate, weddingDate } = useUserStore();
    const [date, setDate] = useState(weddingDate ? new Date(weddingDate) : new Date());
    const [show, setShow] = useState(Platform.OS === 'ios');

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleNext = () => {
        setWeddingDate(date.toISOString());
        navigation.navigate('ImageUpload'); // Will create this next
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.content}>
                <Text style={styles.title}>Save the Date ✨</Text>
                <Text style={styles.subtitle}>When will the magic happen? 🗓️</Text>

                <View style={styles.pickerContainer}>
                    {Platform.OS === 'android' && (
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShow(true)}>
                            <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    )}

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={onChange}
                            textColor={COLORS.text}
                            themeVariant="light"
                            minimumDate={new Date()}
                        />
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.background, handled by LinearGradient
    },
    content: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: FONTS.serifBold,
        fontSize: 28,
        color: COLORS.text,
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: SPACING.xxl,
        textAlign: 'center',
    },
    pickerContainer: {
        marginBottom: SPACING.xl,
        width: '100%',
        alignItems: 'center',
    },
    dateButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: SPACING.m,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    dateButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 18,
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.accent || '#FF8C94',
        padding: SPACING.m,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        marginTop: SPACING.m,
        shadowColor: COLORS.accent || '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
    },
});
