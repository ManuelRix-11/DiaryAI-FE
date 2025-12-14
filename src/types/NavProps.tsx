import {ReactElement} from "react";

export interface NavItemProps {
    label: string;
    icon: ReactElement;
    onPress: () => void;
}