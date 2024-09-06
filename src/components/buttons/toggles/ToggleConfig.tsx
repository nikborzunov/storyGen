import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import ToggleSwitch from '@/src/components/buttons/toggles/ToggleSwitch';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { changeToggleConfig } from '@/src/store/reducers/SettingsSlice';

const ToggleConfig: React.FC = () => {
	const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
	const isDarkMode = toggleConfig['darkMode']?.checked;

	const dispatch = useAppDispatch();

	const handleToggleConfigChange = (name: string, title: string, checked: boolean) => {
		dispatch(changeToggleConfig({ name, title, checked }));
	};

	const styles = getStyles(isDarkMode);

	return (
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
	);
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: isDarkMode ? '#222222' : '#fafafa',
		marginVertical: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: isDarkMode ? '#333333' : '#dddddd',
	},
});

export default ToggleConfig;