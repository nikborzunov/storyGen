import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CloseButtonProps = {
    isDarkMode: boolean;
    onPress: () => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ isDarkMode, onPress }) => {
	const styles = getStyles(isDarkMode);

  return (
      <TouchableOpacity style={styles.closeButton} onPress={onPress}>
          <MaterialIcons name="close" size={28} color={isDarkMode ? "#ffffff" : "#333333"} />
      </TouchableOpacity>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    closeButton: {
			backgroundColor: isDarkMode ? '#444444' : '#FFFFFF',
      borderRadius: 50,
      padding: 8,
      elevation: 2,
      shadowColor: isDarkMode ? '#000' : '#000000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
});

export default CloseButton;