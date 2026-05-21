import React from 'react';

export interface HomeActionCardProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}