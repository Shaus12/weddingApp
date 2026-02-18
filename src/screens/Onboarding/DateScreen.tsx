import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

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
            <View style={styles.content}>
                <Text style={styles.title}>Save the Date</Text>
                <Text style={styles.subtitle}>When will the magic happen?</Text>

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
        backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        width: '100%',
        alignItems: 'center',
    },
    dateButtonText: {
        fontFamily: FONTS.sans,
        fontSize: 18,
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.text,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        width: '100%',
        marginTop: SPACING.m,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
    },
});
