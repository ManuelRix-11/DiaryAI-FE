import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { diariesApi } from '@/src/api/diaries';
import { AuthUser } from '@/model/user';

interface NewDiaryModalProps {
    user: AuthUser;
    route?: any;
    navigation?: any;
}

export default function NewDiaryModal({ user }: NewDiaryModalProps) {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleCreate = () => {
        const finalTitle = title.trim() || new Date().toLocaleDateString();
        // @ts-ignore
        navigation.replace('Diary', { title: finalTitle, userId: user.id });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : 0}
        >
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => navigation.goBack()} disabled={isLoading} />

            <View style={styles.modalContent}>
                <Text style={styles.title}>Nuovo Diario</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Titolo..."
                    placeholderTextColor="#475569"
                    value={title}
                    onChangeText={setTitle}
                    autoFocus
                    editable={!isLoading}
                />
                <Text style={styles.note}>Preferibilmente inserire la data odierna</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton} disabled={isLoading}>
                        <Text style={styles.cancelText}>Annulla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCreate} style={styles.createButton} disabled={isLoading}>
                        <LinearGradient colors={['#5B3CE6', '#F56C5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createGradient}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.createText}>Crea</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#111c33',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#243149',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#243149',
        borderRadius: 12,
        padding: 14,
        color: '#f8fafc',
        fontSize: 16,
        marginBottom: 8,
    },
    note: {
        fontSize: 12,
        color: '#94a3b8aa',
        marginBottom: 24,
        marginLeft: 4,
        fontStyle: 'italic'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        justifyContent: 'center',
    },
    cancelText: {
        color: '#94a3b8',
        fontSize: 15,
        fontWeight: '600',
    },
    createButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    createGradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    createText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});
