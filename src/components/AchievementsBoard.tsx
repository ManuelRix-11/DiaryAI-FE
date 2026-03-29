import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Diary } from '@/model/diary';

interface AchievementsBoardProps {
    streak: number;
    diaries: Diary[];
}

interface Badge {
    id: string;
    name: string;
    desc: string;
    icon: string;
    unlocked: boolean;
}

export default function AchievementsBoard({ streak, diaries }: AchievementsBoardProps) {
    const badges: Badge[] = [
        { id: 'first_step', name: 'Il Primo Passo', desc: 'Hai iniziato il tuo viaggio!', icon: '🌱', unlocked: diaries.length > 0 },
        { id: 'prolific', name: 'Scrittore Assertivo', desc: 'Hai superato i 10 diari scritti.', icon: '📝', unlocked: diaries.length >= 10 },
        { id: 'week_fire', name: 'Settimana di Fuoco', desc: 'Hai scritto per 7 giorni di fila.', icon: '🔥', unlocked: streak >= 7 },
        { id: 'zen_mind', name: 'Mente Zen', desc: '30 giorni di totale introspezione.', icon: '🧘', unlocked: streak >= 30 },
        { id: 'positive_vibes', name: 'Spirito Libero', desc: 'Umore positivo dominante!', icon: '✨', unlocked: diaries.filter(d => d.sentiment?.score && d.sentiment.score >= 0.3).length >= 5 },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>I tuoi Achievement</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                style={styles.badgesScrollView}
            >
                {badges.map(badge => (
                    <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}>
                        <View style={[styles.badgeIconWrapper, !badge.unlocked && styles.badgeIconLocked]}>
                            <Text style={styles.badgeIcon}>{badge.icon}</Text>
                        </View>
                        <Text style={[styles.badgeName, !badge.unlocked && styles.badgeTextLocked]} numberOfLines={1}>
                            {badge.name}
                        </Text>
                        <Text style={[styles.badgeDesc, !badge.unlocked && styles.badgeTextLocked]} numberOfLines={2}>
                            {badge.unlocked ? badge.desc : "Bloccato. Continua a scrivere!"}
                        </Text>
                        {badge.unlocked && (
                            <View style={styles.unlockedDot} />
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 16,
    },
    badgesScrollView: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    badgeCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        width: 140,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    badgeCardLocked: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(255,255,255,0.02)',
    },
    badgeIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    badgeIconLocked: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        opacity: 0.3,
    },
    badgeIcon: {
        fontSize: 26,
    },
    badgeName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#e2e8f0',
        textAlign: 'center',
        marginBottom: 4,
    },
    badgeDesc: {
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 14,
    },
    badgeTextLocked: {
        color: '#64748b',
    },
    unlockedDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34d399',
        shadowColor: '#34d399',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    }
});
