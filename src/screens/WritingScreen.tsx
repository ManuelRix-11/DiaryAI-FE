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
    ScrollView,
    Image,
    NativeSyntheticEvent,
    TextInputSelectionChangeEventData,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import DrawingCanvas, { DrawingCanvasRef } from '../components/DrawingCanvas';
import DrawingToolbar from '../components/DrawingToolbar';
import { Tool } from '@/src/types/WritingProps';
import { diariesApi } from '@/src/api/diaries';
import { useThemeStyles, ThemeColors } from '../theme/ThemeContext';

type BlockType = 'text' | 'image' | 'file';

interface ContentBlock {
    id: string;
    type: BlockType;
    content?: string;
    uri?: string;
    name?: string;
    height?: number;
}

type Mode = 'text' | 'draw';

interface WritingScreenProps {
    navigation?: any;
    route?: any;
}

export default function WritingScreen({ navigation, route }: WritingScreenProps) {
    const title = route?.params?.title || 'New Entry';
    const insets = useSafeAreaInsets();
    const styles = useThemeStyles(createStyles);
    const [mode, setMode] = useState<Mode>('text');
    const [showToolbar, setShowToolbar] = useState<boolean>(false);

    const [selectedTool, setSelectedTool] = useState<Tool>('pen');
    const [selectedColor, setSelectedColor] = useState<string>('#000000');
    const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(4);

    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: Date.now().toString(), type: 'text', content: '' },
    ]);

    const [activeBlockId, setActiveBlockId] = useState<string | null>(blocks[0].id);
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    const canvasRef = useRef<DrawingCanvasRef>(null);
    const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

    const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const updateTextBlock = (id: string, text: string) => {
        setBlocks(prev => prev.map(block => (
            block.id === id ? { ...block, content: text } : block
        )));
    };

    const handleSelectionChange = (
        id: string,
        event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
    ) => {
        setActiveBlockId(id);
        setCursorPosition(event.nativeEvent.selection.start);
    };

    const focusBlock = (id: string) => {
        const inputRef = inputRefs.current[id];
        if (inputRef) inputRef.focus();
    };

    const insertAtCursor = (newBlock: ContentBlock) => {
        const nextTextBlockId = generateId();

        setBlocks(currentBlocks => {
            const index = currentBlocks.findIndex(b => b.id === activeBlockId);

            const nextEmptyBlock: ContentBlock = {
                id: nextTextBlockId,
                type: 'text',
                content: '',
            };

            if (index === -1) {
                const newArr = [...currentBlocks, newBlock, nextEmptyBlock];
                setTimeout(() => focusBlock(nextTextBlockId), 100);
                return newArr;
            }

            const activeBlock = currentBlocks[index];

            if (activeBlock.type !== 'text') {
                const newArr = [...currentBlocks];
                newArr.splice(index + 1, 0, newBlock);
                newArr.splice(index + 2, 0, nextEmptyBlock);
                setTimeout(() => focusBlock(nextTextBlockId), 100);
                return newArr;
            }

            const textContent = activeBlock.content || '';
            const textBefore = textContent.slice(0, cursorPosition);
            const textAfter = textContent.slice(cursorPosition);

            const blockBefore: ContentBlock = {
                ...activeBlock,
                content: textBefore,
            };

            const blockAfter: ContentBlock = {
                id: nextTextBlockId,
                type: 'text',
                content: textAfter,
            };

            const newArr = [...currentBlocks];
            newArr.splice(index, 1, blockBefore, newBlock, blockAfter);
            setTimeout(() => focusBlock(nextTextBlockId), 100);

            return newArr;
        });
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const asset = result.assets[0];
            insertAtCursor({
                id: generateId(),
                type: 'image',
                uri: asset.uri,
                height: asset.height,
            });
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
            if (!result.canceled && result.assets) {
                const asset = result.assets[0];
                insertAtCursor({
                    id: generateId(),
                    type: 'file',
                    uri: asset.uri,
                    name: asset.name,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const removeBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const toggleMode = () => {
        setMode(prev => (prev === 'text' ? 'draw' : 'text'));
        setShowToolbar(prev => !prev);
    };

    const handleSave = async () => {
        const diaryId = route?.params?.id;
        const userId = route?.params?.userId;
        const passedTitle = title; // using local const derived from route?.params?.title

        const contentText = blocks
            .filter(b => b.type === 'text')
            .map(b => b.content || '')
            .join('\n\n')
            .trim();

        try {
            if (diaryId) {
                await diariesApi.update(diaryId, { text: contentText });
            } else if (userId) {
                const response = await diariesApi.create({
                    title: passedTitle,
                    user_id: userId
                });
                const newDiaryId = response?.id;
                if (!newDiaryId) {
                    throw new Error("Manca l'ID del diario dopo la creazione.");
                }
                await diariesApi.update(newDiaryId, { text: contentText });
            } else {
                Alert.alert("Errore", "Impossibile salvare: dati mancanti (ID o user_id).");
                return;
            }

            Alert.alert('Salvato', 'Il diario è stato salvato con successo!');
            navigation?.goBack();
        } catch (error) {
            console.error('Error saving diary:', error);
            Alert.alert('Errore', 'Si è verificato un errore durante il salvataggio.');
        }
    };

    const handleClose = () => navigation?.goBack();
    const handleUndo = () => canvasRef.current?.undo();
    const handleClear = () => canvasRef.current?.clearCanvas();

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
                        <Ionicons name="close" size={26} color={styles.headerTitle.color} />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
                    </View>

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <LinearGradient colors={['#5B3CE6', '#F56C5B', '#E63C5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradient}>
                            <Text style={styles.saveText}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {mode === 'text' ? (
                        <ScrollView
                            style={styles.scrollContainer}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {blocks.map((block, index) => {
                                if (block.type === 'text') {
                                    return (
                                        <TextInput
                                            key={block.id}
                                            ref={(el) => { inputRefs.current[block.id] = el; }}
                                            style={styles.textInputBlock}
                                            multiline
                                            scrollEnabled={false}
                                            placeholder={index === 0 && blocks.length === 1 ? 'Start writing...' : ''}
                                            placeholderTextColor={styles.headerDate.color as string}
                                            value={block.content}
                                            onChangeText={(txt) => updateTextBlock(block.id, txt)}
                                            onSelectionChange={(e) => handleSelectionChange(block.id, e)}
                                            onFocus={() => setActiveBlockId(block.id)}
                                        />
                                    );
                                } else if (block.type === 'image') {
                                    return (
                                        <View key={block.id} style={styles.blockWrapper}>
                                            <Image source={{ uri: block.uri }} style={styles.imageBlock} resizeMode="cover" />
                                            <TouchableOpacity style={styles.deleteBlockButton} onPress={() => removeBlock(block.id)}>
                                                <Ionicons name="close" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                } else if (block.type === 'file') {
                                    return (
                                        <View key={block.id} style={styles.blockWrapper}>
                                            <View style={styles.fileBlock}>
                                                <Ionicons name="document-text" size={24} color={styles.headerDate.color} />
                                                <Text style={styles.fileName}>{block.name}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.deleteBlockButton} onPress={() => removeBlock(block.id)}>
                                                <Ionicons name="close" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }

                                return null;
                            })}

                            <TouchableOpacity
                                style={{ height: 100 }}
                                onPress={() => {
                                    const lastBlock = blocks[blocks.length - 1];
                                    if (lastBlock.type !== 'text') {
                                        const newId = generateId();
                                        setBlocks([...blocks, { id: newId, type: 'text', content: '' }]);
                                        setTimeout(() => focusBlock(newId), 100);
                                    } else {
                                        focusBlock(lastBlock.id);
                                    }
                                }}
                            />
                        </ScrollView>
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

                <View style={[styles.bottomToolbar, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity style={styles.toolbarButton} onPress={toggleMode}>
                        <Ionicons
                            name={mode === 'text' ? 'brush-outline' : 'text-outline'}
                            size={24}
                            color={styles.headerTitle.color}
                        />
                        <Text style={styles.toolbarButtonText}>{mode === 'text' ? 'Draw' : 'Type'}</Text>
                    </TouchableOpacity>

                    {mode === 'draw' && (
                        <TouchableOpacity style={styles.toolbarButton} onPress={() => setShowToolbar(!showToolbar)}>
                            <Ionicons name="construct-outline" size={24} color={styles.headerTitle.color} />
                            <Text style={styles.toolbarButtonText}>Tools</Text>
                        </TouchableOpacity>
                    )}

                    {mode === 'text' && (
                        <>
                            <TouchableOpacity style={styles.toolbarButton} onPress={handlePickImage}>
                                <Ionicons name="image-outline" size={24} color={styles.headerTitle.color} />
                                <Text style={styles.toolbarButtonText}>Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.toolbarButton} onPress={handlePickDocument}>
                                <Ionicons name="attach-outline" size={24} color={styles.headerTitle.color} />
                                <Text style={styles.toolbarButtonText}>Attach</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    keyboardView: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 14,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerButton: { padding: 8 },
    headerCenter: { alignItems: 'center' },
    headerTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    headerDate: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
    saveButton: { borderRadius: 18, overflow: 'hidden' },
    saveGradient: { paddingVertical: 7, paddingHorizontal: 16 },
    saveText: { color: 'white', fontWeight: '700', fontSize: 14 },
    content: { flex: 1 },
    scrollContainer: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 110 },
    textInputBlock: {
        color: colors.text,
        fontSize: 16,
        lineHeight: 24,
        paddingVertical: 6,
        textAlignVertical: 'top',
    },
    blockWrapper: { marginVertical: 10, position: 'relative' },
    imageBlock: { width: '100%', height: 250, borderRadius: 16, backgroundColor: colors.surfaceAlt },
    fileBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    fileName: { color: colors.text, marginLeft: 12, fontSize: 14, fontWeight: '600' },
    deleteBlockButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
    bottomToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    toolbarButton: { alignItems: 'center', justifyContent: 'center' },
    toolbarButtonText: { color: colors.textSecondary, fontSize: 10, marginTop: 4, fontWeight: '600' },
});