import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {ProfileHeaderProps} from "@/src/types/ProfileProps";

export default function ProfileHeader({ name, email, avatar, onEditPress }: ProfileHeaderProps) {
    return (
        <View style={styles.profileHeader}>
            <LinearGradient
                colors={['rgba(91, 60, 230, 0.1)', 'rgba(230, 60, 91, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileCard}
            >
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={['#5B3CE6', '#F56C5B', '#E63C5B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatarGradient}
                    >
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {name.charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{name}</Text>
                    <Text style={styles.profileEmail}>{email}</Text>
                </View>
                <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    profileCard: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatarGradient: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#0f172a',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#e2e8f0',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#94a3b8',
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(91, 60, 230, 0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#5B3CE6',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5B3CE6',
    },
});