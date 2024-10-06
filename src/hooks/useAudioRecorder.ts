import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const MAXIMUM_AUDIO_RECORDING_DURATION = 10000;

const useAudioRecorder = () => {
    const [soundUri, setSoundUri] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
    const [recordingTimeout, setRecordingTimeout] = useState<NodeJS.Timeout | null>(null);

    const requestAudioPermission = useCallback(async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();
            setAudioPermission(granted);
            console.log('Permission Granted:', granted);
        } catch (error) {
            console.error('Error requesting permissions:', error);
        }
    }, []);

    useEffect(() => {
        requestAudioPermission();
        return () => {
            stopRecording();
            unloadAudio();
        };
    }, [requestAudioPermission]);

    const unloadSound = useCallback(async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            console.log('Sound unloaded');
        }
    }, [sound]);

    const setupAudioMode = useCallback(async () => {
        if (audioPermission) {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                staysActiveInBackground: true,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: false,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playThroughEarpieceAndroid: false,
            });
        }
    }, [audioPermission]);

    const resetAudioMode = useCallback(async () => {
        if (audioPermission) {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: false,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playThroughEarpieceAndroid: false,
            });
        }
    }, [audioPermission]);

    const startRecording = useCallback(async () => {
        if (isPlaying) {
            await stopPlaying();
        }
        await setupAudioMode();

        const newAudio = new Audio.Recording();
        const path = `${FileSystem.documentDirectory}recording_${Date.now()}.m4a`;

        try {
            await newAudio.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await newAudio.startAsync();
            setSoundUri(path);
            setIsRecording(true);
            recordingRef.current = newAudio;
            console.log(`Recording started: ${path}`);

            const timeoutId = setTimeout(async () => {
                console.log("Stopping recording due to timeout...");
                await stopRecording();
                Alert.alert("Предупреждение", `Максимальное время записи ${MAXIMUM_AUDIO_RECORDING_DURATION / 1000} секунд`);
            }, MAXIMUM_AUDIO_RECORDING_DURATION);
            setRecordingTimeout(timeoutId);
        } catch (error) {
            handleError(`Failed to start recording: ${error instanceof Error ? error.message : "Unknown error"}`);
            await resetAudioMode();
        }
    }, [isPlaying, setupAudioMode, resetAudioMode]);

    const stopRecording = useCallback(async () => {
        const currentRecording = recordingRef.current;

        if (!currentRecording) {
            console.log('No active recording to stop');
            return;
        }

        if (recordingTimeout) {
            clearTimeout(recordingTimeout);
            setRecordingTimeout(null);
            console.log("Recording timeout cleared.");
        }

        try {
            await currentRecording.stopAndUnloadAsync();
            const uri = currentRecording.getURI();
            setSoundUri(uri);
            setIsRecording(false);
            recordingRef.current = null;
            console.log(`Recording stopped, saved to: ${uri}`);

            const fileInfo = await FileSystem.getInfoAsync(uri!);
            if (fileInfo.exists) {
                console.log(`Recording file exists at: ${fileInfo.uri}`);
            } else {
                console.error(`Error: Recording file not found at: ${uri}`);
            }

            await resetAudioMode();
        } catch (error) {
            handleError("Failed to stop recording.");
        }
    }, [resetAudioMode, recordingTimeout]);

    const startPlaying = useCallback(async () => {
        if (!soundUri) {
            Alert.alert("Error", "No available recording to play.");
            return;
        }

        const newSound = new Audio.Sound();
        setSound(newSound);
        try {
            await newSound.loadAsync({ uri: soundUri });
            await newSound.playAsync();
            setIsPlaying(true);
            console.log('Playback started');

            newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    unloadSound();
                }
            });
        } catch (error) {
            unloadSound();
            handleError("Failed to play sound.");
        }
    }, [soundUri, unloadSound]);

    const stopPlaying = useCallback(async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                setIsPlaying(false);
                console.log('Playback stopped');
            } catch (error) {
                handleError("Failed to stop playback.");
            }
        }
    }, [sound]);

    const handleError = useCallback((message: string) => {
        Alert.alert("Error", message);
        console.error(message);
    }, []);

    const unloadAudio = useCallback(async () => {
        if (recordingRef.current) {
            await recordingRef.current.stopAndUnloadAsync();
            console.log('Audio unloaded');
            recordingRef.current = null;
        }
        await unloadSound();
    }, [unloadSound]);

    return {
        soundUri,
        isPlaying,
        isRecording,
        startRecording,
        stopRecording,
        startPlaying,
        stopPlaying,
    };
};

export default useAudioRecorder;