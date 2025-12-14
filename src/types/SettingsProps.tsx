export interface SettingItemProps {
    icon: string;
    title: string;
    description?: string;
    type?: 'navigation' | 'toggle' | 'value';
    value?: string | boolean;
    onPress?: () => void;
    onToggle?: (value: boolean) => void;
}