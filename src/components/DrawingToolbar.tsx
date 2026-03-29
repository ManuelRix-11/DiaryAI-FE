import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DrawingToolbarProps, ToolConfig } from '@/src/types/WritingProps';

export default function DrawingToolbar({
                                           visible,
                                           onClose,
                                           selectedTool,
                                           onToolChange,
                                           selectedColor,
                                           onColorChange,
                                           selectedStrokeWidth,
                                           onStrokeWidthChange,
                                           onUndo,
                                           onClear,
                                       }: DrawingToolbarProps) {
    const colors: string[] = [
        '#000000',
        '#E63C5B',
        '#5B3CE6',
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ec4899',
        '#ffffff',
    ];

    const strokeWidths: number[] = [2, 4, 6, 8, 12];

    const tools: ToolConfig[] = [
        { id: 'pen', icon: 'create-outline', label: 'Pen' },
        { id: 'marker', icon: 'brush-outline', label: 'Marker' },
        { id: 'eraser', icon: 'remove-outline', label: 'Eraser' },
    ];

    if (!visible) return null;

    return (
        <View style={styles.toolbar}>
            <LinearGradient
                colors={['rgba(17, 28, 51, 0.98)', 'rgba(15, 23, 42, 0.98)']}
                style={styles.toolbarGradient}
            >
                <View style={styles.toolbarHeader}>
                    <View>
                        <Text style={styles.toolbarTitle}>Drawing Tools</Text>
                        <Text style={styles.toolbarSubtitle}>Customize brush, color and size</Text>
                    </View>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={22} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.toolsSection}>
                    <Text style={styles.sectionLabel}>Tool</Text>
                    <View style={styles.toolsRow}>
                        {tools.map((tool) => (
                            <TouchableOpacity
                                key={tool.id}
                                style={[
                                    styles.toolButton,
                                    selectedTool === tool.id && styles.toolButtonActive,
                                ]}
                                onPress={() => onToolChange(tool.id)}
                                activeOpacity={0.9}
                            >
                                <Ionicons
                                    name={tool.icon as any}
                                    size={24}
                                    color={selectedTool === tool.id ? '#c4b5fd' : '#94a3b8'}
                                />
                                <Text
                                    style={[
                                        styles.toolLabel,
                                        selectedTool === tool.id && styles.toolLabelActive,
                                    ]}
                                >
                                    {tool.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {selectedTool !== 'eraser' && (
                    <View style={styles.colorsSection}>
                        <Text style={styles.sectionLabel}>Color</Text>
                        <View style={styles.colorsRow}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorButton,
                                        { backgroundColor: color },
                                        color === '#ffffff' && styles.colorButtonWhite,
                                        selectedColor === color && styles.colorButtonActive,
                                    ]}
                                    onPress={() => onColorChange(color)}
                                    activeOpacity={0.9}
                                >
                                    {selectedColor === color && (
                                        <Ionicons
                                            name="checkmark"
                                            size={16}
                                            color={color === '#ffffff' ? '#000000' : '#ffffff'}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.strokeSection}>
                    <Text style={styles.sectionLabel}>
                        {selectedTool === 'eraser' ? 'Eraser Size' : 'Stroke Width'}
                    </Text>
                    <View style={styles.strokeRow}>
                        {strokeWidths.map((width) => (
                            <TouchableOpacity
                                key={width}
                                style={[
                                    styles.strokeButton,
                                    selectedStrokeWidth === width && styles.strokeButtonActive,
                                ]}
                                onPress={() => onStrokeWidthChange(width)}
                                activeOpacity={0.9}
                            >
                                <View
                                    style={[
                                        styles.strokePreview,
                                        {
                                            width: width * 2,
                                            height: width * 2,
                                            backgroundColor:
                                                selectedStrokeWidth === width ? '#c4b5fd' : '#94a3b8',
                                        },
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={onUndo} activeOpacity={0.9}>
                        <Ionicons name="arrow-undo" size={20} color="#94a3b8" />
                        <Text style={styles.actionText}>Undo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={onClear} activeOpacity={0.9}>
                        <Ionicons name="trash-outline" size={20} color="#E63C5B" />
                        <Text style={[styles.actionText, { color: '#E63C5B' }]}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        position: 'absolute',
        bottom: 100,
        left: 16,
        right: 16,
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#243149',
    },
    toolbarGradient: {
        padding: 18,
    },
    toolbarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    toolbarTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#e2e8f0',
        marginBottom: 2,
    },
    toolbarSubtitle: {
        fontSize: 12,
        color: '#94a3b8',
    },
    closeButton: {
        padding: 4,
    },
    toolsSection: {
        marginBottom: 18,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 12,
    },
    toolsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    toolButton: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#243149',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        gap: 8,
    },
    toolButtonActive: {
        backgroundColor: 'rgba(196, 181, 253, 0.08)',
        borderColor: '#5B3CE6',
    },
    toolLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '700',
    },
    toolLabelActive: {
        color: '#c4b5fd',
    },
    colorsSection: {
        marginBottom: 18,
    },
    colorsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorButtonWhite: {
        borderWidth: 1,
        borderColor: '#334155',
    },
    colorButtonActive: {
        borderWidth: 3,
        borderColor: '#5B3CE6',
    },
    strokeSection: {
        marginBottom: 18,
    },
    strokeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    strokeButton: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#243149',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    strokeButtonActive: {
        backgroundColor: 'rgba(196, 181, 253, 0.08)',
        borderColor: '#5B3CE6',
    },
    strokePreview: {
        borderRadius: 999,
    },
    actionsSection: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#243149',
        borderRadius: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
    },
});