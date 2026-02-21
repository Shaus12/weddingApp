import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface LoadingOverlayProps {
    message?: string;
    targetPercentage?: number;
}

export default function LoadingOverlay({ message = "Generating...", targetPercentage = 80 }: LoadingOverlayProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let currentProgress = 0;

        // This simulates a fast initial burst, then slowing down as it approaches 80
        const interval = setInterval(() => {
            if (currentProgress < targetPercentage) {
                // Determine increment based on how close we are to 80
                let increment = 1;

                if (currentProgress < 30) {
                    increment = Math.floor(Math.random() * 8) + 4; // Fast: 4-11% at a time
                } else if (currentProgress < 60) {
                    increment = Math.floor(Math.random() * 4) + 2; // Slower: 2-5% at a time
                } else {
                    increment = 1; // Creep up 1% at a time
                }

                currentProgress = Math.min(currentProgress + increment, targetPercentage);
                setProgress(currentProgress);
            } else {
                clearInterval(interval);
            }
        }, 100); // 100ms ticks

        return () => clearInterval(interval);
    }, [targetPercentage]);

    return (
        <View style={styles.overlay}>
            <LinearGradient
                colors={['rgba(248, 246, 246, 0.95)', 'rgba(255, 255, 255, 0.98)']}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.content}>
                {/* 
                  Instead of a full bar, we use elegant large typography that fits 
                  with the high-end, romantic design of the rest of the application.
                */}
                <View style={styles.percentageContainer}>
                    <Text style={styles.percentageText}>{progress}</Text>
                    <Text style={styles.percentageSymbol}>%</Text>
                </View>

                <Text style={styles.messageText}>{message}</Text>

                {progress === targetPercentage && (
                    <Text style={styles.subtitleText}>Polishing details...</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 999, // Ensure it sits above absolutely everything
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        ...SHADOWS['2xl'],
        width: width * 0.8,
        maxWidth: 320,
    },
    percentageContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: SPACING.m,
    },
    percentageText: {
        fontFamily: FONTS.displayBold,
        fontSize: 72,
        color: COLORS.primary,
        lineHeight: 80,
    },
    percentageSymbol: {
        fontFamily: FONTS.display,
        fontSize: 32,
        color: COLORS.primary,
        marginLeft: 4,
    },
    messageText: {
        fontFamily: FONTS.sansMedium,
        fontSize: 16,
        color: COLORS.slate700,
        textAlign: 'center',
        marginTop: SPACING.s,
    },
    subtitleText: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate400,
        textAlign: 'center',
        marginTop: SPACING.m,
        fontStyle: 'italic',
    }
});
