import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type RecordButtonProps = {
    isRecording: boolean;
    onPress: () => void;
};

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <MaterialIcons name={isRecording ? 'stop' : 'mic'} size={30} color="#FFF" />
        </TouchableOpacity>
    );
};

export default RecordButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4A90E2',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 20,
        height: 60,
        width: 60,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
});