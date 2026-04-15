import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LockScreenProps {
    onUnlock: () => void;
    onLogout: () => void;
}

export default function LockScreen({ onUnlock, onLogout }: LockScreenProps) {
    const insets = useSafeAreaInsets();

    const authenticate = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                // If somehow they got here without hardware, just let them in to avoid locking out
                onUnlock();
                return;
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                // Not enrolled any biometrics
                onUnlock();
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Sblocca DiaryAI',
                cancelLabel: 'Annulla',
                disableDeviceFallback: false,
                fallbackLabel: 'Usa PIN',
            });

            if (result.success) {
                onUnlock();
            }
        } catch (error) {
            console.error('Biometric Auth Error:', error);
        }
    };

    // Attempt authentication on mount
    useEffect(() => {
        const timeout = setTimeout(() => {
            authenticate();
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleLogoutConfirm = () => {
        Alert.alert('Logout', 'Vuoi tornare alla schermata di login?', [
            { text: 'Annulla', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: onLogout },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
                
                <View style={styles.headerContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed" size={48} color="#c4b5fd" />
                    </View>
                    <Text style={styles.title}>DiaryAI è Bloccato</Text>
                    <Text style={styles.subtitle}>
                        Usa il Face ID o l'Impronta Digitale per accedere ai tuoi ricordi al sicuro.
                    </Text>
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={authenticate} activeOpacity={0.8} style={styles.unlockButton}>
                        <LinearGradient
                            colors={['#5B3CE6', '#9B5BDE']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.unlockGradient}
                        >
                            <Ionicons name="finger-print" size={24} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.unlockText}>Sblocca Diario</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutConfirm} activeOpacity={0.7}>
                        <Text style={styles.logoutText}>Usa login classico (Logout)</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(91, 60, 230, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(91, 60, 230, 0.3)',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 20,
    },
    unlockButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    unlockGradient: {
        flexDirection: 'row',
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unlockText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    logoutText: {
        color: '#94a3b8',
        fontSize: 15,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
