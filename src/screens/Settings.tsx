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
import Navbar from '../components/_navbar';
import ProfileHeader from '../components/ProfileHeader';
import SettingItem from '../components/SettingsItem';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();

    // Stati per le impostazioni
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [biometric, setBiometric] = useState(true);

    const userData = {
        name: 'Andrea Salzillo',
        email: 'a.salzillo@diaryai.com',
        avatar: null, // oppure URL dell'immagine
    };

    const handleEditProfile = () => {
        Alert.alert('Attenzione!', 'Opzione non disponibile in questa versione');
    };

    const handleAccountSetting = () => {
        Alert.alert('Attenzione!', 'Opzione non disponibile in questa versione');
    };

    const handleAppSetting = () => {
        Alert.alert('Attenzione!', 'Opzione non disponibile in questa versione');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action cannot be undone. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete') }
            ]
        );
    };

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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
                </View>

                {/* Profile Header */}
                <ProfileHeader
                    name={userData.name}
                    email={userData.email}
                    avatar={userData.avatar}
                    onEditPress={handleEditProfile}
                />

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <SettingItem
                        icon="👤"
                        title="Personal Information"
                        description="Name, email, phone number"
                        type="navigation"
                        onPress={() => handleAccountSetting()}
                    />
                    <SettingItem
                        icon="🔒"
                        title="Privacy & Security"
                        description="Password, 2FA, privacy settings"
                        type="navigation"
                        onPress={() => handleAccountSetting()}
                    />
                    <SettingItem
                        icon="💳"
                        title="Subscription"
                        description="Manage your subscription"
                        type="navigation"
                        onPress={() => handleAccountSetting()}
                    />
                </View>

                {/* App Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Preferences</Text>
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
                        icon="📊"
                        title="Analytics"
                        description="Help improve the app"
                        type="toggle"
                        value={analytics}
                        onToggle={setAnalytics}
                    />
                    <SettingItem
                        icon="🔐"
                        title="Biometric Login"
                        description="Face ID / Touch ID"
                        type="toggle"
                        value={biometric}
                        onToggle={setBiometric}
                    />
                    <SettingItem
                        icon="🌐"
                        title="Language"
                        description="App language"
                        type="value"
                        value="English"
                        onPress={() => handleAppSetting()}
                    />
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <SettingItem
                        icon="❓"
                        title="Help Center"
                        description="FAQs and support articles"
                        type="navigation"
                        onPress={() => handleAppSetting()}
                    />
                    <SettingItem
                        icon="💬"
                        title="Contact Us"
                        description="Get in touch with support"
                        type="navigation"
                        onPress={() => handleAppSetting()}
                    />
                    <SettingItem
                        icon="⭐"
                        title="Rate App"
                        description="Share your feedback"
                        type="navigation"
                        onPress={() => handleAppSetting()}
                    />
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <SettingItem
                        icon="ℹ️"
                        title="App Version"
                        type="value"
                        value="0.0.2"
                    />
                    <SettingItem
                        icon="📄"
                        title="Terms of Service"
                        type="navigation"
                        onPress={() => handleAppSetting()}
                    />
                    <SettingItem
                        icon="🔐"
                        title="Privacy Policy"
                        type="navigation"
                        onPress={() => handleAppSetting()}
                    />
                </View>

                {/* Danger Zone */}
                <View style={styles.dangerZone}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={true}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} disabled={true}>
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
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    dangerZone: {
        paddingHorizontal: 20,
        marginTop: 12,
        marginBottom: 24,
        gap: 12,
    },
    logoutButton: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#94a3b8',
    },
    deleteButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    deleteGradient: {
        padding: 16,
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});