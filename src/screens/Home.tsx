import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Navbar from '../components/_navbar';
import StatsCard from '@/src/components/StatsCard';
import FeaturesCard from '@/src/components/_featuresCard';
import HomeActionCard from '@/src/components/HomeActionCard';
import { AuthUser } from '@/model/user';
import { usersApi } from '@/src/api/users';

type HomeScreenProps = {
    user: AuthUser;
};

export default function HomeScreen({ user }: HomeScreenProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const firstName = user.username?.trim()?.split(' ')?.[0] || 'there';

    const [fetchedStats, setFetchedStats] = useState<number[]>([0, 0, 0.5]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchUserStats = async () => {
                try {
                    const res = await usersApi.getStats(user.id);
                    if (isActive && res && res.length === 3) {
                        setFetchedStats(res);
                    }
                } catch (error) {
                    console.error("Errore nel recupero delle statistiche:", error);
                }
            };

            fetchUserStats();

            return () => {
                isActive = false;
            };
        }, [user.id])
    );

    const stats = [
        { value: fetchedStats[0].toString(), label: 'Diaries', highlight: false },
        { value: fetchedStats[1].toString(), label: 'Streak', highlight: fetchedStats[1] > 0, icon: '🔥', glowIntensity: fetchedStats[1] },
        { value: `${Math.round(fetchedStats[2] * 100)}%`, label: 'Mood', highlight: false },
    ];

    const actions = [
        {
            icon: '+',
            label: 'Nuovo Diario',
            gradientColors: ['#5B3CE6', '#F56C5B'],
            event: () => navigation.navigate('NewDiaryModal' as never),
        },
        {
            icon: '📊',
            label: 'Analytics',
            gradientColors: ['#E63C5B', '#F56C5B'],
            event: () => navigation.navigate('Insights' as never),
        },
        {
            icon: '⚙️',
            label: 'Settings',
            gradientColors: ['#5B3CE6', '#E63C5B'],
            event: () => navigation.navigate('Settings' as never),
        },
        {
            icon: '👤',
            label: 'Profile',
            gradientColors: ['#E63C5B', '#5B3CE6'],
            event: () => navigation.navigate('Profile' as never),
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 16,
                    paddingBottom: 120,
                }}
            >
                <View style={styles.hero}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Your space</Text>
                    </View>

                    <Text style={styles.heroTitle}>Ciao, {firstName}</Text>
                    <Text style={styles.heroSubtitle}>
                        Pronto a mettere ordine nei pensieri di oggi?
                    </Text>

                    <View style={styles.heroSeparator} />
                </View>

                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <StatsCard key={index} value={stat.value} label={stat.label} highlight={stat.highlight} icon={stat.icon} glowIntensity={('glowIntensity' in stat) ? stat.glowIntensity : undefined} />
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick actions</Text>
                        <Text style={styles.sectionSubtitle}>Accedi velocemente alle funzioni principali</Text>
                    </View>

                    <View style={styles.primaryActionWrapper}>
                        <Pressable
                            onPress={() => navigation.navigate('NewDiaryModal' as never)}
                            style={styles.primaryActionPressable}
                        >
                            <LinearGradient
                                colors={['#5B3CE6', '#F56C5B', '#E63C5B']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.primaryActionCard}
                            >
                                <Text style={styles.primaryActionIcon}>+</Text>
                                <Text style={styles.primaryActionTitle}>Nuovo Diario</Text>
                                <Text style={styles.primaryActionDescription}>
                                    Inizia una nuova entry in pochi secondi
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    <View style={styles.actionsGrid}>
                        {actions.slice(1).map((action, index) => (
                            <HomeActionCard
                                key={index}
                                icon={action.icon}
                                label={action.label}
                                gradientColors={action.gradientColors}
                                onPress={action.event}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <FeaturesCard
                        title="Unlock Premium Features"
                        description="Get access to advanced analytics, smarter insights and a more personal writing experience."
                        buttonText="Learn more →"
                        onPress={() => alert('Featured card pressed')}
                    />
                </View>
            </ScrollView>

            <Navbar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollView: {
        flex: 1,
    },
    hero: {
        paddingHorizontal: 20,
        paddingBottom: 22,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(91, 60, 230, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(91, 60, 230, 0.35)',
        marginBottom: 14,
    },
    badgeText: {
        color: '#c4b5fd',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    heroTitle: {
        fontSize: 38,
        fontWeight: '800',
        color: '#e2e8f0',
        lineHeight: 44,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
        lineHeight: 23,
        maxWidth: 320,
    },
    heroSeparator: {
        marginTop: 10,
        width: 120,
        height: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(91, 60, 230, 0.5)',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 22,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 20,
    },
    primaryActionWrapper: {
        marginBottom: 12,
    },
    primaryActionPressable: {
        borderRadius: 22,
        overflow: 'hidden',
    },
    primaryActionCard: {
        minHeight: 150,
        borderRadius: 22,
        padding: 22,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    primaryActionIcon: {
        fontSize: 40,
        color: '#ffffff',
        fontWeight: '800',
        lineHeight: 44,
    },
    primaryActionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#ffffff',
        marginTop: 12,
        marginBottom: 6,
    },
    primaryActionDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 20,
        maxWidth: 240,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
});