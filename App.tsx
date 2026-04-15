import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./src/app/navigation";
import { ThemeProvider } from "./src/theme/ThemeContext";

export default function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <AppNavigation />
            </NavigationContainer>
        </ThemeProvider>
    );
}
