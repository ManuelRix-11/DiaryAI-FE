import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
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
        '#000000', // Black
        '#E63C5B', // Red
        '#5B3CE6', // Purple
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Orange
        '#ec4899', // Pink
        '#ffffff', // White
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
                colors={['#1e293b', '#0f172a']}
                style={styles.toolbarGradient}
            >
                {/* Header */}
                <View style={styles.toolbarHeader}>
                    <Text style={styles.toolbarTitle}>Drawing Tools</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Tools */}
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
                            >
                                <Ionicons
                                    name={tool.icon as any}
                                    size={24}
                                    color={selectedTool === tool.id ? '#5B3CE6' : '#94a3b8'}
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

                {/* Colors */}
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

                {/* Stroke Width */}
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
                            >
                                <View
                                    style={[
                                        styles.strokePreview,
                                        {
                                            width: width * 2,
                                            height: width * 2,
                                            backgroundColor:
                                                selectedStrokeWidth === width ? '#5B3CE6' : '#94a3b8',
                                        },
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={onUndo}>
                        <Ionicons name="arrow-undo" size={20} color="#94a3b8" />
                        <Text style={styles.actionText}>Undo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={onClear}>
                        <Ionicons name="trash-outline" size={20} color="#E63C5B" />
                        <Text style={[styles.actionText, { color: '#E63C5B' }]}>
                            Clear All
                        </Text>
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
        left: 20,
        right: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334155',
    },
    toolbarGradient: {
        padding: 20,
    },
    toolbarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    toolbarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#e2e8f0',
    },
    closeButton: {
        padding: 4,
    },
    toolsSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
        borderColor: '#334155',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        gap: 8,
    },
    toolButtonActive: {
        backgroundColor: 'rgba(91, 60, 230, 0.1)',
        borderColor: '#5B3CE6',
    },
    toolLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    toolLabelActive: {
        color: '#5B3CE6',
    },
    colorsSection: {
        marginBottom: 20,
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
        marginBottom: 20,
    },
    strokeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    strokeButton: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    strokeButtonActive: {
        backgroundColor: 'rgba(91, 60, 230, 0.1)',
        borderColor: '#5B3CE6',
    },
    strokePreview: {
        borderRadius: 50,
    },
    actionsSection: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94a3b8',
    },
});