import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {CardProps} from "@/src/types/CardProps";

export default function Card({ title, description}: CardProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const styles = useThemeStyles(createStyles);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: 0.3,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay: 0.3,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.projectCard,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim },
                    ],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <LinearGradient
                    colors={['rgba(96, 165, 250, 0.05)', 'transparent']}
                    style={styles.cardGradient}
                >
                    <View style={styles.cardTopBorder} />
                    <Text style={styles.projectTitle}>{title}</Text>
                    <Text style={styles.projectDescription}>{description}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    projectCard: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardGradient: {
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 24,
    },
    cardTopBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.primary,
    },
    projectTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    projectDescription: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: 20,
    },
});