import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

interface ToggleSwitchProps {
  name?: string;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor: any;
  isDarkMode: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ title, value, onValueChange, trackColor, isDarkMode }) => {

  const styles = getStyles(isDarkMode);

  const switchTrackColor: { true: string | undefined, false: string | undefined } = {
    true: '#4CAF50' ,
    false: '#9E9E9E',
  };

  const switchThumbColor: string = isDarkMode ? '#ffffff' : '#ffffff';

  return (
    <View style={styles.toggleContainer}>
      <ThemedText style={styles.text}>{title}</ThemedText>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={switchTrackColor} 
        thumbColor={switchThumbColor} 
      />
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: isDarkMode ? '#333333' : '#f7f7f7',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: isDarkMode ? '#666666' : '#dddddd',
  },
  text: {
    color: isDarkMode ? '#ffffff' : '#222222',
    fontSize: 16,
  },
});

export default ToggleSwitch;