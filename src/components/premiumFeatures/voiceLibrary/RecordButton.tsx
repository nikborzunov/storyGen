import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type RecordButtonProps = {
    soundUri: string | null;
    onStartRecording: () => Promise<void>;
    onStopRecording: () => Promise<void>;
    onPlay: () => Promise<void>;
    onStopPlay: () => Promise<void>;
    isPlaying: boolean;
    isRecording: boolean;
    recordingNotificationVisible: boolean;
    opacityAnim: Animated.Value;
};

const RecordButton: React.FC<RecordButtonProps> = ({
    soundUri,
    onStartRecording,
    onStopRecording,
    onPlay,
    onStopPlay,
    isPlaying,
    isRecording,
    recordingNotificationVisible,
    opacityAnim,
}) => {

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (recordingNotificationVisible) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [recordingNotificationVisible, pulseAnim]);

    const handlePress = async () => {
        if (isPlaying) {
            await onStopPlay();
        } else if (isRecording) {
            await onStopRecording();
        } else {
            await onStartRecording();
        }
    };

    const handlePlayPress = async () => {
        if (isPlaying) {
            await onStopPlay();
        } else {
            await onPlay();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.button}>
                <MaterialIcons name={isRecording ? 'stop' : 'mic'} size={30} color="#FFF" />
            </TouchableOpacity>

            {soundUri && (
                <TouchableOpacity onPress={handlePlayPress} style={styles.playButton}>
                    <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="#FFF" />
                </TouchableOpacity>
            )}

            {soundUri && !isPlaying && !isRecording && (
                <Text style={styles.audioText}>Запись завершена</Text>
            )}

            {recordingNotificationVisible && (
                <Animated.View style={[styles.notificationContainer, { opacity: opacityAnim, transform: [{ scale: pulseAnim }] }]}>
                    <Text style={styles.notificationText}>Запись началась!</Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#4A90E2',
        padding: 12,
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    playButton: {
        backgroundColor: '#E91E63',
        padding: 12,
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    audioText: {
        color: '#FFF',
        marginTop: 10,
        textAlign: 'center',
    },
    notificationContainer: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        zIndex: 1000,
    },
    notificationText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default RecordButton;