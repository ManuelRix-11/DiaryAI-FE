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
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';

type Mode = 'login' | 'register';

type AuthScreenProps = {
    onAuthSuccess?: (user: AuthUser) => void;
};

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const insets = useSafeAreaInsets();
    const styles = useThemeStyles(createStyles);
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    logo: {
        width: 92,
        height: 92,
        marginBottom: 16,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 22,
        textAlign: 'center',
        maxWidth: 320,
    },
    card: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
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
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    toggleButtonActive: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceAlt,
    },
    toggleText: {
        color: colors.textSecondary,
        fontWeight: '700',
    },
    toggleTextActive: {
        color: colors.text,
    },
    field: {
        gap: 8,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.background,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
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