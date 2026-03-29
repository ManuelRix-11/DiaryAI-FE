import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RankCardProps {
    streak: number;
}

export default function RankCard({ streak }: RankCardProps) {
    const getUserTitle = (s: number) => {
        if (s === 0) return { title: "Apprendista 🌱", color: "#94a3b8", desc: "Hai appena iniziato" };
        if (s < 4) return { title: "Novizio della Penna ✍️", color: "#c4b5fd", desc: "I primi passi nell'introspezione" };
        if (s < 8) return { title: "Esploratore dei Pensieri 🧭", color: "#34d399", desc: "La tua mente si apre sempre di più" };
        if (s < 15) return { title: "Riflessivo Costante 📖", color: "#fbbf24", desc: "La scrittura è diventata una sana abitudine" };
        if (s < 30) return { title: "Maestro del Diario 👑", color: "#f43f5e", desc: "Hai lasciato un'impronta indelebile" };
        return { title: "Leggenda dell'Introspezione 🌌", color: "#5B3CE6", desc: "Sei oltre i limiti del pensiero quotidiano" };
    };

    const userRank = getUserTitle(streak);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
                style={styles.card}
            >
                <Text style={styles.label}>Titolo Raggiunto</Text>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: userRank.color }]}>{userRank.title}</Text>
                </View>
                <Text style={styles.desc}>{userRank.desc}</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
    },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
    },
    desc: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    }
});
