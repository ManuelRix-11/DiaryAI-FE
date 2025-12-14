import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from '../components/_navbar';
import StatsCard from "@/src/components/StatsCard";
import FeaturesCard from "@/src/components/_featuresCard";
import HomeActionCard from "@/src/components/HomeActionCard";
import {useNavigation} from "@react-navigation/native";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const stats = [
        { value: '24', label: 'Projects' },
        { value: '12', label: 'Clients' },
        { value: '98%', label: 'Success' },
    ];

    const actions = [
        {
            icon: '+',
            label: 'New Project',
            gradientColors: ['#5B3CE6', '#F56C5B'],
            // @ts-ignore
            event: ()=>navigation.navigate('Diary')
        },
        {
            icon: '📊',
            label: 'Analytics',
            gradientColors: ['#F56C5B', '#E63C5B'],
        },
        {
            icon: '⚙️',
            label: 'Settings',
            gradientColors: ['#5B3CE6', '#E63C5B'],
        },
        {
            icon: '👤',
            label: 'Profile',
            gradientColors: ['#E63C5B', '#5B3CE6'],
        },
    ];

    const activities = [
        { title: 'Project Update #1', time: '1 hour ago' },
        { title: 'Project Update #2', time: '2 hours ago' },
        { title: 'Project Update #3', time: '3 hours ago' },
    ];

    // @ts-ignore
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingBottom: 100,
                }}
            >
                {/* Hero Section */}
                <View style={styles.hero}>
                    <LinearGradient
                        colors={['#5B3CE6', '#F56C5B', '#E63C5B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroGradientText}
                    >
                        <Text style={styles.heroTitle}>Welcome Back</Text>
                    </LinearGradient>
                    <Text style={styles.heroSubtitle}>
                        Track your progress and achievements
                    </Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            value={stat.value}
                            label={stat.label}
                        />
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {actions.map((action, index) => (
                            <HomeActionCard
                                key={index}
                                icon={action.icon}
                                label={action.label}
                                gradientColors={action.gradientColors}
                                // @ts-ignore
                                onPress={action.event}
                            />
                        ))}
                    </View>
                </View>

                {/* Featured Card */}
                <View style={styles.section}>
                    <FeaturesCard
                        title="Unlock Premium Features"
                        description="Get access to advanced analytics and unlimited projects"
                        buttonText="Learn More →"
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
        paddingVertical: 30,
    },
    heroGradientText: {
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 4,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: 'transparent',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#e2e8f0',
        marginBottom: 20,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
});