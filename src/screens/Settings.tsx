import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Navbar from '../components/_navbar';
import ProfileHeader from '../components/ProfileHeader';
import SettingItem from '../components/SettingsItem';
import { AuthUser } from '@/model/user';

type SettingsScreenProps = {
    onLogout?: () => void;
    user: AuthUser;
};

export default function SettingsScreen({ onLogout, user }: SettingsScreenProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [biometric, setBiometric] = useState(true);

    const handleEditProfile = () => {
        navigation.navigate('Profile' as never);
    };

    const handleAccountSetting = () => {
        Alert.alert('Attenzione', 'Opzione non disponibile in questa versione');
    };

    const handleAppSetting = () => {
        Alert.alert('Attenzione', 'Opzione non disponibile in questa versione');
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Vuoi uscire dall’account?', [
            { text: 'Annulla', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => onLogout?.() },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert('Delete Account', 'This action cannot be undone. Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete') },
        ]);
    };

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
                <View style={styles.header}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Account</Text>
                    </View>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>
                        Gestisci il tuo account, le preferenze e le opzioni dell’app.
                    </Text>
                </View>

                <ProfileHeader
                    name={user.username}
                    email={user.email}
                    avatar={null}
                    onEditPress={handleEditProfile}
                />

                <View style={styles.section}>
                    <SettingItem
                        icon="💎"
                        title="Subscription"
                        description="Manage your subscription"
                        type="navigation"
                        onPress={handleAccountSetting}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App preferences</Text>
                    <SettingItem
                        icon="🔔"
                        title="Notifications"
                        description="Push notifications and alerts"
                        type="toggle"
                        value={notifications}
                        onToggle={setNotifications}
                    />
                    <SettingItem
                        icon="🌙"
                        title="Dark Mode"
                        description="Always on"
                        type="toggle"
                        value={darkMode}
                        onToggle={setDarkMode}
                    />
                    <SettingItem
                        icon="📈"
                        title="Analytics"
                        description="Help improve the app"
                        type="toggle"
                        value={analytics}
                        onToggle={setAnalytics}
                    />
                    <SettingItem
                        icon="🧬"
                        title="Biometric Login"
                        description="Face ID / Touch ID"
                        type="toggle"
                        value={biometric}
                        onToggle={setBiometric}
                    />
                </View>

                <View style={styles.dangerZone}>
                    <Text style={styles.sectionTitle}>Danger zone</Text>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.9}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} activeOpacity={0.9} disabled>
                        <LinearGradient
                            colors={['#E63C5B', '#F56C5B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.deleteGradient}
                        >
                            <Text style={styles.deleteText}>Delete Account</Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
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
    headerTitle: {
        fontSize: 38,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
        lineHeight: 22,
        maxWidth: 340,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    dangerZone: {
        paddingHorizontal: 20,
        marginTop: 8,
        marginBottom: 24,
        gap: 12,
    },
    logoutButton: {
        backgroundColor: '#111c33',
        borderWidth: 1,
        borderColor: '#243149',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#e2e8f0',
    },
    deleteButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    deleteGradient: {
        padding: 16,
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
});