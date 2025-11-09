import React, { useRef, useEffect, ReactElement } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    Pressable
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from '@react-navigation/native';

interface NavItemProps {
    label: string;
    icon: ReactElement;
    onPress: () => void;
}

export default function Navbar() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const createLoopAnimation = (
            animValue: Animated.Value,
            toValue: number,
            duration: number
        ): Animated.CompositeAnimation =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animValue, {
                        toValue,
                        duration,
                        useNativeDriver: animValue !== glowAnim,
                    }),
                    Animated.timing(animValue, {
                        toValue: animValue === pulseAnim ? 1 : 0.4,
                        duration,
                        useNativeDriver: animValue !== glowAnim,
                    }),
                ])
            );

        const pulseAnimation = createLoopAnimation(pulseAnim, 1.05, 1500);
        const glowAnimation = createLoopAnimation(glowAnim, 2, 1500);

        pulseAnimation.start();
        glowAnimation.start();

        return () => {
            pulseAnimation.stop();
            glowAnimation.stop();
        };
    }, []);

    const handleCenterButtonPress = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.5,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();

        alert("Center button tapped");
    };

    const NavItem: React.FC<NavItemProps> = ({ label, icon, onPress }) => {
        const isActive: boolean = route.name === label;
        const color: string = isActive ? "#60a5fa" : "#94a3b8";

        return (
            <Pressable onPress={onPress} style={styles.navItem}>
                {// @ts-ignore
                     React.cloneElement(icon, { color })}
                <Text style={[styles.navText, { color }]}>{label}</Text>
            </Pressable>
        );
    };

    const navBarHeight: number = 70 + (insets.bottom || 0) + 20;

    return (
        <>
            <BlurView
                intensity={100}
                tint="dark"
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
                    <NavItem
                        label="Home"
                        icon={<Ionicons name="home-outline" size={22} />}
                        // @ts-ignore
                        onPress={() => navigation.navigate('Home')}
                    />
                    <NavItem
                        label="Insights"
                        icon={<AntDesign name="line-chart" size={22} />}
                        onPress={() => alert("Attenzione! Funzione non disponibile in questa versione")}
                    />
                    <View style={{ width: 80 }} />
                    <NavItem
                        label="History"
                        icon={<Ionicons name="time-outline" size={22} />}
                        onPress={() => {}}
                    />
                    <NavItem
                        label="Settings"
                        icon={<Ionicons name="settings-outline" size={22} />}
                        // @ts-ignore
                        onPress={() => navigation.navigate('Settings')}
                    />
                </View>
            </BlurView>

            <Animated.View
                style={[
                    styles.centerButtonWrapper,
                    {
                        bottom: (insets.bottom || 0) + 28,
                        transform: [{ scale: pulseAnim }],
                    }
                ]}
            >
                <Animated.View style={{ shadowOpacity: glowAnim }}>
                    <LinearGradient
                        colors={["#5B3CE6", "#F56C5B", "#E63C5B"]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: -1, y: 0.1 }}
                        style={styles.centerButtonGradient}
                    >
                        <TouchableOpacity onPress={handleCenterButtonPress} activeOpacity={1}>
                            <Animated.View
                                style={[
                                    styles.centerButton,
                                    { transform: [{ scale: scaleAnim }] }
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
    );
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
        borderColor: "#334155",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
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
        fontSize: 11,
        marginTop: 4,
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
    },
});