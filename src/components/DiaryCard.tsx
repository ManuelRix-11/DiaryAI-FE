import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Diary } from '@/model/diary';

interface DiaryCardProps {
    item: Diary;
    onPress: () => void;
}

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch {
        return dateString;
    }
};

const getSentimentColor = (label: string) => {
    const l = label.toLowerCase();
    if (l === 'joy' || l === 'happy') return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
    if (l === 'anger') return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
    if (l === 'fear') return { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc' };
    if (l === 'sadness') return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' };
    return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
};

export default function DiaryCard({ item, onPress }: DiaryCardProps) {
    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <LinearGradient
                colors={['#111c33', '#1e293b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
                </View>

                <Text style={styles.cardPreview} numberOfLines={2}>
                    {item.text || "Nessun contenuto"}
                </Text>

                {item.sentiment && item.sentiment.sentiments && Array.isArray(item.sentiment.sentiments) && (
                    <View style={styles.sentimentsContainer}>
                        {item.sentiment.sentiments
                            .sort((a: any, b: any) => b.score - a.score)
                            .slice(0, 3)
                            .map((s: any, idx: number) => {
                                const colors = getSentimentColor(s.label);
                                return (
                                    <View key={idx} style={[styles.sentimentBadge, { backgroundColor: colors.bg }]}>
                                        <Text style={[styles.sentimentText, { color: colors.text }]}>
                                            {s.label.charAt(0).toUpperCase() + s.label.slice(1)} {Math.round(s.score * 100)}%
                                        </Text>
                                    </View>
                                );
                            })}
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#243149',
    },
    card: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f8fafc',
        flex: 1,
        marginRight: 12,
    },
    cardDate: {
        fontSize: 12,
        color: '#94a3b8',
    },
    cardPreview: {
        fontSize: 14,
        color: '#cbd5e1',
        lineHeight: 20,
        marginBottom: 12,
    },
    sentimentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sentimentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sentimentText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
