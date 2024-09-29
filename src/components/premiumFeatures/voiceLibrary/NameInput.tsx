import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

type NameInputProps = {
    isDarkMode: boolean;
    value: string;
    onChange: (value: string) => void;
};

const NameInput = React.forwardRef<TextInput, NameInputProps>(({ isDarkMode, value, onChange }, ref) => {
    const handleInput = (text: string) => {
        const filtered = text.replace(/[^а-яА-ЯёЁa-zA-Z\s]/g, '');
        onChange(filtered);
    };

    const styles = getStyles(isDarkMode);

    return (
        <View>
            <ThemedText type="default" style={styles.label}>Имя:</ThemedText>
            <TextInput
                style={[styles.input, { borderColor: isDarkMode ? '#444' : '#CCC', color: isDarkMode ? '#FFF' : '#333' }]}
                placeholder="Введите имя"
                placeholderTextColor={isDarkMode ? '#AAA' : '#888'}
                value={value}
                onChangeText={handleInput}
                ref={ref}
                returnKeyType="done"
                underlineColorAndroid="transparent"
            />
        </View>
    );
});

export default NameInput;

const getStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
        input: {
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderRadius: 8,
            fontSize: 16,
            marginBottom: 20,
            backgroundColor: isDarkMode ? '#555' : '#f8f8f8',
            shadowColor: isDarkMode ? '#000' : '#aaa',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            elevation: 3,
        },
        label: {
            fontSize: 16,
            marginBottom: 6,
            color: isDarkMode ? '#E0E0E0' : '#333',
        }
    });