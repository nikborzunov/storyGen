import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { Voice } from '@/src/typing/voice';
import { v4 as uuidv4 } from 'uuid';

interface VoiceLibraryListProps {
    voices: Voice[];
}

const VoiceLibraryList: React.FC<VoiceLibraryListProps> = ({ voices }) => {
    const renderItem = ({ item }: { item: Voice }) => (
        <View style={styles.itemContainer}>
            <ThemedText type="default" style={styles.itemText}>
                {item.name} - {item.role} (Возраст: {item.age}, Пол: {item.gender})
            </ThemedText>
        </View>
    );

    const keyExtractor = () => uuidv4();

    return (
        <FlatList
            data={voices}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    itemContainer: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    itemText: {
        fontSize: 16,
    },
});

export default VoiceLibraryList;