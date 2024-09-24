import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { AntDesign } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface StoryAudioPlayerProps {
  audioUrl: string;
  isDarkMode?: boolean;
}

const StoryAudioPlayer: React.FC<StoryAudioPlayerProps> = ({ audioUrl, isDarkMode = false }) => {
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const [soundInstance, setSoundInstance] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    stopAndResetAudio();
    if (audioUrl) {
      downloadAndSetAudio(audioUrl);
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      soundInstance && soundInstance.release();
    };
  }, [soundInstance]);

  const downloadAndSetAudio = async (url: string) => {
    try {
      setLoading(true);
      const audioPath = `${RNFS.DocumentDirectoryPath}/story_audio.mp3`;

      await RNFS.downloadFile({ fromUrl: url, toFile: audioPath }).promise;
      const fileExists = await RNFS.exists(audioPath);

      if (fileExists) {
        console.log('File downloaded successfully.');
        setAudioFilePath(audioPath);
      } else {
        throw new Error('File does not exist after download');
      }
    } catch (err) {
      console.error('File download error:', err);
      setError('Ошибка при сохранении аудио');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!audioFilePath || loading) return;

    if (!soundInstance) {
      setLoading(true);

      const newSound = new Sound(audioFilePath, undefined, (error) => {
        setLoading(false);

        if (!error) {
          console.log('Audio initialized.');
          newSound.play((success) => {
            if (success) {
              console.log('Audio finished successfully.');
            } else {
              console.error('Audio playback failed.');
            }
            resetAudioState();
          });
          
          setSoundInstance(newSound);
          setIsPlaying(true);
        } else {
          console.error('Failed to load sound:', error);
          setError('Ошибка при воспроизведении аудио');
        }
      });
    } else if (soundInstance && isPaused) {
      soundInstance.play((success) => {
        if (success) {
          console.log('Audio resumed successfully.');
        } else {
          console.error('Failed to resume audio.');
        }
        resetAudioState();
      });
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const pauseAudio = () => {
    if (soundInstance && isPlaying) {
      soundInstance.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const stopAndResetAudio = () => {
    if (soundInstance) {
      soundInstance.stop(() => resetAudioState());
    }
  };

  const resetAudioState = () => {
    console.log('Resetting audio state.');
    setIsPlaying(false);
    setIsPaused(false);
    if (soundInstance) {
      soundInstance.release();
      setSoundInstance(null);
    }
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
        />
      )}

      {isPlaying && (
        <AudioButton
          title="Пауза"
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
}

const AudioButton: React.FC<AudioButtonProps> = ({ title, icon, onPress, isDarkMode, isPlaying }) => {
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
    <TouchableOpacity onPress={onPress} style={getStyles(isDarkMode).button}>
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
      shadowColor: isDarkMode ? 'rgba(255, 165, 0, 0.5)' : 'rgba(218, 165, 32, 0.5)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 10,
      shadowOpacity: 0.8,
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