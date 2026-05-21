import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeStyles, ThemeColors, useTheme } from '../theme/ThemeContext';
import { DrawingCanvasProps, Tool, PathData } from '@/src/types/WritingProps';

export interface DrawingCanvasRef {
    clearCanvas: () => void;
    undo: () => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
    ({ color, strokeWidth, tool, isDrawingMode }, ref) => {
        const styles = useThemeStyles(createStyles);
        const { colors } = useTheme();
        const [paths, setPaths] = useState<PathData[]>([]);
        const [currentPath, setCurrentPath] = useState<string>('');
        const currentPathRef = useRef<string>('');

        const currentColor = useRef<string>(color);
        const currentStrokeWidth = useRef<number>(strokeWidth);
        const currentTool = useRef<Tool>(tool);

        React.useEffect(() => {
            currentColor.current = color;
        }, [color]);

        React.useEffect(() => {
            currentStrokeWidth.current = strokeWidth;
        }, [strokeWidth]);

        React.useEffect(() => {
            currentTool.current = tool;
        }, [tool]);

        const panResponder = useRef(
            PanResponder.create({
                onStartShouldSetPanResponder: () => isDrawingMode,
                onMoveShouldSetPanResponder: () => isDrawingMode,

                onPanResponderGrant: (evt: GestureResponderEvent) => {
                    if (!isDrawingMode) return;
                    const { locationX, locationY } = evt.nativeEvent;
                    currentPathRef.current = `M ${locationX} ${locationY}`;
                    setCurrentPath(currentPathRef.current);
                },

                onPanResponderMove: (evt: GestureResponderEvent) => {
                    if (!isDrawingMode) return;
                    const { locationX, locationY } = evt.nativeEvent;
                    currentPathRef.current += ` L ${locationX} ${locationY}`;
                    setCurrentPath(currentPathRef.current);
                },

                onPanResponderRelease: () => {
                    if (!isDrawingMode || !currentPathRef.current) return;

                    const newPath: PathData = {
                        path: currentPathRef.current,
                        color: currentColor.current,
                        strokeWidth: currentStrokeWidth.current,
                        tool: currentTool.current,
                    };

                    setPaths((prevPaths) => [...prevPaths, newPath]);
                    currentPathRef.current = '';
                    setCurrentPath('');
                },
            })
        ).current;

        useImperativeHandle(ref, () => ({
            clearCanvas: () => {
                setPaths([]);
                setCurrentPath('');
                currentPathRef.current = '';
            },
            undo: () => {
                setPaths((prev) => prev.slice(0, -1));
            },
        }));

        return (
            <View style={styles.canvasContainer} {...panResponder.panHandlers}>
                <Svg style={styles.canvas}>
                    {paths.map((item, index) => (
                        <Path
                            key={index}
                            d={item.path}
                            stroke={item.tool === 'eraser' ? colors.background : item.color}
                            strokeWidth={item.tool === 'eraser' ? item.strokeWidth * 3 : item.strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}

                    {currentPath && (
                        <Path
                            d={currentPath}
                            stroke={tool === 'eraser' ? colors.background : color}
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    canvasContainer: {
        flex: 1,
        backgroundColor: colors.background,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    canvas: {
        flex: 1,
    },
});