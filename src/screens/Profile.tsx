import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Navbar from '../components/_navbar';
import ProfileHeader from '../components/ProfileHeader';
import SettingItem from '../components/SettingsItem';
import { AuthUser } from '@/model/user';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';

type ProfileScreenProps = {
    user: AuthUser;
};

export default function ProfileScreen({ user }: ProfileScreenProps) {
    const insets = useSafeAreaInsets();
    const styles = useThemeStyles(createStyles);

    const [privateStats, setPrivateStats] = useState(true);
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('********');

    const handleAction = () => {
        Alert.alert('Attenzione', 'Opzione non disponibile in questa versione');
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
                        <Text style={styles.badgeText}>Identity</Text>
                    </View>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <Text style={styles.headerSubtitle}>
                        Gestisci le tue informazioni personali e il tuo profilo pubblico.
                    </Text>
                </View>

                <ProfileHeader
                    name={user.username || 'User'}
                    email={email}
                    avatar={null}
                />

                <View style={styles.section}>
                    <SettingItem
                        icon="📧"
                        title="Email Address"
                        description="Modifica la mail collegata all'account"
                        type="input"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <SettingItem
                        icon="🔒"
                        title="Password"
                        description="Modifica la password del tuo account"
                        type="input"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
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
});
