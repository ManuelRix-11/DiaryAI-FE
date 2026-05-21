import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { FeaturesCardProps } from '@/src/types/CardProps';

export default function FeaturesCard({ title, description, buttonText, onPress }: FeaturesCardProps) {
    const styles = useThemeStyles(createStyles);

    return (
        <View style={styles.featuredCard}>
            <LinearGradient
                colors={['rgba(91, 60, 230, 0.16)', 'rgba(245, 108, 91, 0.14)', 'rgba(230, 60, 91, 0.12)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredGradient}
            >
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Featured</Text>
                </View>

                <Text style={styles.featuredTitle}>{title}</Text>
                <Text style={styles.featuredDescription}>{description}</Text>

                <TouchableOpacity style={styles.featuredButton} onPress={onPress} activeOpacity={0.9}>
                    <Text style={styles.featuredButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    featuredCard: {
        borderRadius: 22,
        overflow: 'hidden',
    },
    featuredGradient: {
        padding: 22,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 22,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        marginBottom: 14,
    },
    badgeText: {
        color: colors.text,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    featuredDescription: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 18,
        lineHeight: 22,
    },
    featuredButton: {
        backgroundColor: colors.surfaceHighlight,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.border,
    },
    featuredButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
});