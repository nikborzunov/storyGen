import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

interface ToggleSwitchProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void; // Функция изменения значения
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ title, value, onValueChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <ThemedText type="default">{title}</ThemedText>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
});

export default ToggleSwitch;