import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SelectBox from '@/components/buttons/selects/SelectBox';
import ToggleSwitch from '@/components/buttons/toggles/ToggleSwitch';
import { useNavigation } from '@react-navigation/native';

interface SelectOption {
  name: string;
  value: string;
  checked?: boolean;
}

const selectOptions: SelectOption[] = [
  { name: 'Легенды о любви', value: '1', checked: false },
  { name: 'Зачарованные предметы', value: '2', checked: false },
  { name: 'Необычные способности', value: '3', checked: false },
  { name: 'Два мира - реальный и волшебный', value: '4', checked: false },
  { name: 'Путешествие к звёздам', value: '5', checked: false },
  { name: 'Битва с чудовищем', value: '6', checked: false },
  { name: 'Мифические существа', value: '7', checked: false },
  { name: 'Законы магии', value: '8', checked: false }
];

const listOfStories: SelectOption[] = [
  { name: 'Сказка про Рыбака', value: '1' },
  { name: 'Гарри Поттер', value: '2' },
  { name: 'Жизнь муравья', value: '3' },
];

export default function TabTwoScreen() {
  const [isMusicEnabled, setMusicEnabled] = useState<boolean>(false);
  const [isTypingEffectEnabled, setTypingEffectEnabled] = useState<boolean>(false);
  const [isUniqueStoriesEnabled, setUniqueStoriesEnabled] = useState<boolean>(false);
  const [isGameModeEnabled, setGameModeEnabled] = useState<boolean>(false);
  const [isScreenLockEnabled, setScreenLockEnabled] = useState<boolean>(false);
  const [historySizeEnabled, setHistorySizeEnabled] = useState<boolean>(false);
  
  const [selectedTheme, setSelectedTheme] = useState<SelectOption>(selectOptions[0]);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Настройки</ThemedText>
      </ThemedView>

      <View style={styles.userContainer}>
        <ThemedText type="subtitle">👤 Имя пользователя</ThemedText>
      </View>

      <SelectBox 
        name="theme" 
        options={selectOptions} 
        selected={selectedTheme} 
        onSelect={setSelectedTheme} 
      />

      <SelectBox 
        name="Choose an option" 
        options={listOfStories} 
        onSelect={setSelectedTheme} 
        itemType="link" // Pass the itemType prop here
        navigation={navigation} 
      />

      {/* Use ToggleSwitch components for the remaining functionality */}
      <ToggleSwitch title="Размер истории" value={historySizeEnabled} onValueChange={setHistorySizeEnabled} />
      <ToggleSwitch title="Музыка" value={isMusicEnabled} onValueChange={setMusicEnabled} />
      <ToggleSwitch title="Эффект печатания" value={isTypingEffectEnabled} onValueChange={setTypingEffectEnabled} />
      <ToggleSwitch title="Только уникальные истории" value={isUniqueStoriesEnabled} onValueChange={setUniqueStoriesEnabled} />
      <ToggleSwitch title="Режим игры" value={isGameModeEnabled} onValueChange={setGameModeEnabled} />
      <ToggleSwitch title="Блокировка экрана" value={isScreenLockEnabled} onValueChange={setScreenLockEnabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Темный фон
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});