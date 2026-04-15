import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

import Navbar from '../components/_navbar';
import { diariesApi } from '@/src/api/diaries';
import { usersApi } from '@/src/api/users';
import { Diary } from '@/model/diary';
import { AuthUser } from '@/model/user';
import RankCard from '../components/RankCard';
import AchievementsBoard from '../components/AchievementsBoard';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';

interface InsightsScreenProps {
    user: AuthUser;
}

const { width } = Dimensions.get('window');

export default function InsightsScreen({ user }: InsightsScreenProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const styles = useThemeStyles(createStyles);

    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [timeRange, setTimeRange] = useState<7 | 30>(7);

    // Animazioni gamification
    const pulseAnim = useSharedValue(1);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchData = async () => {
                if (isActive) setLoading(true);
                try {
                    const [stats, diariesData] = await Promise.all([
                        usersApi.getStats(user.id),
                        diariesApi.getByUserId(user.id)
                    ]);
                    
                    if (isActive) {
                        setStreak(stats[1] || 0);
                        if (Array.isArray(diariesData)) {
                            setDiaries(diariesData);
                        }
                    }
                } catch (error) {
                    console.error("Errore nel recupero dati per insights:", error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchData();
            return () => { isActive = false; };
        }, [user.id])
    );

    useEffect(() => {
        if (streak > 0 && streak % 7 === 0) {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else {
            pulseAnim.value = 1;
        }
    }, [streak]);

    const animatedFlameStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseAnim.value }]
        };
    });

    const isMilestoneHit = streak > 0 && streak % 7 === 0;
    const currentMilestone = Math.max(7, Math.ceil((streak === 0 ? 1 : streak) / 7) * 7);
    const milestoneProgress = streak % 7 === 0 && streak > 0 ? 7 : (streak % 7);
    const progressPercent = (milestoneProgress / 7) * 100;

    // Chart processing
    const generateChartData = (days: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dataPoints = Array.from({ length: days }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (days - 1) + i);
            return {
                date,
                score: 0,
                count: 0
            };
        });

        diaries.forEach(d => {
            const dDate = new Date(d.created_at);
            dDate.setHours(0, 0, 0, 0);
            const diffTime = today.getTime() - dDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            const index = (days - 1) - diffDays;
            if (index >= 0 && index < days) {
                let score = 0;
                if (d.sentiment && typeof d.sentiment.score === 'number') {
                    score = d.sentiment.score;
                } else if (d.sentiment && typeof d.sentiment === 'string') {
                    if (d.sentiment.toLowerCase() === 'positive') score = 0.5;
                    else if (d.sentiment.toLowerCase() === 'negative') score = -0.5;
                }
                dataPoints[index].score += score;
                dataPoints[index].count += 1;
            }
        });

        return dataPoints.map(dp => {
            const avgScore = dp.count > 0 ? dp.score / dp.count : 0;
            // Map -1..1 to 0..100
            const mappedScore = dp.count > 0 ? ((avgScore + 1) / 2) * 100 : 0;
            const value = dp.count > 0 ? mappedScore : 0; 
            return {
                date: dp.date,
                value: value,
                hasData: dp.count > 0,
                originalScore: avgScore
            };
        });
    };

    const chartData = generateChartData(timeRange);
    const barWidth = timeRange === 7 ? (width - 80) / 7 : (width - 80) / 30;

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
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Torna indietro</Text>
                    </Pressable>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Insights & Stats</Text>
                    </View>
                    <Text style={styles.headerTitle}>Analytics</Text>
                    <Text style={styles.headerSubtitle}>Monitora i tuoi progressi e il tuo umore nel tempo.</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#5B3CE6" style={{ marginTop: 60 }} />
                ) : (
                    <View style={styles.contentWrapper}>
                        {/* Rank Card */}
                        <RankCard streak={streak} />

                        {/* Gamification / Streak Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>La tua Streak</Text>
                            <LinearGradient
                                colors={['rgba(91, 60, 230, 0.15)', 'rgba(245, 108, 91, 0.1)']}
                                style={styles.streakCard}
                            >
                                <View style={styles.streakTop}>
                                    <Animated.View style={[styles.flameContainer, animatedFlameStyle, isMilestoneHit && styles.flameGlow]}>
                                        <Text style={styles.flameIcon}>🔥</Text>
                                    </Animated.View>
                                    <View style={styles.streakTextContainer}>
                                        <Text style={styles.streakNumber}>{streak} <Text style={styles.streakLabel}>giorni</Text></Text>
                                        <Text style={styles.streakSubtitle}>
                                            {streak === 0 ? "Scrivi un diario per iniziare!" :
                                            isMilestoneHit ? "Milestone raggiunta! Ottimo lavoro!" :
                                            `Continua così, mancano ${currentMilestone - streak} giorni!`}
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressLabels}>
                                        <Text style={styles.progressLabelText}>Milestone {currentMilestone}</Text>
                                        <Text style={styles.progressLabelText}>{milestoneProgress} / 7</Text>
                                    </View>
                                    <View style={styles.progressBarTrack}>
                                        <LinearGradient
                                            colors={['#5B3CE6', '#F56C5B']}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}}
                                            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                                        />
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Achievements Board */}
                        <AchievementsBoard streak={streak} diaries={diaries} />

                        {/* Mood Trends Section */}
                        <View style={styles.section}>
                            <View style={styles.chartHeader}>
                                <Text style={styles.sectionTitle}>Andamento Umore</Text>
                                <View style={styles.toggleContainer}>
                                    <Pressable 
                                        style={[styles.toggleBtn, timeRange === 7 && styles.toggleBtnActive]}
                                        onPress={() => setTimeRange(7)}
                                    >
                                        <Text style={[styles.toggleText, timeRange === 7 && styles.toggleTextActive]}>7G</Text>
                                    </Pressable>
                                    <Pressable 
                                        style={[styles.toggleBtn, timeRange === 30 && styles.toggleBtnActive]}
                                        onPress={() => setTimeRange(30)}
                                    >
                                        <Text style={[styles.toggleText, timeRange === 30 && styles.toggleTextActive]}>30G</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.chartCard}>
                                <View style={styles.chartArea}>
                                    {chartData.map((dp, i) => {
                                        const heightPercent = dp.hasData ? Math.max(10, dp.value) : 0;
                                        
                                        let gradientColors: readonly [string, string, ...string[]] = ['#64748b', '#94a3b8']; // Neutrale
                                        if (dp.originalScore >= 0.2) {
                                            gradientColors = ['#10b981', '#34d399']; // Positivo (Verde)
                                        } else if (dp.originalScore <= -0.2) {
                                            gradientColors = ['#e63c5b', '#f43f5e']; // Negativo (Rosso)
                                        }

                                        return (
                                            <View key={i} style={[styles.barCol, { width: barWidth }]}>
                                                <View style={styles.barTrack}>
                                                    {dp.hasData && (
                                                        <LinearGradient
                                                            colors={gradientColors}
                                                            style={[styles.barFill, { height: `${heightPercent}%` }]}
                                                        />
                                                    )}
                                                </View>
                                                {timeRange === 7 && (
                                                    <Text style={styles.dayLabel}>
                                                        {dp.date.toLocaleDateString('it-IT', { weekday: 'narrow' })}
                                                    </Text>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                                {timeRange === 30 && (
                                    <View style={styles.chartXAxis}>
                                        <Text style={styles.axisLabel}>Oggi</Text>
                                        <Text style={styles.axisLabel}>-30 G</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
            <Navbar />
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        marginBottom: 16,
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: colors.primaryLight,
        fontSize: 14,
        fontWeight: '600',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: colors.primaryBg,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
        marginBottom: 14,
    },
    badgeText: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: 38,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 16,
    },
    streakCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    streakTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    flameContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(245, 108, 91, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    flameGlow: {
        shadowColor: '#F56C5B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
        backgroundColor: 'rgba(245, 108, 91, 0.3)',
    },
    flameIcon: {
        fontSize: 32,
    },
    streakTextContainer: {
        flex: 1,
    },
    streakHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 2,
    },
    axisLabel: {
        color: colors.textSecondary,
        fontSize: 10,
    },
    rankBadge: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginTop: 4,
    },
    rankText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    streakNumber: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
    },
    streakLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    streakSubtitle: {
        fontSize: 14,
        color: colors.primaryLight,
        marginTop: 4,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabelText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    progressBarTrack: {
        height: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceAlt,
        borderRadius: 16,
        padding: 4,
    },
    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    toggleBtnActive: {
        backgroundColor: colors.primaryBg,
    },
    toggleText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    toggleTextActive: {
        color: colors.text,
    },
    chartCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        height: 250,
    },
    chartArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    barCol: {
        alignItems: 'center',
        height: '100%',
    },
    barTrack: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        backgroundColor: colors.surfaceAlt,
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        borderRadius: 4,
    },
    dayLabel: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    chartXAxis: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    contentWrapper: {
        paddingHorizontal: 20,
    }
});
