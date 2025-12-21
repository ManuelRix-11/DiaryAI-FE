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
    TextInputKeyPressEventData // Importante per gestire cancellazioni future
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import DrawingCanvas, { DrawingCanvasRef } from '../components/DrawingCanvas';
import DrawingToolbar from '../components/DrawingToolbar';
import { Tool } from '@/src/types/WritingProps';

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
}

export default function WritingScreen({ navigation }: WritingScreenProps) {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<Mode>('text');
    const [showToolbar, setShowToolbar] = useState<boolean>(false);

    // Disegno
    const [selectedTool, setSelectedTool] = useState<Tool>('pen');
    const [selectedColor, setSelectedColor] = useState<string>('#000000');
    const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(4);

    // --- BLOCCHI ---
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: Date.now().toString(), type: 'text', content: '' }
    ]);

    const [activeBlockId, setActiveBlockId] = useState<string | null>(blocks[0].id);
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    // --- REFS ---
    const canvasRef = useRef<DrawingCanvasRef>(null);
    // Questo oggetto terrà i riferimenti a tutti i TextInput: { "id_blocco": RefDelComponente }
    const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

    const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const updateTextBlock = (id: string, text: string) => {
        setBlocks(prev => prev.map(block =>
            block.id === id ? { ...block, content: text } : block
        ));
    };

    const handleSelectionChange = (id: string, event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        setActiveBlockId(id);
        setCursorPosition(event.nativeEvent.selection.start);
    };

    // --- LOGICA DI INSERIMENTO E FOCUS AUTOMATICO ---
    const insertAtCursor = (newBlock: ContentBlock) => {
        const nextTextBlockId = generateId();

        setBlocks(currentBlocks => {
            const index = currentBlocks.findIndex(b => b.id === activeBlockId);

            // Definiamo il blocco vuoto esplicitamente come ContentBlock
            // Questo risolve l'errore TS2345
            const nextEmptyBlock: ContentBlock = {
                id: nextTextBlockId,
                type: 'text',
                content: ''
            };

            // 1. Fallback: se non trovo il blocco attivo, aggiungo in fondo
            if (index === -1) {
                const newArr = [...currentBlocks, newBlock, nextEmptyBlock];
                setTimeout(() => focusBlock(nextTextBlockId), 100);
                return newArr;
            }

            const activeBlock = currentBlocks[index];

            // 2. Se il blocco attivo non è testo (es. ho selezionato un'immagine), aggiungi dopo
            if (activeBlock.type !== 'text') {
                const newArr = [...currentBlocks];
                // Inseriamo il blocco media
                newArr.splice(index + 1, 0, newBlock);
                // Inseriamo il blocco di testo vuoto subito dopo
                newArr.splice(index + 2, 0, nextEmptyBlock);

                setTimeout(() => focusBlock(nextTextBlockId), 100);
                return newArr;
            }

            // 3. Spezza il testo
            const textContent = activeBlock.content || '';
            const textBefore = textContent.slice(0, cursorPosition);
            const textAfter = textContent.slice(cursorPosition);

            // Forziamo il tipo ContentBlock qui
            const blockBefore: ContentBlock = {
                ...activeBlock,
                content: textBefore
            };

            const blockAfter: ContentBlock = {
                id: nextTextBlockId,
                type: 'text',
                content: textAfter
            };

            const newArr = [...currentBlocks];
            // Sostituisci il blocco corrente con: [Parte Prima] -> [Media] -> [Parte Dopo]
            newArr.splice(index, 1, blockBefore, newBlock, blockAfter);

            setTimeout(() => focusBlock(nextTextBlockId), 100);

            return newArr;
        });
    };

    // Funzione helper per mettere il focus su un blocco specifico
    const focusBlock = (id: string) => {
        const inputRef = inputRefs.current[id];
        if (inputRef) {
            // focus() apre la tastiera e sposta il cursore lì
            inputRef.focus();
        }
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
            const newImageBlock: ContentBlock = {
                id: generateId(),
                type: 'image',
                uri: asset.uri,
                height: asset.height
            };
            insertAtCursor(newImageBlock);
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
            if (!result.canceled && result.assets) {
                const asset = result.assets[0];
                const newDocBlock: ContentBlock = {
                    id: generateId(),
                    type: 'file',
                    uri: asset.uri,
                    name: asset.name
                };
                insertAtCursor(newDocBlock);
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

    const handleSave = () => {
        console.log("Saving Blocks:", blocks);
        Alert.alert('Save', 'Entry saved successfully!');
        navigation?.goBack();
    };

    const handleClose = () => navigation?.goBack();
    const handleUndo = () => canvasRef.current?.undo();
    const handleClear = () => canvasRef.current?.clearCanvas();

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
                        <Ionicons name="close" size={28} color="#e2e8f0" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>New Entry</Text>
                        <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <LinearGradient colors={['#5B3CE6', '#E63C5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradient}>
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

                                            // --- CORREZIONE QUI ---
                                            // Aggiungi le parentesi graffe { } per non ritornare nulla
                                            ref={(el) => { inputRefs.current[block.id] = el; }}

                                            style={styles.textInputBlock}
                                            multiline
                                            scrollEnabled={false}
                                            placeholder={index === 0 && blocks.length === 1 ? "Start writing..." : ""}
                                            placeholderTextColor="#475569"
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
                                                <Ionicons name="document-text" size={24} color="#94a3b8" />
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
                                        // Se clicco in basso e l'ultimo è testo, focussa quello
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

                {/* Toolbar Draw */}
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
                        <Ionicons name={mode === 'text' ? 'brush-outline' : 'text-outline'} size={24} color="#e2e8f0" />
                        <Text style={styles.toolbarButtonText}>{mode === 'text' ? 'Draw' : 'Type'}</Text>
                    </TouchableOpacity>

                    {mode === 'draw' && (
                        <TouchableOpacity style={styles.toolbarButton} onPress={() => setShowToolbar(!showToolbar)}>
                            <Ionicons name="construct-outline" size={24} color="#5B3CE6" />
                            <Text style={[styles.toolbarButtonText, { color: '#5B3CE6' }]}>Tools</Text>
                        </TouchableOpacity>
                    )}

                    {mode === 'text' && (
                        <>
                            <TouchableOpacity style={styles.toolbarButton} onPress={handlePickImage}>
                                <Ionicons name="image-outline" size={24} color="#e2e8f0" />
                                <Text style={styles.toolbarButtonText}>Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.toolbarButton} onPress={handlePickDocument}>
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
    container: { flex: 1, backgroundColor: '#0f172a' },
    keyboardView: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#0f172a', zIndex: 10 },
    headerButton: { padding: 8 },
    headerCenter: { alignItems: 'center' },
    headerTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
    headerDate: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
    saveButton: { borderRadius: 20, overflow: 'hidden' },
    saveGradient: { paddingVertical: 6, paddingHorizontal: 16 },
    saveText: { color: 'white', fontWeight: '600', fontSize: 14 },
    content: { flex: 1 },
    scrollContainer: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    textInputBlock: { color: '#f8fafc', fontSize: 16, lineHeight: 24, paddingVertical: 4, textAlignVertical: 'top' },
    blockWrapper: { marginVertical: 10, position: 'relative' },
    imageBlock: { width: '100%', height: 250, borderRadius: 12, backgroundColor: '#1e293b' },
    fileBlock: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
    fileName: { color: '#f8fafc', marginLeft: 12, fontSize: 14, fontWeight: '500' },
    deleteBlockButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 },
    bottomToolbar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 12, backgroundColor: '#1e293b', borderTopWidth: 1, borderTopColor: '#334155' },
    toolbarButton: { alignItems: 'center', justifyContent: 'center' },
    toolbarButtonText: { color: '#94a3b8', fontSize: 10, marginTop: 4 },
});