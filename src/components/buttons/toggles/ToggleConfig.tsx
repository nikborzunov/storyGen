import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Animated, View } from 'react-native';
import ToggleSwitch from '@/src/components/buttons/toggles/ToggleSwitch';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { changeToggleConfig } from '@/src/store/reducers/SettingsSlice';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '../../ThemedText';

interface ToggleConfigListProps {
	isExpanded: boolean;
	toggleExpand: () => void;
};

const ToggleConfigList: React.FC<ToggleConfigListProps> = ({ isExpanded, toggleExpand }) => {
	const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
	const isDarkMode = toggleConfig['darkMode']?.checked;

	const dispatch = useAppDispatch();

	const handleToggleConfigChange = (name: string, title: string, checked: boolean) => {
		dispatch(changeToggleConfig({ name, title, checked }));
	};

	const styles = getStyles(isDarkMode);

	return (
		<View style={styles.mainContainer}>
			<TouchableOpacity style={styles.selectBoxCurrent} onPress={toggleExpand}>
				<View style={styles.selectBoxValue}>
					<ThemedText type="default" style={styles.title}>Конфигурации</ThemedText>
				</View>
				<Animated.View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
					<Svg width="20" height="20" viewBox="0 0 256 256">
						<Path fill={isDarkMode ? '#ffffff' : '#000000'} d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z" />
					</Svg>
				</Animated.View>
			</TouchableOpacity>
			{isExpanded && (
				<ScrollView style={styles.container}>
					{Object.values(toggleConfig).map(({ name, title, checked }) => (
						<ToggleSwitch
							key={name}
							title={title}
							name={name}
							value={checked}
							onValueChange={(value: boolean) => handleToggleConfigChange(name, title, value)}
							trackColor={{ true: isDarkMode ? '#8a8a8a' : '#cccccc', false: isDarkMode ? '#8a8a8a' : '#cccccc' }} 
							isDarkMode={isDarkMode}
						/>
					))}
				</ScrollView>
			)}
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
});

export default ToggleConfigList;