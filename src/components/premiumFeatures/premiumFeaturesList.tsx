import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
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

	const styles = getStyles(isDarkMode);

	return (
		<View style={styles.mainContainer}>
			<TouchableOpacity style={styles.selectBoxCurrent} onPress={toggleExpand}>
				<View style={styles.selectBoxValue}>
					<ThemedText type="default" style={styles.title}>Премиум функции</ThemedText>
				</View>
				<Animated.View style={{ transform: [{ rotate: rotation }] }}>
					<Svg width="20" height="20" viewBox="0 0 256 256">
						<Path fill={isDarkMode ? '#ffffff' : '#000000'} d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z" />
					</Svg>
				</Animated.View>
			</TouchableOpacity>
			{isExpanded && (
				<ScrollView style={styles.container}>
					<TouchableOpacity onPress={() => setVoiceLibVisible(true)} style={styles.subItem}>
						<ThemedText type="default" style={styles.subItemText}>Библиотека голосов</ThemedText>
					</TouchableOpacity>
				</ScrollView>
			)}

			<Modal visible={isVoiceLibVisible} transparent animationType="fade" onRequestClose={() => setVoiceLibVisible(false)}>
				<View style={styles.modalContainer}>
					<VoiceLibrary isDarkMode={isDarkMode} isVisible={isVoiceLibVisible} onClose={() => setVoiceLibVisible(false)} />
				</View>
			</Modal>
		</View>
	);
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
	mainContainer: {
		marginBottom: 15,
	},
	container: {
		padding: 16,
		backgroundColor: isDarkMode ? '#222222' : '#fafafa',
		marginVertical: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: isDarkMode ? '#333333' : '#dddddd',
	},
	selectBoxCurrent: {
		padding: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: isDarkMode ? '#333333' : '#DDDDDD',
		borderRadius: 8,
		backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
	},
	selectBoxValue: {
		flexDirection: 'row',
		alignItems: 'center',
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
	modalContainer: {
		flex: 1,
		backgroundColor: '#00000099',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default PremiumFeaturesList;