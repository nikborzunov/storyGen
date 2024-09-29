import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../../ThemedText';
import RoleDescription from './RoleDescription';
import { ReadAloudSectionProps } from '@/src/typing/voice';

const ReadAloudSection: React.FC<ReadAloudSectionProps> = ({ isDarkMode, selectedRole, name, roles }) => {
    const styles = getStyles(isDarkMode);

    return (
        <View style={styles.container}>
            <RoleDescription isDarkMode={isDarkMode} selectedRole={selectedRole} name={name} roles={roles} />
            <ThemedText type="default" style={styles.text}>Прочтите данный текст вслух</ThemedText>
            <View style={styles.exampleContainer}>
                <ThemedText type="default" style={styles.exampleText}>
                    Жил-был старик со своей старухой у самого синего моря
                </ThemedText>
            </View>
        </View>
    );
};

export default ReadAloudSection;

const getStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
            alignItems: 'center',
            paddingHorizontal: 15,
        },
        text: {
            fontSize: 18,
            color: isDarkMode ? '#E0E0E0' : '#333',
            textAlign: 'center',
            marginVertical: 12,
            fontWeight: '500',
        },
        exampleContainer: {
            borderWidth: 1,
            borderColor: isDarkMode ? '#666' : '#CCC',
            padding: 15,
            borderRadius: 12,
            backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
            shadowColor: isDarkMode ? '#000' : '#aaa',
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            elevation: 3,
        },
        exampleText: {
            fontSize: 16,
            textAlign: 'center',
            color: isDarkMode ? '#FFFFFF' : '#333',
            lineHeight: 22,
        },
});