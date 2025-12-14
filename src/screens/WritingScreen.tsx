import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DrawingCanvas, { DrawingCanvasRef } from '../components/DrawingCanvas';
import DrawingToolbar from '../components/DrawingToolbar';
import { Tool } from '@/src/types/WritingProps';

type Mode = 'text' | 'draw';

interface WritingScreenProps {
    navigation?: any; // Puoi tipizzare meglio con il tipo di navigazione che usi
}

export default function WritingScreen({ navigation }: WritingScreenProps) {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<Mode>('text');
    const [text, setText] = useState<string>('');
    const [showToolbar, setShowToolbar] = useState<boolean>(false);
    const [selectedTool, setSelectedTool] = useState<Tool>('pen');
    const [selectedColor, setSelectedColor] = useState<string>('#000000');
    const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(4);
    const canvasRef = useRef<DrawingCanvasRef>(null);

    const toggleMode = (): void => {
        if (mode === 'text') {
            setMode('draw');
            setShowToolbar(true);
        } else {
            setMode('text');
            setShowToolbar(false);
        }
    };

    const handleSave = (): void => {
        Alert.alert('Save', 'Entry saved successfully!');
        // Qui salveresti i dati
        navigation?.goBack();
    };

    const handleClose = (): void => {
        Alert.alert(
            'Discard Changes?',
            'Are you sure you want to discard your changes?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => navigation?.goBack()
                },
            ]
        );
    };

    const handleUndo = (): void => {
        canvasRef.current?.undo();
    };

    const handleClear = (): void => {
        Alert.alert(
            'Clear Canvas',
            'Are you sure you want to clear the canvas?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => canvasRef.current?.clearCanvas()
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
                        <Ionicons name="close" size={28} color="#e2e8f0" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>New Entry</Text>
                        <Text style={styles.headerDate}>
                            {new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <LinearGradient
                            colors={['#5B3CE6', '#E63C5B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveGradient}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <View style={styles.content}>
                    {mode === 'text' ? (
                        <TextInput
                            style={styles.textInput}
                            placeholder="Start writing..."
                            placeholderTextColor="#475569"
                            value={text}
                            onChangeText={setText}
                            multiline
                            autoFocus
                            textAlignVertical="top"
                        />
                    ) : (
                        <DrawingCanvas
                            ref={canvasRef}
                            color={selectedColor}
                            strokeWidth={selectedStrokeWidth}
                            tool={selectedTool}
                            isDrawingMode={true}
                        />
                    )}
                </View>

                {/* Drawing Toolbar */}
                {mode === 'draw' && (
                    <DrawingToolbar
                        visible={showToolbar}
                        onClose={() => setShowToolbar(false)}
                        selectedTool={selectedTool}
                        onToolChange={setSelectedTool}
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                        selectedStrokeWidth={selectedStrokeWidth}
                        onStrokeWidthChange={setSelectedStrokeWidth}
                        onUndo={handleUndo}
                        onClear={handleClear}
                    />
                )}

                {/* Bottom Toolbar */}
                <View style={[styles.bottomToolbar, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity style={styles.toolbarButton} onPress={toggleMode}>
                        <Ionicons
                            name={mode === 'text' ? 'brush-outline' : 'text-outline'}
                            size={24}
                            color="#e2e8f0"
                        />
                        <Text style={styles.toolbarButtonText}>
                            {mode === 'text' ? 'Draw' : 'Type'}
                        </Text>
                    </TouchableOpacity>

                    {mode === 'draw' && (
                        <TouchableOpacity
                            style={styles.toolbarButton}
                            onPress={() => setShowToolbar(!showToolbar)}
                        >
                            <Ionicons
                                name="construct-outline"
                                size={24}
                                color="#5B3CE6"
                            />
                            <Text style={[styles.toolbarButtonText, { color: '#5B3CE6' }]}>
                                Tools
                            </Text>
                        </TouchableOpacity>
                    )}

                    {mode === 'text' && (
                        <>
                            <TouchableOpacity style={styles.toolbarButton}>
                                <Ionicons name="image-outline" size={24} color="#e2e8f0" />
                                <Text style={styles.toolbarButtonText}>Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.toolbarButton}>
                                <Ionicons name="attach-outline" size={24} color="#e2e8f0" />
                                <Text style={styles.toolbarButtonText}>Attach</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    headerButton: {
        padding: 4,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#e2e8f0',
    },
    headerDate: {
        fontSize: 13,
        color: '#94a3b8',
        marginTop: 2,
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    saveGradient: {
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#e2e8f0',
        lineHeight: 24,
    },
    bottomToolbar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        gap: 16,
    },
    toolbarButton: {
        alignItems: 'center',
        gap: 4,
    },
    toolbarButtonText: {
        fontSize: 12,
        color: '#e2e8f0',
        fontWeight: '600',
    },
});