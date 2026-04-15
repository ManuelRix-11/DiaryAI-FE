import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Navbar from '../components/_navbar';
import { diariesApi } from '@/src/api/diaries';
import { Diary } from '@/model/diary';
import { AuthUser } from '@/model/user';
import DiaryCard from '../components/DiaryCard';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';

interface HistoryScreenProps {
    user: AuthUser;
}

export default function HistoryScreen({ user }: HistoryScreenProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const styles = useThemeStyles(createStyles);
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchDiaries = async () => {
                if (isActive) setLoading(true);
                try {
                    const data = await diariesApi.getByUserId(user.id);

                    if (isActive) {
                        if (Array.isArray(data)) {
                            const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                            setDiaries(sorted);
                        } else {
                            console.warn("API returned invalid data format:", data);
                            setDiaries([]);
                        }
                    }
                } catch (error) {
                    console.error("Errore nel recupero dei diari:", error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchDiaries();

            return () => {
                isActive = false;
            };
        }, [user.id])
    );

    const renderItem = ({ item }: { item: Diary }) => (
        <DiaryCard
            item={item}
            onPress={() => {
                // @ts-ignore
                navigation.navigate('Diary', { id: item.id, title: item.title });
            }}
        />
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Your Past</Text>
                </View>
                <Text style={styles.headerTitle}>History</Text>
                <Text style={styles.headerSubtitle}>
                    Rivedi tutti i tuoi pensieri e ricordi passati.
                </Text>
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#5B3CE6" style={{ marginTop: 40 }} />
                ) : diaries.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Non hai ancora scritto nessun diario.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={diaries}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <Navbar />
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    listContainer: {
        flex: 1,
    },
    flatListContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
        gap: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
});
