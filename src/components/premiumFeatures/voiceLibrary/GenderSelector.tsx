import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

type GenderSelectorProps = {
    isDarkMode: boolean;
    gender: string;
    onChange: (gender: 'male' | 'female') => void;
};

const GenderSelector: React.FC<GenderSelectorProps> = ({ isDarkMode, gender, onChange }) => {
    const styles = getStyles(isDarkMode);
    
    return (
        <View style={styles.container}>
            <ThemedText type="default" style={styles.label}>Пол:</ThemedText>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, gender === 'male' && styles.selectedMale]}
                    onPress={() => onChange('male')}
                >
                    <ThemedText type="default" style={gender === 'male' ? styles.activeText : styles.inactiveText}>
                        Муж
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, gender === 'female' && styles.selectedFemale]}
                    onPress={() => onChange('female')}
                >
                    <ThemedText type="default" style={gender === 'female' ? styles.activeText : styles.inactiveText}>
                        Жен
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GenderSelector;

const getStyles = (isDarkMode: boolean) => 
    StyleSheet.create({
        container: {
            paddingVertical: 10,
            marginBottom: 20,
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        button: {
            flex: 1,
            paddingVertical: 12,
            borderWidth: 1,
            borderRadius: 6,
            alignItems: 'center',
            marginHorizontal: 5,
            backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
            borderColor: isDarkMode ? '#777' : '#ddd',
        },
        selectedMale: {
            backgroundColor: '#9FC9E6',
            borderColor: '#00A3E0',
        },
        selectedFemale: {
            backgroundColor: '#FFB2C6',
            borderColor: '#E50057',
        },
        activeText: {
            color: isDarkMode ? '#fff' : '#2C2C2C',
            fontWeight: '600',
        },
        inactiveText: {
            color: isDarkMode ? '#B0B0B0' : '#888',
        },
        label: {
            fontSize: 16,
            marginBottom: 8,
            color: isDarkMode ? '#E0E0E0' : '#333',
            textAlign: 'left',
        }
});