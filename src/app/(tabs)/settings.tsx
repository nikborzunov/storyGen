import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectBox from '@/src/components/buttons/selects/SelectBox';
import ToggleSwitch from '@/src/components/buttons/toggles/ToggleSwitch';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { chooseStoryTheme } from '@/src/store/reducers/SettingsSlice';
import { ISelectOption } from '@/src/typing/settings';

const Settings: React.FC = () => {
  const [isMusicEnabled, setMusicEnabled] = useState(false);
  const [isTypingEffectEnabled, setTypingEffectEnabled] = useState(false);
  const [isUniqueStoriesEnabled, setUniqueStoriesEnabled] = useState(false);
  const [isGameModeEnabled, setGameModeEnabled] = useState(false);
  const [isScreenLockEnabled, setScreenLockEnabled] = useState(false);
  const [isHistorySizeEnabled, setIsHistorySizeEnabled] = useState(false);
  
  const [selectedTheme, setSelectedTheme] = useState<ISelectOption[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ISelectOption[]>([]);

  const navigation = useNavigation<any>();

  const dispatch = useAppDispatch();

  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);
  const history = useAppSelector(state => state?.story?.history);

  useEffect(() => {
    dispatch(chooseStoryTheme(selectedTheme));
  }, [selectedTheme, dispatch]);

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Настройки</ThemedText>
      </ThemedView>

      <View style={styles.userContainer}>
        <ThemedText type="subtitle">👤 Имя пользователя</ThemedText>
      </View>

      <SelectBox
        title='Темы сказок'
        options={selectedThemesFromStore} 
        selected={selectedTheme} 
        onSelect={setSelectedTheme}
        itemType='checkbox' 
      />

      <SelectBox 
        title='История'
        options={history}
        selected={selectedHistory} 
        onSelect={setSelectedHistory} 
        itemType="link"
        navigation={navigation} 
      />

      <ToggleSwitch title="Размер истории" value={isHistorySizeEnabled} onValueChange={setIsHistorySizeEnabled} />
      <ToggleSwitch title="Музыка" value={isMusicEnabled} onValueChange={setMusicEnabled} />
      <ToggleSwitch title="Эффект печатания" value={isTypingEffectEnabled} onValueChange={setTypingEffectEnabled} />
      <ToggleSwitch title="Только уникальные истории" value={isUniqueStoriesEnabled} onValueChange={setUniqueStoriesEnabled} />
      <ToggleSwitch title="Режим игры" value={isGameModeEnabled} onValueChange={setGameModeEnabled} />
      <ToggleSwitch title="Блокировка экрана" value={isScreenLockEnabled} onValueChange={setScreenLockEnabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#121212',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  userContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default Settings;