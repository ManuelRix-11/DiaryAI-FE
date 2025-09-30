import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Pressable,
    StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/src/components/_navbar";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState("Journals");
    const [activeFilter, setActiveFilter] = useState("All");

    const routines = [
        { title: "Gratitude Journal", description: "Cultivate gratitude with daily practice", frequency: "Daily", icon: "✨" },
        { title: "Lucid Dream Log", description: "Unlock dream insights and meaning", frequency: "Weekly", icon: "🌙" },
        { title: "Relationship Check", description: "Strengthen bonds with your loved ones", frequency: "Monthly", icon: "👫" },
        { title: "Embrace and Commit", description: "Embrace change and commit fully", frequency: "Yearly", icon: "❤️" },
        { title: "Positive Psychology", description: "Develop positive mindset & foster optimism", frequency: "Daily", icon: "🌸" },
    ];

    const filters = ["All", "Daily", "Weekly", "Monthly", "Yearly"];

    const visibleRoutines = routines.filter((r) => activeFilter === "All" || r.frequency === activeFilter);

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top || 12 }]}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Explore</Text>
                <TouchableOpacity onPress={() => alert("Create pressed")}>
                    <LinearGradient
                        colors={["#00d4ff", "#8a2be2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.createButton}
                    >
                        <Text style={styles.createButtonText}>+ Create</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabBarContainer}>
                <LinearGradient
                    colors={activeTab === "Journals" ? ["#00d4ff", "#8a2be2"] : ["#1a1a1f", "#1a1a1f"]}
                    style={styles.tabItem}
                >
                    <Pressable onPress={() => setActiveTab("Journals")}>
                        <Text style={[styles.tabText, activeTab === "Journals" && styles.tabTextActive]}>Journals</Text>
                    </Pressable>
                </LinearGradient>
                <LinearGradient
                    colors={activeTab === "Prompts" ? ["#00d4ff", "#8a2be2"] : ["#1a1a1f", "#1a1a1f"]}
                    style={styles.tabItem}
                >
                    <Pressable onPress={() => setActiveTab("Prompts")}>
                        <Text style={[styles.tabText, activeTab === "Prompts" && styles.tabTextActive]}>Prompts</Text>
                    </Pressable>
                </LinearGradient>
            </View>

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
            >
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setActiveFilter(f)}
                        style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                    >
                        <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content */}
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 140 + (insets.bottom || 0) }]}>
                <Text style={styles.sectionTitle}>Routine</Text>

                {visibleRoutines.map((routine, idx) => (
                    <Pressable
                        key={`${routine.title}-${idx}`}
                        style={styles.card}
                        onPress={() => alert(`${routine.title} pressed`)}
                    >
                        <Text style={styles.cardIcon}>{routine.icon}</Text>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{routine.title}</Text>
                            <Text style={styles.cardDesc}>{routine.description}</Text>
                        </View>
                        <Text style={styles.cardFreq}>{routine.frequency}</Text>
                    </Pressable>
                ))}

                {visibleRoutines.length === 0 && (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>No routines for the selected filter.</Text>
                    </View>
                )}
            </ScrollView>
            <Navbar/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b0b0f",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "600",
    },
    createButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    tabBarContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 25,
        overflow: "hidden",
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    tabText: {
        color: "#888",
        fontWeight: "600",
    },
    tabTextActive: {
        color: "#fff",
    },
    filterScroll: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterChip: {
        marginRight: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#1a1a1f",
    },
    filterChipActive: {
        backgroundColor: "#2a2a30",
    },
    filterText: {
        color: "#fff",
    },
    filterTextActive: {
        color: "#fff",
        fontWeight: "700",
    },
    content: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: "#aaa",
        marginBottom: 8,
        marginTop: 6,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1f",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    cardIcon: {
        fontSize: 26,
        marginRight: 12,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cardDesc: {
        color: "#aaa",
        fontSize: 13,
        marginTop: 2,
    },
    cardFreq: {
        color: "#8a2be2",
        fontWeight: "600",
    },
    emptyBox: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        color: "#666",
    },
});