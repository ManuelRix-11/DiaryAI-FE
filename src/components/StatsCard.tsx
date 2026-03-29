import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatsCardProps } from '@/src/types/CardProps';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

export default function StatsCard({ value, label, highlight, icon, glowIntensity }: StatsCardProps) {
    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        if (highlight) {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else {
            pulseAnim.value = 1;
        }
    }, [highlight]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseAnim.value }]
        };
    });

    const cappedIntensity = Math.min((glowIntensity || 1) / 30, 1);
    const dynamicShadow = highlight ? {
        shadowColor: '#F56C5B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2 + (0.6 * cappedIntensity),
        shadowRadius: 5 + (15 * cappedIntensity),
        elevation: 3 + (15 * cappedIntensity),
    } : {};

    return (
        <Animated.View style={[styles.statCard, highlight && animatedStyle]}>
            <LinearGradient
                colors={highlight ? ['rgba(245, 108, 91, 0.25)', 'rgba(91, 60, 230, 0.15)'] : ['rgba(91, 60, 230, 0.14)', 'rgba(230, 60, 91, 0.08)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.statCardGradient, highlight && styles.highlightedGradient, dynamicShadow]}
            >
                <View style={[styles.topAccent, highlight && { backgroundColor: '#F56C5B' }]} />
                <Text style={[styles.statValue, highlight && { color: '#ffffff' }]}>{value}</Text>
                <Text style={[styles.statLabel, highlight && { color: '#c4b5fd' }]}>{icon ? `${icon} ` : ''}{label}</Text>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 18,
    },
    statCardGradient: {
        paddingVertical: 18,
        paddingHorizontal: 14,
        backgroundColor: '#111c33',
        borderWidth: 1,
        borderColor: '#243149',
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
        backgroundColor: '#5B3CE6',
    },
    statValue: {
        fontSize: 30,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontWeight: '700',
    },
});