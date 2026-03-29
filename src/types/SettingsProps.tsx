export interface SettingItemProps {
    icon: string;
    title: string;
    description?: string;
    type?: 'navigation' | 'toggle' | 'value' | 'input';
    value?: string | boolean;
    onPress?: () => void;
    onToggle?: (value: boolean) => void;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
}