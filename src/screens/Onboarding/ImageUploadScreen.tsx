import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUploadScreen({ navigation }: any) {
    const { setBaseImage, baseImage } = useUserStore();
    const [image, setImage] = useState<string | null>(baseImage);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 5],
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
            <View style={styles.content}>
                <Text style={styles.title}>Your First Photo</Text>
                <Text style={styles.subtitle}>Choose a photo to start your journey.</Text>

                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
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
        backgroundColor: COLORS.background,
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
        width: 250,
        height: 312.5, // 4:5 aspect ratio roughly
        backgroundColor: COLORS.white,
        borderRadius: SPACING.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0',
    },
    placeholderText: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: COLORS.textLight,
    },
    button: {
        backgroundColor: COLORS.text,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        alignItems: 'center',
        width: '100%',
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
