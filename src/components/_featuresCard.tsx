import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FeaturesCardProps {
    title: string;
    description: string;
    buttonText: string;
    onPress: () => void;
}

export default function FeaturesCard({ title, description, buttonText, onPress }: FeaturesCardProps) {
    return (
        <View style={styles.featuredCard} >
            <LinearGradient
                colors={['#5B3CE6', '#F56C5B', '#E63C5B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredGradient}
            >
                <Text style={styles.featuredTitle}>{title}</Text>
                <Text style={styles.featuredDescription}>{description}</Text>
                <TouchableOpacity style={styles.featuredButton} onPress={onPress}>
                    <Text style={styles.featuredButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    featuredCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    featuredGradient: {
        padding: 24,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
    },
    featuredDescription: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 20,
        lineHeight: 22,
    },
    featuredButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    featuredButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
});