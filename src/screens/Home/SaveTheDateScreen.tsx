import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import { Video } from 'expo-av';
import * as shareService from '../../services/shareService';
import {
    getCachedVideoUrl,
    generateSaveTheDateVideo,
    getAttemptsRemaining,
    consumeAttempt,
    getLatestVideoStatus,
    setCachedVideoUrlForDate,
    VIDEO_STYLES,
    MAX_GENERATION_ATTEMPTS,
    type VideoStyleId,
} from '../../services/saveTheDateVideoService';
import { getLocalDateKey } from '../../services/dateKeyService';
import { getInstallationId } from '../../services/deviceIdService';
import SaveTheDateShareSheet from '../../components/SaveTheDateShareSheet';
import LoadingOverlay from '../../components/LoadingOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_ASPECT = 9 / 16;

const DEFAULT_POSTER_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAvyXt4D_sz6KOLpeyEs_eHXiUUM3LbuElsB0JV5XwG0nDEUEvKcL1Um4UJzni9zzF096q5ZY1rMVVX6MSpdmc9JX0E8twJum83ms1DxlnUNmJ6JNFiUVhQxCZ7W4GrVCwH7tAg0lsE3hYoqYAXPP_cxuGUztcoYkcG5LP50FiXtUh3MBgkx3S_YZZ-8AzAD7WWvYAfmrn5TtJ-iZoz95H9pvHpzYuT_J7w9EleUtuV85a2jdz_Mpjw_Ff0MyFT4lxA_hehqzocjs';

type PosterTheme = {
    gradient: [string, string, string];
    divider: string;
    overlayTint: string;
    preTitleColor: string;
};

/** Visual theme for the Save The Date poster card by style id — each style has a distinct look */
const POSTER_THEMES: Record<string, PosterTheme> = {
    'Boho-Chic': {
        gradient: ['rgba(94, 72, 52, 0.5)', 'transparent', 'rgba(94, 72, 52, 0.75)'],
        divider: 'rgba(255,248,220,0.9)',
        overlayTint: 'rgba(139, 90, 43, 0.2)',
        preTitleColor: 'rgba(255, 248, 220, 0.98)',
    },
    'Modern Minimal': {
        gradient: ['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.6)'],
        divider: 'rgba(255,255,255,0.85)',
        overlayTint: 'rgba(0, 0, 0, 0.08)',
        preTitleColor: 'rgba(255,255,255,0.98)',
    },
    'Classic Royal': {
        gradient: ['rgba(40, 30, 20, 0.6)', 'transparent', 'rgba(50, 35, 25, 0.8)'],
        divider: 'rgba(212, 175, 55, 0.95)',
        overlayTint: 'rgba(80, 60, 20, 0.25)',
        preTitleColor: 'rgba(255, 215, 0, 0.95)',
    },
    'Vintage': {
        gradient: ['rgba(80, 60, 50, 0.55)', 'transparent', 'rgba(70, 55, 45, 0.8)'],
        divider: 'rgba(255, 235, 205, 0.9)',
        overlayTint: 'rgba(101, 67, 33, 0.3)',
        preTitleColor: 'rgba(255, 235, 205, 0.98)',
    },
    'Rustic Charm': {
        gradient: ['rgba(101, 67, 33, 0.5)', 'transparent', 'rgba(80, 55, 30, 0.75)'],
        divider: 'rgba(255, 248, 240, 0.9)',
        overlayTint: 'rgba(101, 67, 33, 0.25)',
        preTitleColor: 'rgba(255, 248, 240, 0.98)',
    },
    'Beach Paradise': {
        gradient: ['rgba(0, 80, 120, 0.45)', 'transparent', 'rgba(0, 60, 90, 0.7)'],
        divider: 'rgba(200, 230, 255, 0.9)',
        overlayTint: 'rgba(0, 100, 150, 0.25)',
        preTitleColor: 'rgba(220, 240, 255, 0.98)',
    },
    'Romantic Fairytale': {
        gradient: ['rgba(120, 60, 100, 0.5)', 'transparent', 'rgba(80, 40, 70, 0.75)'],
        divider: 'rgba(255, 218, 224, 0.95)',
        overlayTint: 'rgba(120, 60, 100, 0.25)',
        preTitleColor: 'rgba(255, 218, 224, 0.98)',
    },
    'Urban Industrial': {
        gradient: ['rgba(40, 40, 45, 0.6)', 'transparent', 'rgba(30, 30, 35, 0.85)'],
        divider: 'rgba(200, 200, 210, 0.9)',
        overlayTint: 'rgba(50, 50, 55, 0.3)',
        preTitleColor: 'rgba(220, 220, 225, 0.98)',
    },
};
const DEFAULT_THEME: PosterTheme = {
    gradient: ['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)'],
    divider: 'rgba(255,255,255,0.6)',
    overlayTint: 'transparent',
    preTitleColor: 'rgba(255,255,255,0.95)',
};

export default function SaveTheDateScreen({ navigation }: any) {
    const {
        partner1Name,
        partner2Name,
        weddingDate,
        baseImage,
        isPremium,
        saveTheDateVideoStyle,
        setSaveTheDateVideoStyle,
        installationId,
        setInstallationId,
        saveTheDateLocation,
        saveTheDateDetailsComingSoon,
        saveTheDatePosterStyle,
        saveTheDateImage,
        saveTheDateTagline,
    } = useUserStore();

    const posterImageUri = saveTheDateImage ?? baseImage ?? DEFAULT_POSTER_IMAGE;
    const posterTheme = (saveTheDatePosterStyle && POSTER_THEMES[saveTheDatePosterStyle]) ? POSTER_THEMES[saveTheDatePosterStyle] : DEFAULT_THEME;

    const viewShotRef = useRef<ViewShot>(null);
    const scrollRef = useRef<ScrollView>(null);
    const [mode, setMode] = useState<'poster' | 'video'>('poster');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pollingTimeout, setPollingTimeout] = useState(false);
    const [attemptsRemaining, setAttemptsRemaining] = useState<number>(MAX_GENERATION_ATTEMPTS);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const [shareType, setShareType] = useState<'poster' | 'video'>('poster');
    const [shareUri, setShareUri] = useState('');

    const formattedDate = weddingDate
        ? new Date(weddingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'August 24, 2024';

    const ensureInstallationId = useCallback(async (): Promise<string> => {
        let id = installationId;
        if (!id) {
            id = await getInstallationId();
            setInstallationId(id);
        }
        return id;
    }, [installationId, setInstallationId]);

    const loadCachedVideo = useCallback(async () => {
        const id = await ensureInstallationId();
        const url = await getCachedVideoUrl(id);
        setVideoUrl(url);
    }, [ensureInstallationId]);

    const refreshAttempts = useCallback(async () => {
        const id = await ensureInstallationId();
        const remaining = await getAttemptsRemaining(id);
        setAttemptsRemaining(remaining);
    }, [ensureInstallationId]);

    useEffect(() => {
        if (mode === 'video' && isPremium) {
            loadCachedVideo();
            refreshAttempts();
        }
    }, [mode, isPremium, loadCachedVideo, refreshAttempts]);

    useFocusEffect(
        useCallback(() => {
            if (mode === 'video' && isPremium && !isGenerating) {
                loadCachedVideo();
                refreshAttempts();
            }
        }, [mode, isPremium, isGenerating, loadCachedVideo, refreshAttempts])
    );

    const handleSharePoster = async () => {
        try {
            const cacheKey = shareService.buildSaveTheDatePosterCacheKey(
                partner1Name || 'Partner1',
                partner2Name || 'Partner2'
            );
            const uri = await shareService.captureShareCard(viewShotRef, cacheKey);
            setShareUri(uri);
            setShareType('poster');
            setShareSheetVisible(true);
        } catch (error: any) {
            Alert.alert('Share Failed', 'Could not generate or share the card image.');
        }
    };

    const handleShareVideo = () => {
        if (!videoUrl) return;
        setShareUri(videoUrl);
        setShareType('video');
        setShareSheetVisible(true);
    };

    const handleGenerateVideo = async () => {
        if (!isPremium) return;
        const id = await ensureInstallationId();
        const remaining = await getAttemptsRemaining(id);
        if (remaining <= 0) {
            return;
        }
        const consumed = await consumeAttempt(id);
        if (!consumed) {
            setAttemptsRemaining(0);
            return;
        }
        setAttemptsRemaining(remaining - 1);
        setIsGenerating(true);
        setPollingTimeout(false);

        const pollIntervalMs = 2000;
        const pollTimeoutMs = 30000;
        let pollCount = 0;
        const maxPolls = Math.floor(pollTimeoutMs / pollIntervalMs);
        const dateKey = getLocalDateKey();

        const checkDone = async (): Promise<boolean> => {
            const localUrl = await getCachedVideoUrl(id);
            if (localUrl) {
                setVideoUrl(localUrl);
                setIsGenerating(false);
                return true;
            }
            const status = await getLatestVideoStatus(id, dateKey);
            if (status.videoUrl) {
                await setCachedVideoUrlForDate(id, dateKey, status.videoUrl);
                setVideoUrl(status.videoUrl);
                setIsGenerating(false);
                return true;
            }
            return false;
        };

        const pollTimer = setInterval(async () => {
            pollCount += 1;
            const found = await checkDone();
            if (found) clearInterval(pollTimer);
            if (pollCount >= maxPolls) {
                clearInterval(pollTimer);
                if (!found) setPollingTimeout(true);
                setIsGenerating(false);
            }
        }, pollIntervalMs);

        generateSaveTheDateVideo({
            installationId: id,
            partner1Name: partner1Name || 'Partner1',
            partner2Name: partner2Name || 'Partner2',
            weddingDate,
            style: saveTheDateVideoStyle as VideoStyleId,
            photoReferenceUri: saveTheDateImage ?? baseImage,
        })
            .then((url) => {
                setVideoUrl(url);
                setIsGenerating(false);
                clearInterval(pollTimer);
            })
            .catch(() => {
                Alert.alert(
                    'Couldn’t create video',
                    'Something went wrong. You can still share your poster.',
                    [{ text: 'OK' }]
                );
                setIsGenerating(false);
                clearInterval(pollTimer);
            });
    };

    const handleRefreshAfterTimeout = async () => {
        setPollingTimeout(false);
        const id = await ensureInstallationId();
        const dateKey = getLocalDateKey();
        const status = await getLatestVideoStatus(id, dateKey);
        if (status.videoUrl) {
            await setCachedVideoUrlForDate(id, dateKey, status.videoUrl);
        }
        loadCachedVideo();
    };

    const openEditDetails = () => {
        navigation.navigate('SaveTheDateEditDetails');
    };

    const openChangeStyle = () => {
        navigation.navigate('StyleSelection', { forSaveTheDate: true });
    };

    const previewWidth = Math.min(SCREEN_WIDTH - SPACING.l * 2, 400);
    const previewHeight = previewWidth / PREVIEW_ASPECT;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerPlaceholder} />
                <Text style={styles.headerTitle}>Save The Date</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 9:16 Preview area */}
                <View style={[styles.previewWrapper, { width: previewWidth, height: previewHeight }]}>
                    {/* Segmented toggle at top of preview */}
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[styles.toggleSegment, mode === 'poster' && styles.toggleSegmentActive]}
                            onPress={() => setMode('poster')}
                        >
                            <Text style={[styles.toggleText, mode === 'poster' && styles.toggleTextActive]}>
                                Poster
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleSegment, mode === 'video' && styles.toggleSegmentActive]}
                            onPress={() => setMode('video')}
                        >
                            <Text style={[styles.toggleText, mode === 'video' && styles.toggleTextActive]}>
                                Video
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {mode === 'poster' && (
                        <ViewShot
                            ref={viewShotRef}
                            options={{ format: 'png', quality: 0.9 }}
                            style={StyleSheet.absoluteFill}
                        >
                            <ImageBackground
                                source={{ uri: posterImageUri }}
                                style={styles.cardInternal}
                                imageStyle={styles.cardImageStyle}
                            >
                                <LinearGradient
                                    colors={posterTheme.gradient}
                                    style={styles.cardGradient}
                                >
                                    {posterTheme.overlayTint !== 'transparent' ? (
                                        <View style={[StyleSheet.absoluteFill, { backgroundColor: posterTheme.overlayTint }]} pointerEvents="none" />
                                    ) : null}
                                    <View style={styles.cardTop}>
                                        <Text style={[styles.cardPreTitle, { color: posterTheme.preTitleColor }]}>SAVE THE DATE</Text>
                                        <View style={[styles.divider, { backgroundColor: posterTheme.divider }]} />
                                    </View>
                                    <View style={styles.cardMiddle}>
                                        <Text style={styles.namesTitle}>
                                            {partner1Name || 'Julian'} & {partner2Name || 'Sophie'}
                                        </Text>
                                        <Text style={styles.italicSub}>{saveTheDateTagline || 'Are getting married'}</Text>
                                    </View>
                                    <View style={styles.cardBottom}>
                                        <Text style={styles.dateText}>{formattedDate}</Text>
                                        {saveTheDateDetailsComingSoon ? (
                                            <Text style={styles.formalText}>DETAILS COMING SOON</Text>
                                        ) : (
                                            <>
                                                <Text style={styles.locationText}>
                                                    {saveTheDateLocation?.trim() || 'NEW YORK CITY, NY'}
                                                </Text>
                                                <Text style={styles.formalText}>FORMAL INVITATION TO FOLLOW</Text>
                                            </>
                                        )}
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </ViewShot>
                    )}

                    {mode === 'video' && !isPremium && (
                        <>
                            <View style={StyleSheet.absoluteFill}>
                                <Video
                                    source={{ uri: 'https://assets.mixkit.co/active_storage/video_items/99935/1717720529/99935-video-720.mp4' }}
                                    style={StyleSheet.absoluteFill}
                                    resizeMode="cover"
                                    isLooping
                                    shouldPlay
                                    isMuted
                                />
                            </View>
                            <View style={styles.premiumOverlay}>
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <View style={styles.premiumContent}>
                                    <Text style={styles.premiumTitle}>
                                        Premium: Create an AI Save-the-Date video
                                    </Text>
                                    <Text style={styles.premiumSub}>
                                        8–12 seconds — perfect for Instagram Stories
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.trialButton}
                                        onPress={() => navigation.navigate('Paywall')}
                                    >
                                        <Text style={styles.trialButtonText}>Start Free Trial</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}

                    {mode === 'video' && isPremium && !videoUrl && !isGenerating && !pollingTimeout && (
                        <View style={StyleSheet.absoluteFill}>
                            <View style={styles.videoPlaceholder}>
                                <MaterialIcons name="play-circle-outline" size={72} color={COLORS.primary} />
                                <Text style={styles.videoPlaceholderCreateLabel}>
                                    Create your Save-the-Date video
                                </Text>
                            </View>
                        </View>
                    )}

                    {mode === 'video' && isPremium && pollingTimeout && !videoUrl && (
                        <View style={[StyleSheet.absoluteFill, styles.generatingOverlay]}>
                            <Text style={styles.generatingText}>Still processing.</Text>
                            <Text style={styles.generatingSub}>Check again in a moment.</Text>
                            <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshAfterTimeout}>
                                <MaterialIcons name="refresh" size={22} color={COLORS.white} />
                                <Text style={styles.refreshButtonText}>Refresh</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {mode === 'video' && isPremium && isGenerating && !pollingTimeout && (
                        <View style={[StyleSheet.absoluteFill, styles.generatingOverlay]}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.generatingText}>Creating your video...</Text>
                            <Text style={styles.generatingSub}>~20–40s</Text>
                        </View>
                    )}

                    {mode === 'video' && isPremium && videoUrl && (
                        <Video
                            source={{ uri: videoUrl }}
                            style={StyleSheet.absoluteFill}
                            resizeMode="cover"
                            isLooping
                            shouldPlay
                            isMuted
                        />
                    )}
                </View>

                {/* Video style selector (when in video mode) */}
                {mode === 'video' && (
                    <View style={styles.styleRow}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.styleChips}
                        >
                            {VIDEO_STYLES.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[
                                        styles.styleChip,
                                        saveTheDateVideoStyle === s.id && styles.styleChipActive,
                                    ]}
                                    onPress={() => setSaveTheDateVideoStyle(s.id)}
                                >
                                    <Text
                                        style={[
                                            styles.styleChipLabel,
                                            saveTheDateVideoStyle === s.id && styles.styleChipLabelActive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {s.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {mode === 'poster' && (
                    <View style={styles.metadataContainer}>
                        <Text style={styles.metadataDesign}>
                            DESIGN: {saveTheDatePosterStyle?.toUpperCase() || 'MODERN ROMANCE'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Footer actions */}
            <View style={styles.footer}>
                {mode === 'poster' && (
                    <>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleSharePoster}>
                            <MaterialIcons name="ios-share" size={18} color={COLORS.white} />
                            <Text style={styles.primaryButtonText}>Share Poster</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButtonLight} onPress={openChangeStyle}>
                            <MaterialIcons name="palette" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Change Style</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButtonLight} onPress={openEditDetails}>
                            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Edit Details</Text>
                        </TouchableOpacity>
                    </>
                )}

                {mode === 'video' && isPremium && videoUrl && (
                    <>
                        <Text style={styles.attemptsLabel}>Attempts left: {attemptsRemaining}/{MAX_GENERATION_ATTEMPTS}</Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleShareVideo}>
                            <MaterialIcons name="ios-share" size={18} color={COLORS.white} />
                            <Text style={styles.primaryButtonText}>Share Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.secondaryButtonLight}
                            onPress={() => scrollRef.current?.scrollTo({ y: previewHeight + 80, animated: true })}
                        >
                            <MaterialIcons name="palette" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Change Video Style</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButtonLight} onPress={openEditDetails}>
                            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Edit Details</Text>
                        </TouchableOpacity>
                    </>
                )}

                {mode === 'video' && isPremium && !videoUrl && !isGenerating && !pollingTimeout && attemptsRemaining > 0 && (
                    <>
                        <Text style={styles.attemptsLabel}>Attempts left: {attemptsRemaining}/{MAX_GENERATION_ATTEMPTS}</Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateVideo}>
                            <MaterialIcons name="movie-creation" size={18} color={COLORS.white} />
                            <Text style={styles.primaryButtonText}>Generate Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.secondaryButtonLight}
                            onPress={() => scrollRef.current?.scrollTo({ y: previewHeight + 80, animated: true })}
                        >
                            <MaterialIcons name="palette" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Change Video Style</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButtonLight} onPress={openEditDetails}>
                            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Edit Details</Text>
                        </TouchableOpacity>
                    </>
                )}

                {mode === 'video' && isPremium && !videoUrl && !isGenerating && !pollingTimeout && attemptsRemaining === 0 && (
                    <>
                        <Text style={styles.attemptsLabel}>Attempts left: 0/{MAX_GENERATION_ATTEMPTS}</Text>
                        <Text style={styles.usedAllAttemptsText}>You've used all 3 video generations.</Text>
                        <Text style={styles.contactSupportText}>More generations are coming soon.</Text>
                        <TouchableOpacity
                            style={styles.secondaryButtonLight}
                            onPress={() => scrollRef.current?.scrollTo({ y: previewHeight + 80, animated: true })}
                        >
                            <MaterialIcons name="palette" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Change Video Style</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButtonLight} onPress={openEditDetails}>
                            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                            <Text style={styles.secondaryButtonLightText}>Edit Details</Text>
                        </TouchableOpacity>
                    </>
                )}

                {mode === 'video' && isPremium && pollingTimeout && !videoUrl && (
                    <>
                        <Text style={styles.attemptsLabel}>Attempts left: {attemptsRemaining}/{MAX_GENERATION_ATTEMPTS}</Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleRefreshAfterTimeout}>
                            <MaterialIcons name="refresh" size={18} color={COLORS.white} />
                            <Text style={styles.primaryButtonText}>Refresh</Text>
                        </TouchableOpacity>
                    </>
                )}

                {mode === 'video' && !isPremium && <View style={styles.footerSpacer} />}
            </View>

            {isGenerating && (
                <LoadingOverlay message="Creating your video..." targetPercentage={85} />
            )}

            <SaveTheDateShareSheet
                visible={shareSheetVisible}
                onClose={() => setShareSheetVisible(false)}
                type={shareType}
                uri={shareUri}
                partner1Name={partner1Name || 'Partner1'}
                partner2Name={partner2Name || 'Partner2'}
                formattedDate={formattedDate}
                navigation={navigation}
            />
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
        backgroundColor: 'rgba(248, 246, 246, 0.9)',
        zIndex: 10,
    },
    headerPlaceholder: { width: 40 },
    headerTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.slate900,
        letterSpacing: -0.5,
    },
    scroll: { flex: 1 },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.s,
        paddingBottom: SPACING.m,
    },
    previewWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        ...SHADOWS['2xl'],
        backgroundColor: COLORS.slate800,
    },
    toggleRow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        flexDirection: 'row',
        paddingHorizontal: SPACING.s,
        paddingTop: SPACING.s,
        gap: SPACING.xs,
    },
    toggleSegment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleSegmentActive: {
        backgroundColor: COLORS.white,
    },
    toggleText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    toggleTextActive: {
        color: COLORS.primary,
    },
    cardInternal: {
        flex: 1,
        width: '100%',
        borderRadius: 24,
    },
    cardImageStyle: {
        borderRadius: 24,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 24,
        padding: SPACING.xl,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTop: {
        alignItems: 'center',
        marginTop: 44,
    },
    cardPreTitle: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 12,
        color: COLORS.white,
        letterSpacing: 3,
        opacity: 0.9,
    },
    divider: {
        height: 1,
        width: 32,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginTop: SPACING.s,
    },
    cardMiddle: {
        alignItems: 'center',
        gap: SPACING.s,
    },
    namesTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 32,
        color: COLORS.white,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    italicSub: {
        fontFamily: FONTS.display,
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.white,
        opacity: 0.95,
    },
    cardBottom: {
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    dateText: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.white,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    locationText: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.white,
        opacity: 0.8,
        letterSpacing: 2,
        marginTop: SPACING.xs,
    },
    formalText: {
        fontFamily: FONTS.sans,
        fontStyle: 'italic',
        fontSize: 10,
        color: COLORS.white,
        opacity: 0.6,
        letterSpacing: 2,
        marginTop: SPACING.l,
    },
    videoPlaceholder: {
        flex: 1,
        backgroundColor: COLORS.slate800,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    videoPlaceholderLabel: {
        fontFamily: FONTS.sans,
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginTop: SPACING.s,
    },
    videoPlaceholderCreateLabel: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 15,
        color: COLORS.white,
        marginTop: SPACING.m,
        textAlign: 'center',
    },
    premiumOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        zIndex: 30,
    },
    premiumContent: {
        alignItems: 'center',
        gap: SPACING.m,
    },
    premiumTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.white,
        textAlign: 'center',
    },
    premiumSub: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
    },
    trialButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: SPACING.xl,
        borderRadius: 16,
        marginTop: SPACING.s,
    },
    trialButtonText: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.white,
    },
    generatingOverlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.m,
        zIndex: 25,
    },
    generatingText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 16,
        color: COLORS.white,
    },
    generatingSub: {
        fontFamily: FONTS.sans,
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.s,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: SPACING.l,
        borderRadius: 16,
        marginTop: SPACING.s,
    },
    refreshButtonText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 15,
        color: COLORS.white,
    },
    attemptsLabel: {
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: COLORS.slate500,
        marginBottom: -SPACING.xs,
    },
    usedAllAttemptsText: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 15,
        color: COLORS.slate700,
        textAlign: 'center',
    },
    contactSupportText: {
        fontFamily: FONTS.sans,
        fontSize: 13,
        color: COLORS.slate500,
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    styleRow: {
        marginTop: SPACING.s,
        width: '100%',
    },
    styleChips: {
        flexDirection: 'row',
        gap: SPACING.s,
        paddingVertical: SPACING.xs,
    },
    styleChip: {
        paddingVertical: 10,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    styleChipActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '15',
    },
    styleChipLabel: {
        fontFamily: FONTS.sans,
        fontSize: 14,
        color: COLORS.slate700,
    },
    styleChipLabelActive: {
        fontFamily: FONTS.sansSemiBold,
        color: COLORS.primary,
    },
    metadataContainer: {
        marginTop: SPACING.s,
        alignItems: 'center',
    },
    metadataDesign: {
        fontFamily: FONTS.sansSemiBold,
        fontSize: 12,
        color: COLORS.primary,
        letterSpacing: 2,
    },
    footer: {
        backgroundColor: 'rgba(248, 246, 246, 0.95)',
        borderTopWidth: 1,
        borderTopColor: COLORS.primary + '1A',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.s,
        paddingBottom: Platform.OS === 'ios' ? 28 : SPACING.m,
        gap: SPACING.s,
    },
    footerSpacer: { height: 4 },
    primaryButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: SPACING.xs,
        ...SHADOWS.md,
        shadowColor: COLORS.primary,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontFamily: FONTS.displayBold,
        fontSize: 15,
    },
    secondaryButtonLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary + '1A',
        paddingVertical: 8,
        borderRadius: 12,
        gap: SPACING.xs,
    },
    secondaryButtonLightText: {
        color: COLORS.primary,
        fontFamily: FONTS.sansSemiBold,
        fontSize: 13,
    },
});
