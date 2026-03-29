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

type ProfileScreenProps = {
    user: AuthUser;
};

export default function ProfileScreen({ user }: ProfileScreenProps) {
    const insets = useSafeAreaInsets();

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
});
