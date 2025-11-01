import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeActionCardProps {
    icon: string;
    label: string;
    gradientColors: string[];
    onPress: () => void;
}

export default function HomeActionCard({ icon, label, gradientColors, onPress }: HomeActionCardProps) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress}>
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
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    actionCard: {
        width: '48%',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 16,
        padding: 20,
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionIconText: {
        fontSize: 28,
        color: '#ffffff',
    },
    actionLabel: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
});