import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreen from '../screens/Home';
import SettingsScreen from "@/src/screens/Settings";
import WritingScreen from "@/src/screens/WritingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Settings' component={SettingsScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Diary' component={WritingScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
