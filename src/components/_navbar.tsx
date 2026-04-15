import React, { useRef, useEffect } from "react";
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
import { NavItemProps } from "@/src/types/NavProps";
import { useThemeStyles, ThemeColors, useTheme } from '../theme/ThemeContext';

export default function Navbar() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { isDark } = useTheme();
    const styles = useThemeStyles(createStyles);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.35)).current;

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
                        toValue: animValue === pulseAnim ? 1 : 0.35,
                        duration,
                        useNativeDriver: animValue !== glowAnim,
                    }),
                ])
            );

        const pulseAnimation = createLoopAnimation(pulseAnim, 1.03, 1700);
        const glowAnimation = createLoopAnimation(glowAnim, 1.8, 1700);

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
                toValue: 1.15,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();

        // @ts-ignore
        navigation.navigate('NewDiaryModal');
    };

    const NavItem: React.FC<NavItemProps> = ({ label, icon, onPress }) => {
        const isActive: boolean = route.name === label;
        const color: string = isActive ? styles.navTextActive.color as string || "#c4b5fd" : styles.navText.color as string || "#94a3b8";

        return (
            <Pressable onPress={onPress} style={styles.navItem}>
                {
                    // @ts-ignore
                    React.cloneElement(icon, { color })
                }
                <Text style={[styles.navText, { color }]}>{label}</Text>
            </Pressable>
        );
    };

    const navBarHeight: number = 70 + (insets.bottom || 0) + 20;

    return (
        <>
            <BlurView
                intensity={80}
                tint={isDark ? "dark" : "light"}
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
                        onPress={() => navigation.navigate('Insights' as never)}
                    />
                    <View style={{ width: 82 }} />
                    <NavItem
                        label="History"
                        icon={<Ionicons name="time-outline" size={22} />}
                        // @ts-ignore
                        onPress={() => navigation.navigate('History')}
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
                                    source={require("@/assets/img/logoNoText.png")}
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

const createStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
    bottomNav: {
        position: "absolute",
        width: "100%",
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
        overflow: "hidden",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: isDark ? "#243149" : "rgba(0,0,0,0.1)",
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.82)",
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
        fontWeight: "600",
        color: colors.textSecondary,
    },
    navTextActive: {
        color: colors.primary,
    },
    centerButtonWrapper: {
        position: "absolute",
        alignSelf: "center",
        zIndex: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    centerButtonGradient: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#3b82f6",
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 10,
    },
    centerButton: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: isDark ? "#243149" : "rgba(0,0,0,0.1)",
    },
    centerButtonImage: {
        width: 40,
        height: 40,
    },
});