import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme, Animated, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const darkColors = {
    background: '#0f172a',
    surface: '#111c33',
    surfaceAlt: '#1e293b',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    primary: '#5B3CE6',
    primaryLight: '#a78bfa',
    primaryBg: 'rgba(91, 60, 230, 0.12)',
    primaryBorder: 'rgba(91, 60, 230, 0.3)',
    danger: '#F56C5B',
    success: '#34d399',
    border: 'rgba(255,255,255,0.05)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.05)',
};

export const lightColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    primary: '#5B3CE6',
    primaryLight: '#c4b5fd',
    primaryBg: 'rgba(91, 60, 230, 0.08)',
    primaryBorder: 'rgba(91, 60, 230, 0.2)',
    danger: '#e11d48',
    success: '#10b981',
    border: 'rgba(0,0,0,0.05)',
    surfaceHighlight: 'rgba(0,0,0,0.05)',
};

export type ThemeColors = typeof darkColors;
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextProps {
    theme: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>('system');
    const [isAppInitialised, setInitialised] = useState(false);

    // Fade animation value
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@diaryai:theme_mode');
                if (savedTheme) {
                    setThemeState(savedTheme as ThemeMode);
                }
            } catch (e) { }
            setInitialised(true);
        };
        loadTheme();
    }, []);

    const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';
    const colors = isDark ? darkColors : lightColors;

    const setTheme = async (mode: ThemeMode) => {
        if (mode === theme) return;

        // FADE IN OVERLAY
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start(async () => {
            setThemeState(mode);
            await AsyncStorage.setItem('@diaryai:theme_mode', mode);

            // FADE OUT OVERLAY
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                delay: 50, // brief pause to let react render
                useNativeDriver: true,
            }).start();
        });
    };

    const value = useMemo(() => ({ theme, isDark, colors, setTheme }), [theme, isDark, colors]);

    if (!isAppInitialised) return null;

    return (
        <ThemeContext.Provider value={value}>
            {children}
            {/* Transition Overlay */}
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: colors.background,
                        opacity: fadeAnim,
                        zIndex: 99999,
                    }
                ]}
            />
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

// HELPER HOOK TO DYNAMICALLY CREATE STYLES
export function useThemeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
    creator: (colors: ThemeColors, isDark: boolean) => T
): T {
    const { colors, isDark } = useTheme();
    return useMemo(() => StyleSheet.create(creator(colors, isDark)), [colors, isDark]);
}
