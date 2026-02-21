import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function ImageUploadScreen({ navigation }: any) {
    const { setBaseImage, baseImage } = useUserStore();
    const [image, setImage] = useState<string | null>(baseImage);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false, // Don't force a crop
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleNext = () => {
        if (image) {
            setBaseImage(image);
            navigation.navigate('StyleSelection');
        } else {
            Alert.alert('Please select an image', 'We need a photo to create your magic!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF0F5', '#FFE4E1']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.content}>
                <Text style={styles.title}>Your First Photo 📸</Text>
                <Text style={styles.subtitle}>Choose a photo to start your journey.</Text>

                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderIcon}>📷</Text>
                            <Text style={styles.placeholderText}>Tap to upload</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, !image && styles.buttonDisabled]}
                    onPress={handleNext}
                    disabled={!image}
                >
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
        alignItems: 'center',
        justifyContent: 'center',
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
    imageContainer: {
        width: 200,
        height: 355.5, // 9:16 aspect ratio roughly
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        shadowColor: '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    placeholderIcon: {
        fontSize: 48,
        marginBottom: SPACING.s,
    },
    placeholderText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
    },
    button: {
        backgroundColor: COLORS.accent || '#FF8C94',
        padding: SPACING.m,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        shadowColor: COLORS.accent || '#FF8C94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: COLORS.textLight,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: FONTS.sansBold,
        fontSize: 16,
    },
});
