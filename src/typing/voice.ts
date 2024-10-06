export interface VoiceLibraryProps {
	isDarkMode: boolean;
	isVisible: boolean;
	onClose: () => void;
};

export interface ReadAloudSectionProps {
	isDarkMode: boolean;
	selectedRole: string | null;
	name: string;
	roles: Array<{ name: string; value: string }>;
};