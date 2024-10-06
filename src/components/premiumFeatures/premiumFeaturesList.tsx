import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '../ThemedText';
import VoiceLibrary from './voiceLibrary/VoiceLibrary';
import Svg, { Path } from 'react-native-svg';

interface PremiumFeaturesListProps {
	isExpanded: boolean;
	toggleExpand: () => void;
	isDarkMode: boolean;
}

const PremiumFeaturesList: React.FC<PremiumFeaturesListProps> = ({ isExpanded, toggleExpand, isDarkMode }) => {
	const [isVoiceLibVisible, setVoiceLibVisible] = useState(false);
	const rotation = isExpanded ? '180deg' : '0deg';

	const styles = createStyles(isDarkMode);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.header} onPress={toggleExpand}>
				<ThemedText type="default" style={styles.title}>Премиум функции</ThemedText>
				<Animated.View style={{ transform: [{ rotate: rotation }] }}>
					<Svg width="20" height="20" viewBox="0 0 256 256">
						<Path fill={isDarkMode ? '#ffffff' : '#000000'} d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z" />
					</Svg>
				</Animated.View>
			</TouchableOpacity>
			{isExpanded && (
				<View style={styles.content}>
					<TouchableOpacity onPress={() => setVoiceLibVisible(true)} style={styles.subItem}>
						<ThemedText type="default" style={styles.subItemText}>Библиотека голосов</ThemedText>
					</TouchableOpacity>
				</View>
			)}
			<VoiceLibrary isDarkMode={isDarkMode} isVisible={isVoiceLibVisible} onClose={() => setVoiceLibVisible(false)} />
		</View>
	);
};

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
	container: {
		marginBottom: 15,
		backgroundColor: isDarkMode ? '#222222' : '#fafafa',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: isDarkMode ? '#333333' : '#dddddd',
	},
	content: {
		padding: 16,
	},
	header: {
		padding: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
	},
	title: {
		color: isDarkMode ? '#ffffff' : '#333333',
	},
	subItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: isDarkMode ? '#333333' : '#DDDDDD',
	},
	subItemText: {
		color: isDarkMode ? '#ffffff' : '#333333',
	},
});

export default PremiumFeaturesList;