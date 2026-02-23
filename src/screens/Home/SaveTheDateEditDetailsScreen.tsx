import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    Switch,
    Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';

const DEFAULT_LOCATION = 'NEW YORK CITY, NY';

export default function SaveTheDateEditDetailsScreen({ navigation }: any) {
    const {
        weddingDate,
        setWeddingDate,
        saveTheDateLocation,
        setSaveTheDateLocation,
        saveTheDateDetailsComingSoon,
        setSaveTheDateDetailsComingSoon,
        saveTheDateImage,
        setSaveTheDateImage,
        saveTheDateTagline,
        setSaveTheDateTagline,
        baseImage,
    } = useUserStore();

    const [date, setDate] = useState<Date>(
        weddingDate ? new Date(weddingDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    );
    const [location, setLocation] = useState(saveTheDateLocation || '');
    const [detailsComingSoon, setDetailsComingSoon] = useState(saveTheDateDetailsComingSoon);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [posterImage, setPosterImage] = useState<string | null>(saveTheDateImage ?? null);
    const [tagline, setTagline] = useState(saveTheDateTagline || 'Are getting married');

    const pickPosterImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.9,
        });
        if (!result.canceled) {
            setPosterImage(result.assets[0].uri);
        }
    };

    const clearPosterImage = () => {
        setPosterImage(null);
    };

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const handleSave = () => {
        setWeddingDate(date.toISOString());
        setSaveTheDateLocation(location.trim() || '');
        setSaveTheDateDetailsComingSoon(detailsComingSoon);
        setSaveTheDateImage(posterImage);
        setSaveTheDateTagline(tagline.trim() || 'Are getting married');
        navigation.goBack();
    };

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={24} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Details</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.section}>
                    <Text style={styles.label}>Wedding date</Text>
                    <TouchableOpacity
                        style={styles.field}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="calendar-today" size={22} color={COLORS.primary} />
                        <Text style={styles.fieldText}>{formattedDate}</Text>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.slate400} />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <View style={styles.pickerWrap}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                            />
                            {Platform.OS === 'ios' && (
                                <TouchableOpacity
                                    style={styles.confirmDateBtn}
                                    onPress={() => setShowDatePicker(false)}
                                >
                                    <Text style={styles.confirmDateText}>Done</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Poster photo</Text>
                    <Text style={styles.hint}>Image for your Save The Date poster only. Leave empty to use your main profile photo.</Text>
                    <TouchableOpacity onPress={pickPosterImage} style={styles.imageContainer} activeOpacity={0.8}>
                        {posterImage ? (
                            <>
                                <Image source={{ uri: posterImage }} style={styles.posterImage} />
                                <View style={styles.imageOverlay}>
                                    <Text style={styles.changePhotoText}>Change photo</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <MaterialIcons name="add-photo-alternate" size={48} color={COLORS.slate400} />
                                <Text style={styles.placeholderText}>Tap to choose photo</Text>
                                {baseImage ? (
                                    <Text style={styles.placeholderSub}>Or use profile photo on card</Text>
                                ) : null}
                            </View>
                        )}
                    </TouchableOpacity>
                    {posterImage ? (
                        <TouchableOpacity onPress={clearPosterImage} style={styles.removePhotoBtn}>
                            <Text style={styles.removePhotoText}>Remove poster photo</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Sentence under names</Text>
                    <Text style={styles.hint}>Short line that appears under your names on the card (e.g. "Are getting married").</Text>
                    <View style={styles.inputWrap}>
                        <MaterialIcons name="format-quote" size={22} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Are getting married"
                            placeholderTextColor={COLORS.slate400}
                            value={tagline}
                            onChangeText={setTagline}
                        />
                    </View>
                    <View style={styles.taglinePresets}>
                        {['Are getting married', 'Are saying I do', 'Tied the knot', 'Getting hitched', 'Can\'t wait to marry you'].map((preset) => (
                            <TouchableOpacity
                                key={preset}
                                style={[styles.presetChip, tagline === preset && styles.presetChipActive]}
                                onPress={() => setTagline(preset)}
                            >
                                <Text style={[styles.presetChipText, tagline === preset && styles.presetChipTextActive]}>{preset}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Place / venue</Text>
                    <View style={styles.inputWrap}>
                        <MaterialIcons name="place" size={22} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={DEFAULT_LOCATION}
                            placeholderTextColor={COLORS.slate400}
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>
                    <Text style={styles.hint}>This appears on your Save The Date card.</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.switchRow}>
                        <View style={styles.switchLabelWrap}>
                            <Text style={styles.label}>Details coming soon</Text>
                            <Text style={styles.hint}>Show “Details coming soon” on the card instead of venue and “Formal invitation to follow”.</Text>
                        </View>
                        <Switch
                            value={detailsComingSoon}
                            onValueChange={setDetailsComingSoon}
                            trackColor={{ false: COLORS.slate200, true: COLORS.primary + '99' }}
                            thumbColor={COLORS.white}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate200,
    },
    closeBtn: {
        padding: SPACING.xs,
    },
    headerTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.slate900,
    },
    saveBtn: {
        padding: SPACING.xs,
    },
    saveBtnText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        color: COLORS.primary,
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: SPACING.l,
        paddingBottom: SPACING.xxl,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        color: COLORS.slate700,
        marginBottom: SPACING.s,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        gap: SPACING.s,
    },
    fieldText: {
        flex: 1,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
    },
    pickerWrap: {
        marginTop: SPACING.s,
        alignItems: 'center',
    },
    confirmDateBtn: {
        marginTop: SPACING.m,
        paddingVertical: 10,
        paddingHorizontal: SPACING.l,
        backgroundColor: COLORS.slate200,
        borderRadius: 10,
    },
    confirmDateText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 15,
        color: COLORS.slate900,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        paddingHorizontal: SPACING.m,
    },
    inputIcon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.slate900,
        paddingVertical: SPACING.m,
    },
    hint: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate500,
        marginTop: SPACING.xs,
    },
    taglinePresets: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginTop: SPACING.m,
    },
    presetChip: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
        backgroundColor: COLORS.slate100,
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    presetChipActive: {
        backgroundColor: COLORS.primary + '18',
        borderColor: COLORS.primary,
    },
    presetChipText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate600,
    },
    presetChipTextActive: {
        fontFamily: FONTS.sansSemiBold,
        color: COLORS.primary,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    switchLabelWrap: {
        flex: 1,
        marginRight: SPACING.m,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 9 / 16,
        maxHeight: 220,
        backgroundColor: COLORS.slate100,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    posterImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: SPACING.s,
        alignItems: 'center',
    },
    changePhotoText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        color: COLORS.white,
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.l,
    },
    placeholderText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: SPACING.s,
    },
    placeholderSub: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate400,
        marginTop: SPACING.xs,
    },
    removePhotoBtn: {
        marginTop: SPACING.s,
        alignSelf: 'center',
    },
    removePhotoText: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.primary,
    },
});
