import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '@/model/user';

import AuthScreen from '../screens/Auth';
import HomeScreen from '../screens/Home';
import SettingsScreen from '@/src/screens/Settings';
import WritingScreen from '@/src/screens/WritingScreen';
import ProfileScreen from '@/src/screens/Profile';
import NewDiaryModal from '@/src/components/NewDiaryModal';
import HistoryScreen from '@/src/screens/HistoryScreen';
import InsightsScreen from '@/src/screens/InsightsScreen';
import LockScreen from '../screens/LockScreen';
import { ThemeProvider } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

const AUTH_KEY = '@diaryai:user';
const BIOMETRIC_KEY = '@diaryai:biometric_enabled';

function AppNavigationInner() {
    const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false);
    
    const appState = useRef(AppState.currentState);
    const backgroundTimestamp = useRef<number | null>(null);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedUser = await AsyncStorage.getItem(AUTH_KEY);
                const biometricFlag = await AsyncStorage.getItem(BIOMETRIC_KEY);
                const isBioEnabled = biometricFlag === 'true';
                
                setIsBiometricEnabled(isBioEnabled);
                
                if (storedUser) {
                    if (isBioEnabled) {
                        setIsLocked(true);
                    }
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                if (backgroundTimestamp.current && isBiometricEnabled && user) {
                    const timePassed = Date.now() - backgroundTimestamp.current;
                    const tenMinutes = 10 * 60 * 1000;
                    if (timePassed > tenMinutes) {
                         setIsLocked(true);
                    }
                }
            } else if (nextAppState.match(/inactive|background/)) {
                backgroundTimestamp.current = Date.now();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isBiometricEnabled, user]);

    const handleLogin = async (loggedUser: AuthUser) => {
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(loggedUser));
        setUser(loggedUser);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem(AUTH_KEY);
        setUser(null);
    };

    if (user === undefined) {
        return null;
    }

    if (user && isLocked) {
        return (
            <LockScreen 
                onUnlock={() => setIsLocked(false)} 
                onLogout={handleLogout} 
            />
        );
    }

    if (!user) {
        return (
            <Stack.Navigator
                initialRouteName="Auth"
                screenOptions={{ headerShown: false, animation: 'none' }}
            >
                <Stack.Screen name="Auth">
                    {(props) => (
                        <AuthScreen
                            {...props}
                            onAuthSuccess={handleLogin}
                        />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false, animation: 'none' }}
        >
            <Stack.Screen name="Home">
                {(props) => (
                    <HomeScreen
                        {...props}
                        user={user}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="Settings">
                {(props) => (
                    <SettingsScreen
                        {...props}
                        user={user}
                        onLogout={handleLogout}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="Profile">
                {(props) => (
                    <ProfileScreen
                        {...props}
                        user={user}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="History">
                {(props) => (
                    <HistoryScreen
                        {...props}
                        user={user}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="Insights">
                {(props) => (
                    <InsightsScreen
                        {...props}
                        user={user}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen
                name="Diary"
                component={WritingScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="NewDiaryModal" options={{ presentation: 'transparentModal', headerShown: false }}>
                {(props) => (
                    <NewDiaryModal
                        {...props}
                        user={user}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

export default function AppNavigation() {
    return (
        <ThemeProvider>
            <AppNavigationInner />
        </ThemeProvider>
    );
}