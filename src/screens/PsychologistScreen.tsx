import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserCheck, KeySquare, Users, Trash2, ArrowLeft } from 'lucide-react-native';

import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';
import { AuthUser } from '@/model/user';
import { apiClient } from '../api/apiClient';

type PsychologistScreenProps = {
    user: AuthUser;
};

// Mocked types for now
type PsychologistInfo = {
    id: string;
    name: string;
    surname: string;
    albo_number: string;
    albo_region: string;
};

export default function PsychologistScreen({ user }: PsychologistScreenProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const styles = useThemeStyles(createStyles);

    const [isLoading, setIsLoading] = useState(false);
    const [psychologist, setPsychologist] = useState<PsychologistInfo | null>(null);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    // Load link state on mount
    useEffect(() => {
        fetchLinkState();
    }, []);

    const fetchLinkState = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.get<{
                psychologist: PsychologistInfo | null;
                invite_code: { code: string; expires_at: string } | null;
            }>(`/users/${user.id}/psychologist-link`);
            
            setPsychologist(data.psychologist);
            if (data.invite_code) {
                setInviteCode(data.invite_code.code);
            } else {
                setInviteCode(null);
            }
        } catch (error: any) {
            console.error("Failed to fetch psychologist link", error);
            Alert.alert("Errore", "Impossibile caricare lo stato del collegamento.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCode = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.post<{ code: string; expires_at: string }>(
                `/users/${user.id}/invite-code`
            );
            setInviteCode(data.code);
        } catch (error: any) {
            console.error("Failed to generate invite code", error);
            Alert.alert("Errore", "Impossibile generare il codice invito.");
        } finally {
            setIsLoading(false);
        }
    };

    const performRevoke = async () => {
        setIsLoading(true);
        try {
            await apiClient.delete(`/users/${user.id}/psychologist-link`);
            setPsychologist(null);
            setInviteCode(null);
            Alert.alert("Successo", "Collegamento rimosso con successo.");
        } catch (error: any) {
            console.error("Failed to revoke access", error);
            Alert.alert("Errore", "Impossibile rimuovere il collegamento.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeAccess = () => {
        Alert.alert(
            "Revoca Accesso",
            "Sei sicuro di voler rimuovere l'accesso al tuo psicologo? Non potrà più vedere i tuoi progressi.",
            [
                { text: "Annulla", style: "cancel" },
                { 
                    text: "Revoca", 
                    style: "destructive",
                    onPress: performRevoke
                }
            ]
        );
    };

    const handleCancelInvite = () => {
        Alert.alert(
            "Annulla Invito",
            "Sei sicuro di voler annullare questo codice invito? Lo psicologo non potrà più utilizzarlo per collegarsi.",
            [
                { text: "Annulla", style: "cancel" },
                { 
                    text: "Annulla Invito", 
                    style: "destructive",
                    onPress: performRevoke
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={styles.title.color as string} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Il tuo Psicologo</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#5B3CE6" style={{ marginTop: 40 }} />
                ) : psychologist ? (
                    <View style={styles.card}>
                        <View style={styles.avatarPlaceholder}>
                            <UserCheck color="#ffffff" size={32} />
                        </View>
                        <Text style={styles.psyName}>Dott. {psychologist.name} {psychologist.surname}</Text>
                        <Text style={styles.psyAlbo}>Albo: {psychologist.albo_number} ({psychologist.albo_region})</Text>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                Il tuo psicologo ha accesso alle tue statistiche aggregate e allo storico del tuo umore. Non può leggere il contenuto dei tuoi diari.
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.dangerButton} onPress={handleRevokeAccess}>
                            <Trash2 color="#E63C5B" size={20} style={{ marginRight: 8 }} />
                            <Text style={styles.dangerButtonText}>Cambia Psicologo / Revoca</Text>
                        </TouchableOpacity>
                    </View>
                ) : inviteCode ? (
                    <View style={styles.card}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: '#0EA5E9' }]}>
                            <KeySquare color="#ffffff" size={32} />
                        </View>
                        <Text style={styles.psyName}>Codice Invito Generato</Text>
                        <Text style={styles.psyAlbo}>Comunica questo codice al tuo psicologo per permettergli di collegarsi al tuo account.</Text>
                        
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeText}>{inviteCode}</Text>
                        </View>
                        
                        <Text style={styles.expiryText}>Il codice scade tra 7 giorni.</Text>
                        
                        <TouchableOpacity style={[styles.dangerButton, { marginTop: 20 }]} onPress={handleCancelInvite}>
                            <Text style={styles.dangerButtonText}>Annulla Invito</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Users color="#5B3CE6" size={48} />
                        </View>
                        <Text style={styles.emptyTitle}>Nessuno psicologo collegato</Text>
                        <Text style={styles.emptySubtitle}>
                            Genera un codice di invito da condividere con il tuo terapeuta. Potrà monitorare il tuo andamento direttamente dalla sua dashboard, nel totale rispetto della tua privacy.
                        </Text>
                        
                        <TouchableOpacity onPress={handleGenerateCode}>
                            <LinearGradient
                                colors={['#5B3CE6', '#7C3AED']}
                                style={styles.generateButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <KeySquare color="#ffffff" size={20} style={{ marginRight: 8 }} />
                                <Text style={styles.generateButtonText}>Genera Codice Invito</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#5B3CE6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    psyName: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 6,
        textAlign: 'center',
    },
    psyAlbo: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    infoBox: {
        backgroundColor: colors.primaryBg,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 13,
        color: colors.primaryLight,
        lineHeight: 20,
        textAlign: 'center',
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(230, 60, 91, 0.1)',
        width: '100%',
    },
    dangerButtonText: {
        color: '#E63C5B',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
    },
    generateButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    codeContainer: {
        backgroundColor: colors.background,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#0EA5E9',
        borderStyle: 'dashed',
        marginBottom: 12,
    },
    codeText: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text,
        letterSpacing: 4,
    },
    expiryText: {
        fontSize: 13,
        color: colors.textSecondary,
    }
});
