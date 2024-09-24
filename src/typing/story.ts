export type IStory = {
	title: string;
	content: string;
	storyId: string;
	audioUrl: string;
};

export type IHistory = {
	userId: string;
	storyId: string;
	title: string;
};