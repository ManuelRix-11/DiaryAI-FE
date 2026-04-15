import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeaderProps } from '@/src/types/ProfileProps';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';

export default function ProfileHeader({ name, email, avatar, onEditPress }: ProfileHeaderProps) {
    const styles = useThemeStyles(createStyles);
    return (
        <View style={styles.profileHeader}>
            <LinearGradient
                colors={[styles.editButton.backgroundColor as string || 'rgba(91, 60, 230, 0.14)', styles.profileCard.borderColor as string || 'rgba(245, 108, 91, 0.10)']}
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    profileHeader: {
        paddingHorizontal: 20,
        marginBottom: 22,
    },
    profileCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
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
        backgroundColor: colors.background,
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
        color: colors.text,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.primaryBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primaryLight,
    },
});