import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DrawingCanvasProps, Tool, PathData } from '@/src/types/WritingProps';

export interface DrawingCanvasRef {
    clearCanvas: () => void;
    undo: () => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
    ({ color, strokeWidth, tool, isDrawingMode }, ref) => {
        const [paths, setPaths] = useState<PathData[]>([]);
        const [currentPath, setCurrentPath] = useState<string>('');
        const currentPathRef = useRef<string>('');

        // Usa ref per tenere traccia dei valori correnti - questi vengono letti nel PanResponder
        const currentColor = useRef<string>(color);
        const currentStrokeWidth = useRef<number>(strokeWidth);
        const currentTool = useRef<Tool>(tool);

        // Aggiorna sempre i ref con i valori più recenti
        React.useEffect(() => {
            currentColor.current = color;
        }, [color]);

        React.useEffect(() => {
            currentStrokeWidth.current = strokeWidth;
        }, [strokeWidth]);

        React.useEffect(() => {
            currentTool.current = tool;
        }, [tool]);

        // PanResponder gestisce i touch events
        const panResponder = useRef(
            PanResponder.create({
                // Determina se il responder dovrebbe attivarsi al tocco iniziale
                onStartShouldSetPanResponder: () => isDrawingMode,
                // Determina se il responder dovrebbe attivarsi durante il movimento
                onMoveShouldSetPanResponder: () => isDrawingMode,

                // Quando l'utente tocca lo schermo (inizio del disegno)
                onPanResponderGrant: (evt: GestureResponderEvent) => {
                    if (!isDrawingMode) return;
                    const { locationX, locationY } = evt.nativeEvent;
                    // M = Move to - comando SVG per muovere il "pennello" senza disegnare
                    currentPathRef.current = `M ${locationX} ${locationY}`;
                    setCurrentPath(currentPathRef.current);
                },

                // Mentre l'utente muove il dito (disegno in corso)
                onPanResponderMove: (evt: GestureResponderEvent) => {
                    if (!isDrawingMode) return;
                    const { locationX, locationY } = evt.nativeEvent;
                    // L = Line to - comando SVG per disegnare una linea
                    currentPathRef.current += ` L ${locationX} ${locationY}`;
                    setCurrentPath(currentPathRef.current);
                },

                // Quando l'utente solleva il dito (fine del disegno)
                onPanResponderRelease: () => {
                    if (!isDrawingMode || !currentPathRef.current) return;
                    // Salva il path completato nell'array dei paths
                    // Usa i ref per avere i valori correnti
                    const newPath: PathData = {
                        path: currentPathRef.current,
                        color: currentColor.current,
                        strokeWidth: currentStrokeWidth.current,
                        tool: currentTool.current,
                    };
                    setPaths((prevPaths) => [...prevPaths, newPath]);
                    // Reset del path corrente
                    currentPathRef.current = '';
                    setCurrentPath('');
                },
            })
        ).current;

        // Espone funzioni al componente parent tramite ref
        useImperativeHandle(ref, () => ({
            clearCanvas: () => {
                setPaths([]);
                setCurrentPath('');
                currentPathRef.current = '';
            },
            undo: () => {
                if (paths.length > 0) {
                    setPaths(paths.slice(0, -1));
                }
            },
        }));

        return (
            <View style={styles.canvasContainer} {...panResponder.panHandlers}>
                <Svg style={styles.canvas}>
                    {/* Renderizza tutti i paths completati */}
                    {paths.map((item, index) => (
                        <Path
                            key={index}
                            d={item.path} // Il path SVG (M x y L x y L x y...)
                            stroke={item.tool === 'eraser' ? '#0f172a' : item.color}
                            strokeWidth={
                                item.tool === 'eraser'
                                    ? item.strokeWidth * 3
                                    : item.strokeWidth
                            }
                            fill="none"
                            strokeLinecap="round" // Bordi arrotondati
                            strokeLinejoin="round" // Giunzioni arrotondate
                        />
                    ))}
                    {/* Renderizza il path corrente (quello che stai disegnando ora) */}
                    {currentPath && (
                        <Path
                            d={currentPath}
                            stroke={tool === 'eraser' ? '#0f172a' : color}
                            strokeWidth={tool === 'eraser' ? strokeWidth * 3 : strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                </Svg>
            </View>
        );
    }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;

const styles = StyleSheet.create({
    canvasContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    canvas: {
        flex: 1,
    },
});