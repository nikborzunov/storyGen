import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

type AgeInputProps = {
    isDarkMode: boolean;
    value: string;
    onChange: (value: string) => void;
};

const AgeInput: React.FC<AgeInputProps> = ({ isDarkMode, value, onChange }) => {
    const handleAgeChange = (newValue: string) => {
        const numericValue = newValue.replace(/[^0-9]/g, '');
        onChange(numericValue);
    };

    const styles = getStyles(isDarkMode);

    return (
        <View>
            <ThemedText type="default" style={styles.label}>
                Возраст:
            </ThemedText>
            <TextInput
                style={[styles.input, { borderColor: isDarkMode ? '#444' : '#CCC', color: isDarkMode ? '#FFF' : '#333' }]}
                placeholder="Введите возраст"
                placeholderTextColor={isDarkMode ? '#AAA' : '#888'}
                value={value}
                onChangeText={handleAgeChange}
                keyboardType="numeric"
                returnKeyType="done"
                underlineColorAndroid="transparent"
            />
        </View>
    );
};

export default AgeInput;

const getStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
        input: {
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderRadius: 8,
            fontSize: 16,
            marginBottom: 15,
            backgroundColor: isDarkMode ? '#555' : '#f8f8f8',
            elevation: isDarkMode ? 2 : 0, 
        },
        label: {
            fontSize: 16,
            color: isDarkMode ? '#E0E0E0' : '#333',
            marginBottom: 6,
        }
    });