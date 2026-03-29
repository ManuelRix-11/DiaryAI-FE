import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usersApi } from '@/src/api/users';
import { AuthUser } from "@/model/user";

type Mode = 'login' | 'register';

type AuthScreenProps = {
    onAuthSuccess?: (user: AuthUser) => void;
};

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<Mode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Attenzione', 'Inserisci email e password.');
            return;
        }

        if (mode === 'register') {
            if (!name.trim()) {
                Alert.alert('Attenzione', 'Inserisci il tuo nome.');
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert('Attenzione', 'Le password non coincidono.');
                return;
            }
        }

        try {
            setLoading(true);

            const user =
                mode === 'login'
                    ? await usersApi.login({ email: email.trim(), password })
                    : await usersApi.register({
                        username: name.trim(),
                        email: email.trim(),
                        password,
                    });

            onAuthSuccess?.(user);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Si è verificato un errore durante l’autenticazione.';
            Alert.alert('Errore', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.content,
                        {
                            paddingTop: insets.top + 24,
                            paddingBottom: insets.bottom + 24,
                        },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.hero}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>DiaryAI</Text>
                        </View>

                        <Image
                            source={require('@/assets/img/logoNoText.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.title}>
                            {mode === 'login' ? 'Bentornato' : 'Crea il tuo account'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {mode === 'login'
                                ? 'Accedi per continuare a scrivere e tenere traccia dei tuoi diari.'
                                : 'Registrati per iniziare a usare DiaryAI in pochi secondi.'}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.toggleRow}>
                            <Pressable
                                onPress={() => setMode('login')}
                                style={[styles.toggleButton, mode === 'login' && styles.toggleButtonActive]}
                                disabled={loading}
                            >
                                <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
                                    Login
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setMode('register')}
                                style={[styles.toggleButton, mode === 'register' && styles.toggleButtonActive]}
                                disabled={loading}
                            >
                                <Text style={[styles.toggleText, mode === 'register' && styles.toggleTextActive]}>
                                    Registrati
                                </Text>
                            </Pressable>
                        </View>

                        {mode === 'register' && (
                            <View style={styles.field}>
                                <Text style={styles.label}>Nome</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Il tuo nome"
                                    placeholderTextColor="#64748b"
                                    style={styles.input}
                                    editable={!loading}
                                />
                            </View>
                        )}

                        <View style={styles.field}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="nome@email.com"
                                placeholderTextColor="#64748b"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#64748b"
                                secureTextEntry
                                style={styles.input}
                                editable={!loading}
                            />
                        </View>

                        {mode === 'register' && (
                            <View style={styles.field}>
                                <Text style={styles.label}>Conferma password</Text>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry
                                    style={styles.input}
                                    editable={!loading}
                                />
                            </View>
                        )}

                        <Pressable onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
                            <LinearGradient
                                colors={['#5B3CE6', '#F56C5B', '#E63C5B']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.submitGradient, loading && styles.submitGradientDisabled]}
                            >
                                <Text style={styles.submitText}>
                                    {loading ? 'Attendi...' : mode === 'login' ? 'Accedi' : 'Crea account'}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    hero: {
        marginBottom: 24,
        alignItems: 'center',
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
    logo: {
        width: 92,
        height: 92,
        marginBottom: 16,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        lineHeight: 22,
        textAlign: 'center',
        maxWidth: 320,
    },
    card: {
        backgroundColor: '#111c33',
        borderColor: '#243149',
        borderWidth: 1,
        borderRadius: 24,
        padding: 18,
        gap: 14,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#334155',
    },
    toggleButtonActive: {
        borderColor: '#5B3CE6',
        backgroundColor: '#17213a',
    },
    toggleText: {
        color: '#94a3b8',
        fontWeight: '700',
    },
    toggleTextActive: {
        color: '#e2e8f0',
    },
    field: {
        gap: 8,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
    },
    submitButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 6,
    },
    submitGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    submitGradientDisabled: {
        opacity: 0.75,
    },
    submitText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
    },
});