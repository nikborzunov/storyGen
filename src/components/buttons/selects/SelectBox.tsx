import React, { useState, useCallback, memo } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { ISelectOption } from '@/src/typing/settings';

const ANIMATION_TYPE = 'fade';
const SEARCH_PLACEHOLDER = 'Search...';
const MODAL_BACKGROUND_STYLE = { backgroundColor: 'rgba(0, 0, 0, 0.7)' };

interface SelectBoxProps {
  title?: string;
  name?: string;
  options: ISelectOption[];
  selected: ISelectOption[];
  onSelect: (selected: ISelectOption[]) => void;
  itemType?: 'link' | 'checkbox';
  emptyOptionsPlaceholder?: string;
}

const SelectBox: React.FC<SelectBoxProps> = memo(({
  title = 'Выберите вариант',
  name,
  options,
  selected,
  onSelect,
  itemType = 'checkbox',
  emptyOptionsPlaceholder = "Здесь пока пусто",
}) => {
  const [isListVisible, setListVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleList = useCallback(() => setListVisible(prev => !prev), []);

  const handleSelect = useCallback((option: ISelectOption) => {
    if (itemType === 'checkbox') {
      const isSelected = selected.some(item => item.value === option.value);
      const newSelected = isSelected ? selected.filter(item => item.value !== option.value) : [...selected, { ...option, checked: true }];
      onSelect(newSelected);
    } else {
      onSelect([option]);
      setListVisible(false);
    }
  }, [itemType, selected, onSelect]);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity style={styles.selectBoxCurrent} onPress={toggleList}>
        <View style={styles.selectBoxValue}>
          <ThemedText type="default">{title}</ThemedText>
        </View>
        <Svg width="20" height="20" viewBox="0 0 256 256">
          <Path fill="#000" d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z" />
        </Svg>
      </TouchableOpacity>

      <Modal
        visible={isListVisible}
        transparent
        animationType={ANIMATION_TYPE}
        onRequestClose={toggleList}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleList}>
              <ThemedText type="default" style={{ color: '#ffffff', fontSize: 20 }}>X</ThemedText>
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder={SEARCH_PLACEHOLDER}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList<ISelectOption>
              data={filteredOptions}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.selectBoxOption}
                >
                  <View style={styles.optionContainer}>
                    {itemType === 'checkbox' ? (
                      <MaterialIcons
                        name={selected.some(s => s.value === item.value) ? "check-box" : "check-box-outline-blank"}
                        size={24}
                        color="white"
                      />
                    ) : null}
                    <ThemedText type="default" style={styles.checkboxLabel}>{item.name}</ThemedText>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <ThemedText type="default">{emptyOptionsPlaceholder}</ThemedText>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
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
    borderColor: '#444',
    borderRadius: 5,
    backgroundColor: '#1e1e1e',
  },
  selectBoxValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...MODAL_BACKGROUND_STYLE,
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: -30,
    right: 10,
  },
  searchInput: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  selectBoxOption: {
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
  },
  emptyContainer: {
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SelectBox;