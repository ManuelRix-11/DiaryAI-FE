import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

import Navbar from '../components/_navbar';
import ProfileHeader from '../components/ProfileHeader';
import SettingItem from '../components/SettingsItem';
import { AuthUser } from '@/model/user';
import { useTheme, useThemeStyles, ThemeMode, ThemeColors } from '../theme/ThemeContext';

type SettingsScreenProps = {
    onLogout?: () => void;
    user: AuthUser;
};

export default function SettingsScreen({ onLogout, user }: SettingsScreenProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { theme, setTheme } = useTheme();
    const styles = useThemeStyles(createStyles);

    const [notifications, setNotifications] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [biometric, setBiometric] = useState(false);

    const BIOMETRIC_KEY = '@diaryai:biometric_enabled';

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const bio = await AsyncStorage.getItem(BIOMETRIC_KEY);
                setBiometric(bio === 'true');
            } catch (e) {
                console.error('Error loading settings', e);
            }
        };
        loadSettings();
    }, []);

    const handleBiometricToggle = async (value: boolean) => {
        if (value) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert(
                    'Biometria non disponibile',
                    'Il dispositivo non supporta o non ha registrato il Face ID / Touch ID.',
                );
                return;
            }
        }
        
        setBiometric(value);
        await AsyncStorage.setItem(BIOMETRIC_KEY, value ? 'true' : 'false');
    };

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
                    <Text style={styles.sectionTitle}>Aspetto</Text>
                    <View style={styles.themeSelector}>
                        {([
                            { id: 'light', label: 'Chiaro', icon: 'sunny' },
                            { id: 'dark', label: 'Scuro', icon: 'moon' },
                            { id: 'system', label: 'Auto', icon: 'phone-portrait-outline' }
                        ] as const).map(option => {
                            const isActive = theme === option.id;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[styles.themeOption, isActive && styles.themeOptionActive]}
                                    activeOpacity={0.8}
                                    onPress={() => setTheme(option.id)}
                                >
                                    <Ionicons 
                                        name={option.icon} 
                                        size={20} 
                                        color={isActive ? '#ffffff' : styles.themeOptionText.color} 
                                        style={{ marginBottom: 6 }} 
                                    />
                                    <Text style={[styles.themeOptionText, isActive && styles.themeOptionTextActive]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
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
                        onToggle={handleBiometricToggle}
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
        marginBottom: 20,
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
        maxWidth: 340,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    themeSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    themeOption: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    themeOptionActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    themeOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    themeOptionTextActive: {
        color: '#ffffff',
    },
    dangerZone: {
        paddingHorizontal: 20,
        marginTop: 8,
        marginBottom: 24,
        gap: 12,
    },
    logoutButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
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