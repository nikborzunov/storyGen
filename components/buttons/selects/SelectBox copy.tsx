import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, FlatList, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Svg, { Path } from 'react-native-svg';

const SelectBox = ({ name, options, selected, onSelect }) => {
  const [isListVisible, setListVisible] = useState(false);

  const toggleList = () => {
    setListVisible(!isListVisible);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setListVisible(false);
  };

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity style={styles.selectBoxCurrent} onPress={toggleList}>
        <View style={styles.selectBoxValue}>
          {options.map((option) => (
            option.checked && (
              <View key={option.value} style={styles.selectBoxInput}>
                <ThemedText type="body">{option.name}</ThemedText>
              </View>
            )
          ))}
        </View>
        <Svg width="20" height="20" viewBox="0 0 256 256">
          <Path fill="#000000" d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z"/>
        </Svg>
      </TouchableOpacity>

      <Modal
        visible={isListVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setListVisible(false)} // Обработка нажатия кнопки "Назад" на Android
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.selectBoxOption}>
                  <ThemedText type="body">{item.name}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... ваши другие стили
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Фоновый цвет с полупрозрачностью
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%', // Ширина модального окна
    backgroundColor: '#1e1e1e', // Фон модального окна
    borderRadius: 5,
    padding: 20,
  },
	selectBoxInput: {
    // Дополнительные стили для текущего выбора
  },
	selectContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  selectBoxCurrent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444', // Более темный бордер
    borderRadius: 5,
    backgroundColor: '#1e1e1e', // Темный фон для текущего выбора
  },
  selectBoxValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBoxIcon: {
    width: 20,
    height: 20,
    opacity: 0.7, // Более прозрачный иконка
  },
  selectBoxOption: {
    padding: 15,
    backgroundColor: '#1e1e1e', // Темный фон для опций
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Темный бордер
  },
});

export default SelectBox;