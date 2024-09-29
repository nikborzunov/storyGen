import React from 'react';
import { View, ScrollView, Keyboard, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../../ThemedText';
import SelectBox from '@/src/components/buttons/selects/SelectBox';
import CloseButton from '../../buttons/styledButtons/CloseButton';
import Modal from 'react-native-modal';
import NameInput from './NameInput';
import GenderSelector from './GenderSelector';
import AgeInput from './AgeInput';
import RecordButton from './RecordButton';
import ReadAloudSection from './ReadAloudSection';
import useVoiceLibraryLogic from '@/src/hooks/useVoiceLibraryLogic';
import { VoiceLibraryProps } from '@/src/typing/voice';
import { selectOptionsVoiceRoles } from '@/src/constants/voiceLibrary';

const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ isDarkMode, isVisible, onClose }) => {
    const {
        formData,
        toggleRecording,
        handleInputChange,
        handleRoleSelect,
        textInputRef,
        isRecording
    } = useVoiceLibraryLogic(isDarkMode, isVisible, onClose);

    const styles = getStyles(isDarkMode);

    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            onBackdropPress={onClose}
            onModalWillHide={() => {
                Keyboard.dismiss();
                textInputRef.current?.blur();
            }}
        >
            <View style={styles.fullContainer}>
                <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                    <ThemedText type="title" style={styles.headerTitle}>
                        Добавьте новый голос
                    </ThemedText>
                    <View style={styles.selectContainer}>
                        <SelectBox
                            title={formData.selectedRole || "Кто это?"}
                            options={selectOptionsVoiceRoles}
                            selected={formData.selectedRole ? { name: formData.selectedRole, value: formData.selectedRole } : null}
                            onSelect={handleRoleSelect}
                            itemType="link"
                            isDarkMode={isDarkMode}
                        />
                    </View>
                    <NameInput
                        ref={textInputRef}
                        isDarkMode={isDarkMode}
                        value={formData.name}
                        onChange={handleInputChange('name')}
                    />
                    <GenderSelector 
                        isDarkMode={isDarkMode} 
                        gender={formData.gender} 
                        onChange={handleInputChange('gender')} 
                    />
                    <AgeInput
                        isDarkMode={isDarkMode}
                        value={formData.age}
                        onChange={handleInputChange('age')}
                    />
                    <ReadAloudSection
                        isDarkMode={isDarkMode}
                        selectedRole={formData.selectedRole}
                        name={formData.name}
                        roles={selectOptionsVoiceRoles}
                        styles={styles}
                    />
                    <RecordButton
                        isRecording={isRecording}
                        onPress={toggleRecording}
                    />
                    <TouchableOpacity style={styles.saveButton}>
                        <ThemedText type="default" style={styles.saveButtonText}>
                            Сохранить
                        </ThemedText>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.closeButton}>
                    <CloseButton isDarkMode={isDarkMode} onPress={onClose} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const getStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
        fullContainer: {
            flex: 1,
        },
        container: {
            padding: 20,
            backgroundColor: isDarkMode ? '#444' : '#ffffff',
            borderRadius: 10,
            marginVertical: 20,
        },
        headerTitle: {
            fontSize: 24,
            color: isDarkMode ? '#ffffff' : '#333333',
            marginBottom: 20,
        },
        saveButton: {
            backgroundColor: '#4CAF50',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 40,
        },
        saveButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '600',
        },
        closeButton: {
            position: 'absolute',
            top: 5,
            right: -17,
            zIndex: 1,
        },
        selectContainer: {
            marginBottom: 20,
        },
    });

export default VoiceLibrary;