import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatsCardProps } from '@/src/types/CardProps';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

export default function StatsCard({ value, label, highlight, icon, glowIntensity, rawValue }: StatsCardProps) {
    const floatAnim = useSharedValue(0);
    const styles = useThemeStyles(createStyles);

    const isMood = label === 'Mood' && rawValue !== undefined;
    const isGoodMood = isMood && rawValue >= 0.7;
    const isNeutralMood = isMood && rawValue >= 0.4 && rawValue < 0.7;
    const isBadMood = isMood && rawValue < 0.4;

    useEffect(() => {
        if (highlight && !isMood) {
            // Standard floating for highlighted cards
            floatAnim.value = withRepeat(
                withSequence(
                    withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else if (isMood) {
            if (isGoodMood) {
                // Energetic floating
                floatAnim.value = withRepeat(
                    withSequence(
                        withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
            } else if (isNeutralMood) {
                // Calm floating
                floatAnim.value = withRepeat(
                    withSequence(
                        withTiming(-3, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
            } else {
                // Heavy, slow floating
                floatAnim.value = withRepeat(
                    withSequence(
                        withTiming(-1.5, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
            }
        } else {
            floatAnim.value = 0;
        }
    }, [highlight, isMood, isGoodMood, isNeutralMood, isBadMood]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: floatAnim.value }]
        };
    });

    const cappedIntensity = Math.min((glowIntensity || 1) / 30, 1);
    const dynamicShadow = highlight && !isMood ? {
        shadowColor: '#F56C5B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2 + (0.6 * cappedIntensity),
        shadowRadius: 5 + (15 * cappedIntensity),
        elevation: 3 + (15 * cappedIntensity),
    } : (isMood ? {
        shadowColor: isGoodMood ? '#34C759' : (isNeutralMood ? '#FFCC00' : '#FF3B30'),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    } : {});

    let gradientColors = highlight && !isMood 
        ? ['rgba(245, 108, 91, 0.25)', 'rgba(91, 60, 230, 0.15)'] 
        : ['rgba(91, 60, 230, 0.14)', 'rgba(230, 60, 91, 0.08)'];
    let borderColorStyle = highlight && !isMood ? styles.highlightedGradient : {};
    let topAccentStyle = highlight && !isMood ? { backgroundColor: '#F56C5B' } : {};
    let textColorStyle = highlight && !isMood ? { color: '#ffffff' } : {};

    if (isMood) {
        if (isGoodMood) {
            gradientColors = ['rgba(52, 199, 89, 0.25)', 'rgba(40, 167, 69, 0.15)'];
            borderColorStyle = { borderColor: 'rgba(52, 199, 89, 0.5)' } as any;
            topAccentStyle = { backgroundColor: '#34C759' };
        } else if (isNeutralMood) {
            gradientColors = ['rgba(255, 204, 0, 0.25)', 'rgba(224, 168, 0, 0.15)'];
            borderColorStyle = { borderColor: 'rgba(255, 204, 0, 0.5)' } as any;
            topAccentStyle = { backgroundColor: '#FFCC00' };
        } else {
            gradientColors = ['rgba(255, 59, 48, 0.25)', 'rgba(200, 35, 51, 0.15)'];
            borderColorStyle = { borderColor: 'rgba(255, 59, 48, 0.5)' } as any;
            topAccentStyle = { backgroundColor: '#FF3B30' };
        }
    }

    return (
        <Animated.View style={[styles.statCard, (highlight || isMood) && animatedStyle]}>
            <LinearGradient
                colors={gradientColors as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.statCardGradient, borderColorStyle, dynamicShadow]}
            >
                <View style={[styles.topAccent, topAccentStyle]} />
                <Text style={[styles.statValue, textColorStyle]}>{value}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {icon}
                    <Text style={[styles.statLabel, textColorStyle]}>{label}</Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 18,
    },
    statCardGradient: {
        paddingVertical: 18,
        paddingHorizontal: 14,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        alignItems: 'center',
        minHeight: 96,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    highlightedGradient: {
        borderColor: 'rgba(245, 108, 91, 0.5)',
    },
    topAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        backgroundColor: colors.primary,
    },
    statValue: {
        fontSize: 30,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontWeight: '700',
    },
});