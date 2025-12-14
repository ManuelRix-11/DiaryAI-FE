export type Tool = 'pen' | 'marker' | 'eraser';

export interface PathData {
    path: string;
    color: string;
    strokeWidth: number;
    tool: Tool;
}

export interface DrawingCanvasProps {
    color: string;
    strokeWidth: number;
    tool: Tool;
    isDrawingMode: boolean;
    onUndo?: () => void;
    onClear?: () => void;
}

export interface DrawingToolbarProps {
    visible: boolean;
    onClose: () => void;
    selectedTool: Tool;
    onToolChange: (tool: Tool) => void;
    selectedColor: string;
    onColorChange: (color: string) => void;
    selectedStrokeWidth: number;
    onStrokeWidthChange: (width: number) => void;
    onUndo: () => void;
    onClear: () => void;
}

export interface ToolConfig {
    id: Tool;
    icon: string;
    label: string;
}