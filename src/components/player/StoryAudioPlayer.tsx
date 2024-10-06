import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, AVPlaybackStatus } from 'expo-av';
import { useDispatch } from 'react-redux';
import { setAudioPlayingState } from '@/src/store/reducers/StorySlice';
import * as FileSystem from 'expo-file-system';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface StoryAudioPlayerProps {
  audioUrl: string;
  isDarkMode?: boolean;
}

const StoryAudioPlayer: React.FC<StoryAudioPlayerProps> = ({ audioUrl, isDarkMode = false }) => {
  const dispatch = useDispatch();
  const soundObjectRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    handleAudioUrlChange(audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      stopAndResetAudio();
      dispatch(setAudioPlayingState(false));
    };
  }, [dispatch]);

  const handleAudioUrlChange = async (url: string) => {
    await stopAndResetAudio();
    await downloadAndSetAudio(url);
  };

  const stopAndResetAudio = async () => {
    if (soundObjectRef.current) {
      await soundObjectRef.current.stopAsync();
      await soundObjectRef.current.unloadAsync();
      soundObjectRef.current = null;
    }
  };

  const downloadAndSetAudio = async (url: string) => {
    try {
      setLoading(true);
      const audioPath = `${FileSystem.documentDirectory}/story_audio.mp3`;
      const { uri } = await FileSystem.downloadAsync(url, audioPath);
      const fileExists = await FileSystem.getInfoAsync(uri);

      if (fileExists.exists) {
        await loadAudio(uri);
      } else {
        throw new Error('Файл не был загружен.');
      }
    } catch (err) {
      handleError('Ошибка при загрузке аудио', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAudio = async (uri: string) => {
    const newSound = new Audio.Sound();
    soundObjectRef.current = newSound;

    try {
      await newSound.loadAsync({ uri });
    } catch (error) {
      handleError('Ошибка при воспроизведении аудио', error);
    }
  };

  const playAudio = async () => {
    if (loading || !soundObjectRef.current) return;

    dispatch(setAudioPlayingState(true));

    try {
      await setAudioMode();
      await soundObjectRef.current.playAsync();
      setIsPlaying(true);
      setIsPaused(false);

      soundObjectRef.current.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          resetAudioState();
        }
      });
    } catch (error) {
      handleError('Ошибка при воспроизведении аудио', error);
    }
  };

  const pauseAudio = async () => {
    if (soundObjectRef.current && isPlaying) {
      await soundObjectRef.current.pauseAsync();
      setIsPlaying(false);
      setIsPaused(true);
      dispatch(setAudioPlayingState(false));
    }
  };

  const resetAudioState = () => {
    setIsPlaying(false);
    setIsPaused(false);
    if (soundObjectRef.current) {
      soundObjectRef.current.unloadAsync();
      soundObjectRef.current = null;
    }
  };

  const handleError = (message: string, error: any) => {
    console.error(message, error);
    setError(message);
  };

  const setAudioMode = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="small" color={isDarkMode ? '#FFA500' : '#DAA520'} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && !isPlaying && (
        <AudioButton
          title={isPaused ? 'Продолжить аудио' : 'Воспроизвести аудио'}
          icon={isPaused ? 'playcircleo' : 'play'}
          onPress={playAudio}
          isDarkMode={isDarkMode}
          isPlaying={isPlaying}
          disabled={isPlaying}
        />
      )}

      {isPlaying && (
        <AudioButton
          title={'Пауза'}
          icon="pausecircleo"
          onPress={pauseAudio}
          isDarkMode={isDarkMode}
          isPlaying={isPlaying}
        />
      )}
    </View>
  );
};

interface AudioButtonProps {
  title: string;
  icon: 'playcircleo' | 'pausecircleo' | 'play';
  onPress: () => void;
  isDarkMode: boolean;
  isPlaying: boolean;
  disabled?: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({ title, icon, onPress, isDarkMode, isPlaying, disabled }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      startPulsing();
    } else {
      resetPulse();
    }
  }, [isPlaying]);

  const startPulsing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const resetPulse = () => {
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity onPress={onPress} style={getStyles(isDarkMode).button} disabled={disabled}>
      <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, getStyles(isDarkMode).iconContainer]}>
        <AntDesign name={icon} size={30} color={isDarkMode ? '#FFA500' : '#DAA520'} />
      </Animated.View>
      <Text style={getStyles(isDarkMode).buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      backgroundColor: isDarkMode ? '#2B2B2B' : '#FFFFFF',
      borderRadius: 5,
      shadowColor: isDarkMode ? '#000' : '#999',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      borderWidth: 1,
      borderColor: '#BA8F64',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: isDarkMode ? '#f5e8c6' : '#FAF3E0',
      borderRadius: 20,
      shadowColor: isDarkMode ? '#000' : '#AAA',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    iconContainer: {
      backgroundColor: isDarkMode ? '#2B2B2B' : '#FFFFFF',
      borderRadius: 20,
      shadowColor: 'rgba(218, 165, 32, 0.5)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 10,
      shadowOpacity: 0.8,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    buttonText: {
      fontSize: SCREEN_WIDTH * 0.035,
      fontWeight: 'bold',
      marginLeft: 6,
      color: isDarkMode ? '#FFA500' : '#DAA520',
    },
    errorText: {
      fontSize: 14,
      color: 'red',
      marginTop: 8,
    },
  });

export default StoryAudioPlayer;