import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeActionCardProps } from '@/src/types/HomeProps';

export default function HomeActionCard({ icon, label, gradientColors, onPress }: HomeActionCardProps) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                // @ts-ignore
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionIcon}
            >
                <Text style={styles.actionIconText}>{icon}</Text>
            </LinearGradient>

            <Text style={styles.actionLabel}>{label}</Text>

            <View style={styles.bottomLine} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    actionCard: {
        width: '48%',
        alignItems: 'center',
        backgroundColor: '#111c33',
        borderWidth: 1,
        borderColor: '#243149',
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
        color: '#e2e8f0',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    bottomLine: {
        width: '55%',
        height: 3,
        borderRadius: 999,
        backgroundColor: 'rgba(148, 163, 184, 0.22)',
        marginTop: 'auto',
    },
});