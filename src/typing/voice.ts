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

export interface VoiceSampleAudio {
	uri: string;
	name: string;
	type: string;
};

export interface Voice {
	role: string;
	name: string;
	gender: string;
	age: string;
	voiceSampleAudio: VoiceSampleAudio;
};

export interface VoiceLibraryState {
	voices: Voice[];
};