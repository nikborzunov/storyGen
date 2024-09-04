import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

interface SelectOption {
  name: string;
  value: string;
}

interface SelectBoxProps {
  name: string;
  options: SelectOption[];
  selected?: SelectOption;
  onSelect: (option: SelectOption) => void;
  itemType?: 'link' | 'checkbox';
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const SelectBox: React.FC<SelectBoxProps> = ({ 
  name, 
  options, 
  selected, 
  onSelect, 
  itemType = 'checkbox',
  navigation 
}) => {
  const [isListVisible, setListVisible] = useState<boolean>(false);
  
  const toggleList = () => setListVisible(prev => !prev);

  const handleSelect = (option: SelectOption) => {
    setListVisible(false);
    
    if (itemType === 'link') {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('index');
      } else {
        console.error("Navigation object is undefined or not a function");
      }
    } else {
      onSelect(option);
    }
  };

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity style={styles.selectBoxCurrent} onPress={toggleList}>
        <View style={styles.selectBoxValue}>
          <ThemedText type="default">{selected?.name || "История"}</ThemedText>
        </View>
        <Svg width="20" height="20" viewBox="0 0 256 256">
          <Path fill="#000" d="M128,194.3L10,76.8l15.5-15.1L128,164.2L230.5,61.7L246,76.8L128,194.3z" />
        </Svg>
      </TouchableOpacity>

      <Modal
        visible={isListVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setListVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setListVisible(false)}>
            <ThemedText type="default" style={{ color: '#ffffff', fontSize: 20 }}>X</ThemedText>
          </TouchableOpacity>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => handleSelect(item)} 
                  style={styles.selectBoxOption}
                >
                  {itemType === 'checkbox' ? (
                    <View style={styles.checkboxContainer}>
                      <MaterialIcons 
                        name={item.value === selected?.value ? "check-box" : "check-box-outline-blank"} 
                        size={24} 
                        color="white" 
                      />
                      <ThemedText type="default" style={styles.checkboxLabel}>{item.name}</ThemedText>
                    </View>
                  ) : (
                    <ThemedText type="default">{item.name}</ThemedText>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingRight: 40,
    paddingBottom: 10,
  },
  selectBoxOption: {
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
  },
});

export default SelectBox;