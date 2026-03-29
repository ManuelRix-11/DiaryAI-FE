import React, { useEffect, useState } from 'react';
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

const Stack = createNativeStackNavigator();

const AUTH_KEY = '@diaryai:user';

export default function AppNavigation() {
    const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedUser = await AsyncStorage.getItem(AUTH_KEY);
                setUser(storedUser ? JSON.parse(storedUser) : null);
            } catch {
                setUser(null);
            }
        };

        restoreSession();
    }, []);

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