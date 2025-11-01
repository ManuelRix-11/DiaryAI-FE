import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Navbar() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState("Home");

    // Animazioni per il bottone centrale
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.4)).current;

    // Animazione continua di pulse
    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        const glowAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 2,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 2,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ])
        );

        pulseAnimation.start();
        glowAnimation.start();

        return () => {
            pulseAnimation.stop();
            glowAnimation.stop();
        };
    }, []);

    const handleCenterButtonPress = () => {
        // Animazione di tap: scale down + rotation
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.5,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 2,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        alert("Center button tapped");
    };

    const handleTabPress = (tabName: string) => {
        setActiveTab(tabName);
        alert(`${tabName} tapped`);
    };

    const renderNavItem = (name: string, icon: any) => {
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

    // Calcola l'altezza totale della navbar includendo gli insets + extra per nascondere il bordo
    const navBarHeight = 70 + (insets.bottom || 0) + 20;

    return (
        <>
            {/* Glass-like Bottom Navigation (Blur + translucent background) */}
            <BlurView
                intensity={100}
                tint={"dark"}
                style={[
                    styles.bottomNav,
                    {
                        bottom: -20,
                        height: navBarHeight,
                        paddingBottom: (insets.bottom || 0) + 20,
                    },
                ]}
            >
                <View style={styles.navRow}>
                    {renderNavItem("Home", <Ionicons name="home-outline" size={22} color={activeTab === "Home" ? "#60a5fa" : "#94a3b8"} />)}

                    {renderNavItem("Insights", <AntDesign name="line-chart" size={22} color={activeTab === "Insights" ? "#60a5fa" : "#94a3b8"} />)}

                    {/* placeholder space for center button */}
                    <View style={{ width: 80 }} />

                    {renderNavItem("History", <Ionicons name="time-outline" size={22} color={activeTab === "History" ? "#60a5fa" : "#94a3b8"} />)}

                    {renderNavItem("Settings", <Ionicons name="settings-outline" size={22} color={activeTab === "Settings" ? "#60a5fa" : "#94a3b8"} />)}
                </View>
            </BlurView>

            {/* Floating Center Button with animations */}
            <Animated.View
                style={[
                    styles.centerButtonWrapper,
                    {
                        bottom: (insets.bottom || 0) + 28,
                        transform: [{ scale: pulseAnim }],
                    }
                ]}
            >
                <Animated.View
                    style={{
                        shadowOpacity: glowAnim,
                    }}
                >
                    <LinearGradient
                        colors={["#5B3CE6", "#F56C5B","#E63C5B"]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: -1, y: 0.1 }}
                        style={styles.centerButtonGradient}
                    >
                        <TouchableOpacity
                            onPress={handleCenterButtonPress}
                            activeOpacity={1}
                        >
                            <Animated.View
                                style={[
                                    styles.centerButton,
                                    {
                                        transform: [
                                            { scale: scaleAnim },
                                        ],
                                    }
                                ]}
                            >
                                <Image
                                    source={require("../../assets/img/logoNoText.png")}
                                    style={styles.centerButtonImage}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    bottomNav: {
        position: "absolute",
        width: "100%",
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        overflow: "hidden",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
        borderColor: "#334155",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        justifyContent: "flex-start",
        paddingTop: 8,
        paddingHorizontal: 8,
    },
    navRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        height: 55,
    },
    navItem: {
        alignItems: "center",
        flex: 1,
    },
    navText: {
        color: "#94a3b8",
        fontSize: 11,
        marginTop: 4,
    },
    navTextActive: {
        color: "#60a5fa",
        fontWeight: "700",
    },
    centerButtonWrapper: {
        position: "absolute",
        alignSelf: "center",
        zIndex: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    centerButtonGradient: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#3b82f6",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 10,
    },
    centerButton: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
    },
    centerButtonImage: {
        width: 40,
        height: 40,
        zIndex: 10,
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
        backgroundColor: '#1e293b',
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