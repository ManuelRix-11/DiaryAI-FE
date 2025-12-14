export interface ProfileHeaderProps {
    name: string;
    email: string;
    avatar: string | null;
    onEditPress: () => void;
}
