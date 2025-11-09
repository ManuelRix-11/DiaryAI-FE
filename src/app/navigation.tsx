import React from "react";

import HomeScreen from "@/src/screens/Home";
import SettingsScreen from "@/src/screens/Settings";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    return (
        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false,
                lazy: true,
                tabBarStyle: { display: 'none' }

            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}