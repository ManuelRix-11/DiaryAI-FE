import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {StatsCardProps} from "@/src/types/CardProps";

export default function StatsCard({ value, label } : StatsCardProps) {
    return (
        <View style={styles.statCard}>
            <LinearGradient
                colors={['rgba(91, 60, 230, 0.1)', 'rgba(230, 60, 91, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCardGradient}
            >
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    statCardGradient: {
        padding: 20,
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#e2e8f0',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});