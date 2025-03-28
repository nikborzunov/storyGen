import 'react-native-get-random-values';
import React, { useState, useCallback, memo, useMemo, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Modal, TextInput, Animated, Dimensions } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { ISelectOption } from '@/src/typing/settings';
import { v4 as uuidv4 } from 'uuid';
import CloseButton from '../styledButtons/CloseButton';

const ANIMATION_TYPE = 'fade';
const SEARCH_PLACEHOLDER = 'Search...';
const CLEAR_SELECTION_TEXT = 'Очистить выбор';
const MODAL_BACKGROUND_STYLE = { backgroundColor: 'rgba(0, 0, 0, 0.7)' };

type SelectBoxPropsCheckbox = {
  title?: string;
  options: ISelectOption[];
  selected: ISelectOption[];
  onSelect: (selected: ISelectOption[]) => void;
  itemType: 'checkbox';
  isDarkMode: boolean;
  emptyOptionsPlaceholder?: string;
};

type SelectBoxPropsLink = {
  title?: string;
  options: ISelectOption[];
  selected: ISelectOption | null;
  onSelect: (selected: ISelectOption) => void;
  itemType: 'link';
  isDarkMode: boolean;
  emptyOptionsPlaceholder?: string;
};

type SelectBoxProps = SelectBoxPropsCheckbox | SelectBoxPropsLink;

const SelectBox: React.FC<SelectBoxProps> = memo(({
  title = 'Выберите вариант',
  options,
  selected = [],
  onSelect,
  itemType = 'checkbox',
  emptyOptionsPlaceholder = "Здесь пока пусто",
  isDarkMode,
}) => {
  const [isListVisible, setListVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tempSelected, setTempSelected] = useState<ISelectOption[]>(selected as ISelectOption[]);

  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const { width } = Dimensions.get('window');

  const getButtonTextSize = useMemo(() => {
    if (width < 375) {
        return 10;
    } else if (width < 768) {
        return 14;
    } else {
        return 18;
    };
  }, [width]);

  React.useEffect(() => {
    setTempSelected(selected as ISelectOption[]);
  }, [isListVisible, selected]);

  const toggleList = useCallback(() => {
    const toValue = isListVisible ? 0 : 1;

    Animated.timing(rotateAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setListVisible(prev => !prev);
  }, [isListVisible, rotateAnimation]);

  const handleTempSelect = useCallback((option: ISelectOption) => {
    setTempSelected(prevSelected => {
      const isSelected = prevSelected?.some(item => item?.value === option?.value);
      return isSelected 
        ? prevSelected?.filter(item => item?.value !== option?.value)
        : [...(prevSelected ? prevSelected : []), { ...option, checked: true }];
    });
  }, []);

  const handleSelect = useCallback((option: ISelectOption) => {
    if (itemType === 'checkbox') {
      handleTempSelect(option);
    } else if (itemType === 'link') {
      onSelect(option as any);
      setListVisible(false);

      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [itemType, handleTempSelect, onSelect, rotateAnimation]);

  const handleApplySelection = useCallback(() => {
    onSelect(tempSelected as any);
    setListVisible(false);

    Animated.timing(rotateAnimation, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [tempSelected, onSelect, rotateAnimation]);

  const handleClearSelection = useCallback(() => {
    if (itemType === 'checkbox') {
      setTempSelected([]);
    } else if (itemType === 'link') {
      onSelect(null as any);
      setListVisible(false);

      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [itemType, onSelect, rotateAnimation]);

  const filteredOptions = useMemo(() => (
    options.filter(option =>
      option?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    )
  ), [options, searchQuery]);

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const styles = getStyles(isDarkMode, getButtonTextSize);

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity style={styles.selectBoxCurrent} onPress={toggleList}>
        <View style={styles.selectBoxValue}>
          <ThemedText style={styles.selectBoxTitle} type="default">{title}</ThemedText>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Svg width="20" height="20" viewBox="0 0 256 256">
            <Path fill={isDarkMode ? '#ffffff' : '#000000'} d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z" />
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={isListVisible}
        transparent
        animationType={ANIMATION_TYPE}
        onRequestClose={toggleList}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton}>
                <CloseButton isDarkMode={isDarkMode} onPress={toggleList} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder={SEARCH_PLACEHOLDER}
              placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredOptions}
              keyExtractor={item => uuidv4()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.selectBoxOption}
                >
                  <View style={styles.optionContainer}>
                    {itemType === 'checkbox' && (
                      <MaterialIcons
                        name={tempSelected?.some(s => s.value === item.value) ? "check-box" : "check-box-outline-blank"}
                        size={24}
                        color={isDarkMode ? '#ffffff' : '#000000'}
                      />
                    )}
                    <ThemedText type="default" style={styles.checkboxLabel}>{item.name}</ThemedText>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <MaterialIcons 
                    name="hourglass-empty" 
                    size={48} 
                    color={isDarkMode ? '#999999' : '#BBBBBB'} 
                    style={{ marginBottom: 10 }} 
                  />
                  <ThemedText type="default" style={styles.emptyText}>
                    {emptyOptionsPlaceholder || 'Ничего не найдено'}
                  </ThemedText>
                  <ThemedText type="default" style={styles.emptyInfoText}>
                    Попробуйте изменить критерии поиска или загрузить новые сказки.
                  </ThemedText>
                </View>
              )}
            />
            {itemType === 'checkbox' && (
             <View style={styles.buttonGroupContainer}>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearSelection}>
                 <ThemedText type="default" style={styles.clearButtonText}>{CLEAR_SELECTION_TEXT}</ThemedText>
               </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={handleApplySelection}>
                  <ThemedText type="default" style={styles.applyButtonText}>Применить</ThemedText>
                </TouchableOpacity>
             </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
});

const getStyles = (isDarkMode: boolean, getButtonTextSize: number) => StyleSheet.create({
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
      borderColor: isDarkMode ? '#333333' : '#DDDDDD',
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      shadowColor: isDarkMode ? '#000' : '#000000', 
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  selectBoxValue: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  selectBoxTitle: {
      color: isDarkMode ? '#ffffff' : '#333333',
  },
  modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      ...MODAL_BACKGROUND_STYLE,
  },
  modalContainer: {
      width: '85%',
      maxHeight: '85%',
      backgroundColor: isDarkMode ? '#222222' : '#FDFDFD',
      borderRadius: 12,
      padding: 20,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
  },
  searchInput: {
      fontSize: 16,
      padding: 10,
      backgroundColor: isDarkMode ? '#333333' : '#F5F5F5',
      borderRadius: 8,
      color: isDarkMode ? '#ffffff' : '#333333',
      marginBottom: 10,
  },
  selectBoxOption: {
      padding: 15,
      backgroundColor: isDarkMode ? '#222222' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE',
  },
  optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
  },
  checkboxLabel: {
      marginLeft: 10,
      color: isDarkMode ? '#ffffff' : '#4A4A4A',
  },
  buttonGroupContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', 
  },
  applyButton: {
    backgroundColor: isDarkMode ? '#333333' : '#4A90E2',
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: isDarkMode ? '#444444' : '#FF6F61',
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: getButtonTextSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  clearButtonText: {
      color: '#FFFFFF',
      fontSize: getButtonTextSize,
      fontWeight: '600',
      textAlign: 'center',
  },
  emptyContainer: {
      padding: 20,
      paddingTop: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? 'transparent' : '#FAFAFA',
      borderRadius: 8,
      borderColor: isDarkMode ? '#333333' : '#EEEEEE',
      borderWidth: 1,
  },
  emptyText: {
      color: isDarkMode ? '#999999' : '#777777',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 8,
  },
  emptyInfoText: {
      color: isDarkMode ? '#777777' : '#AAAAAA',
      fontSize: 14,
      textAlign: 'center',
  },
  closeButton: {
      position: 'absolute',
      top: -20,
      right: -20,
  },
});

export default SelectBox;