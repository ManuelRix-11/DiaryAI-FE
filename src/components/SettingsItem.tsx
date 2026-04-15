import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SettingItemProps } from '@/src/types/SettingsProps';
import { useThemeStyles, ThemeColors, useTheme } from '../theme/ThemeContext';

export default function SettingItem({
                                        icon,
                                        title,
                                        description,
                                        type = 'navigation',
                                        value,
                                        onPress,
                                        onToggle,
                                        onChangeText,
                                        secureTextEntry,
                                    }: SettingItemProps) {
    const { isDark } = useTheme();
    const styles = useThemeStyles(createStyles);
    
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={type === 'toggle' || type === 'input'}
            activeOpacity={0.8}
        >
            <View style={styles.settingLeft}>
                <LinearGradient
                    colors={['#5B3CE6', '#E63C5B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer}
                >
                    <Text style={styles.icon}>{icon}</Text>
                </LinearGradient>

                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {description && (
                        <Text style={styles.settingDescription}>{description}</Text>
                    )}
                </View>
            </View>

            <View style={styles.settingRight}>
                {type === 'navigation' && <Text style={styles.arrow}>›</Text>}

                {type === 'toggle' && typeof value === 'boolean' && (
                    <Switch
                        value={value}
                        onValueChange={onToggle}
                        trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: styles.iconContainer.backgroundColor as string || '#5B3CE6' }}
                        thumbColor={value ? '#ffffff' : '#f8fafc'}
                    />
                )}

                {type === 'value' && (
                    <Text style={styles.valueText}>{value as string}</Text>
                )}

                {type === 'input' && (
                    <TextInput
                        style={styles.inputField}
                        value={value as string}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor="#94a3b8"
                        placeholder="Aggiungi..."
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    settingItem: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '700',
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    settingRight: {
        marginLeft: 12,
    },
    arrow: {
        fontSize: 26,
        color: colors.textSecondary,
        fontWeight: '300',
        marginTop: -2,
    },
    valueText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    inputField: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '600',
        minWidth: 100,
        textAlign: 'right',
        paddingVertical: 4,
        paddingHorizontal: 0,
    },
});