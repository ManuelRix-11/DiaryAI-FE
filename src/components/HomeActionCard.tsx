import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';
import { HomeActionCardProps } from '@/src/types/HomeProps';

export default function HomeActionCard({ icon, label, onPress }: HomeActionCardProps) {
    const styles = useThemeStyles(createStyles);
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.actionIcon}>
                {icon}
            </View>

            <Text style={styles.actionLabel}>{label}</Text>

            <View style={styles.bottomLine} />
        </TouchableOpacity>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    actionCard: {
        width: '48%',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 16,
        overflow: 'hidden',
        minHeight: 132,
    },
    actionIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionIconText: {
        fontSize: 26,
        color: '#ffffff',
        fontWeight: '800',
    },
    actionLabel: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    bottomLine: {
        width: '55%',
        height: 3,
        borderRadius: 999,
        backgroundColor: colors.surfaceHighlight,
        marginTop: 'auto',
    },
});