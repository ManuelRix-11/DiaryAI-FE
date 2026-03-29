import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeaderProps } from '@/src/types/ProfileProps';

export default function ProfileHeader({ name, email, avatar, onEditPress }: ProfileHeaderProps) {
    return (
        <View style={styles.profileHeader}>
            <LinearGradient
                colors={['rgba(91, 60, 230, 0.14)', 'rgba(245, 108, 91, 0.10)']}
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

                {onEditPress && (
                    <TouchableOpacity onPress={onEditPress} style={styles.editButton} activeOpacity={0.9}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        paddingHorizontal: 20,
        marginBottom: 22,
    },
    profileCard: {
        backgroundColor: '#111c33',
        borderWidth: 1,
        borderColor: '#243149',
        borderRadius: 22,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 14,
    },
    avatarGradient: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    avatar: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: '#0f172a',
    },
    avatarText: {
        fontSize: 30,
        fontWeight: '800',
        color: '#ffffff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '800',
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
        backgroundColor: 'rgba(91, 60, 230, 0.16)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(91, 60, 230, 0.45)',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#c4b5fd',
    },
});