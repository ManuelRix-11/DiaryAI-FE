import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Navbar() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState("Home");

    const handleTabPress = (tabName: any) => {
        setActiveTab(tabName);
        alert(`${tabName} tapped`);
    };

    const renderNavItem = (name: any, icon: any) => {
        const isActive = activeTab === name;
        
        return (
            <TouchableOpacity 
                style={styles.navItem} 
                onPress={() => handleTabPress(name)}
            >
                {isActive ? (
                    <View style={styles.innerContainer}>
                        {icon}
                    </View>
                ) : (
                    <View style={styles.inactiveIcon}>
                        {icon}
                    </View>
                )}
                <Text style={[
                    styles.navText, 
                    isActive && styles.navTextActive
                ]}>
                    {name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            {/* Glass-like Bottom Navigation (Blur + translucent background) */}
            <BlurView
                intensity={100}
                tint={"dark"}
                style={[
                    styles.bottomNav,
                    {
                        bottom: (insets.bottom || 10),
                    },
                ]}
            >
                <View style={styles.navRow}>
                    {renderNavItem("Home", <Ionicons name="home-outline" size={22} color={activeTab === "Home" ? "#00d4ff" : "#fff"} />)}
                    
                    {renderNavItem("Insights", <AntDesign name="line-chart" size={22} color={activeTab === "Insights" ? "#00d4ff" : "#fff"} />)}

                    {/* placeholder space for center button */}
                    <View style={{ width: 80 }} />

                    {renderNavItem("History", <Ionicons name="time-outline" size={22} color={activeTab === "History" ? "#00d4ff" : "#fff"} />)}
                    
                    {renderNavItem("Settings", <Ionicons name="settings-outline" size={22} color={activeTab === "Settings" ? "#00d4ff" : "#fff"} />)}
                </View>
            </BlurView>

            {/* Floating Center Button with surrounding gradient cutout */}
            <View style={[styles.centerButtonWrapper, { bottom: (insets.bottom || 0) + 28 }]}>
                <LinearGradient
                    colors={["#5B3CE6", "#F56C5B","#E63C5B"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: -1, y: 0.1 }}
                    style={styles.centerButtonGradient}
                >
                    <TouchableOpacity onPress={() => alert("Center button tapped")}>
                        <View style={styles.centerButton}>
                            <Image source={require("../../assets/img/logoNoText.png")} style={{ width: 40, height: 40 }} />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    bottomNav: {
        position: "absolute",
        width: "100%",
        height: 70,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        backgroundColor: "transparent",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    navRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    navItem: {
        alignItems: "center",
        flex: 1,
    },
    navText: {
        color: "#fff",
        fontSize: 11,
        marginTop: 4,
    },
    navTextActive: {
        color: "#00d4ff",
        fontWeight: "700",
    },
    centerButtonWrapper: {
        position: "absolute",
        alignSelf: "center",
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    centerButtonGradient: {
        width: 70,
        height: 70,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 6,
        elevation: 6,
    },
    centerButton: {
        width: 62,
        height: 62,
        borderRadius: 46,
        backgroundColor: "#121212",
        alignItems: "center",
        justifyContent: "center",
    },
    gradientBorder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inactiveIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

