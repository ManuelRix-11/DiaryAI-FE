export interface CardProps {
    title: string;
    description: string;
}

export interface FeaturesCardProps {
    title: string;
    description: string;
    buttonText: string;
    onPress: () => void;
}

export interface StatsCardProps {
    value: string;
    label: string;
}