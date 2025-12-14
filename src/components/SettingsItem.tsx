import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {SettingItemProps} from "@/src/types/SettingsProps";


export default function SettingItem({
                                        icon,
                                        title,
                                        description,
                                        type = 'navigation',
                                        value,
                                        onPress,
                                        onToggle
                                    }: SettingItemProps) {
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={type === 'toggle'}
            activeOpacity={0.7}
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
                {type === 'navigation' && (
                    <Text style={styles.arrow}>›</Text>
                )}
                {type === 'toggle' && typeof value === 'boolean' && (
                    <Switch
                        value={value}
                        onValueChange={onToggle}
                        trackColor={{ false: '#334155', true: '#5B3CE6' }}
                        thumbColor={value ? '#ffffff' : '#94a3b8'}
                    />
                )}
                {type === 'value' && (
                    <Text style={styles.valueText}>{value}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    settingItem: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
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
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e2e8f0',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: '#94a3b8',
    },
    settingRight: {
        marginLeft: 12,
    },
    arrow: {
        fontSize: 24,
        color: '#94a3b8',
        fontWeight: '300',
    },
    valueText: {
        fontSize: 14,
        color: '#94a3b8',
    },
});