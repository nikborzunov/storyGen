import React from 'react';
import { ThemedText } from '../../ThemedText';
import { StyleSheet, View } from 'react-native';

const RoleDescription: React.FC<{ isDarkMode: boolean; selectedRole: string; name: string; roles: any[] }> = ({ isDarkMode, selectedRole, name, roles }) => {
    const role = roles.find(r => r.value === selectedRole);

    const styles = getStyles(isDarkMode);

    return (
        <View style={styles.container}>
            <ThemedText type="title" style={styles.text}>
                {role ? `Запишите голос для "${role.value}" с именем "${name || 'Имя'}"` : 'Запишите голос для выбранной роли'}
            </ThemedText>
        </View>
    );
};

export default RoleDescription;

const getStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
        container: {
            marginBottom: 20,
            padding: 15,
            borderRadius: 12,
            backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
            shadowColor: isDarkMode ? '#000' : '#aaa',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            elevation: 5,
        },
        text: {
            fontSize: 18,
            textAlign: 'center',
            fontWeight: '600',
            color: isDarkMode ? '#E0E0E0' : '#333',
        }
    });