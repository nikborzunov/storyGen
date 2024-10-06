import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Keyboard, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '../../ThemedText';
import SelectBox from '@/src/components/buttons/selects/SelectBox';
import CloseButton from '../../buttons/styledButtons/CloseButton';
import Modal from 'react-native-modal';
import NameInput from './NameInput';
import GenderSelector from './GenderSelector';
import AgeInput from './AgeInput';
import RecordButton from './RecordButton';
import ReadAloudSection from './ReadAloudSection';
import { VoiceLibraryProps } from '@/src/typing/voice';
import { selectOptionsVoiceRoles } from '@/src/constants/voiceLibrary';
import useAudioRecorder from '@/src/hooks/useAudioRecorder';
import { TextInput } from 'react-native';

const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ isDarkMode, isVisible, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        selectedRole: '',
    });
    const textInputRef = useRef<TextInput>(null);
    const {
        soundUri,
        isPlaying,
        isRecording,
        startRecording,
        stopRecording,
        startPlaying,
        stopPlaying
    } = useAudioRecorder();
    
    const [recordingNotificationVisible, setRecordingNotificationVisible] = useState(false);
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const handleInputChange = (field: keyof typeof formData) => (value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleRoleSelect = (selectedRole: { value: string }) => {
        setFormData({ ...formData, selectedRole: selectedRole.value });
    };

    useEffect(() => {
        if (isVisible && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [isVisible]);

    useEffect(() => {
        if (isRecording) {
            setRecordingNotificationVisible(true);
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setRecordingNotificationVisible(false);
            });
        }
    }, [isRecording, opacityAnim]);

    const styles = createStyles(isDarkMode);

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
            <View style={styles.container}>
                <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                    <ThemedText type="title" style={styles.headerTitle}>Добавьте новый голос</ThemedText>
                    <SelectBox
                        title={formData.selectedRole || "Кто это?"}
                        options={selectOptionsVoiceRoles}
                        selected={formData.selectedRole ? { name: formData.selectedRole, value: formData.selectedRole } : null}
                        onSelect={handleRoleSelect}
                        itemType="link"
                        isDarkMode={isDarkMode}
                    />
                    <NameInput ref={textInputRef} isDarkMode={isDarkMode} value={formData.name} onChange={handleInputChange('name')} />
                    <GenderSelector isDarkMode={isDarkMode} gender={formData.gender} onChange={handleInputChange('gender')} />
                    <AgeInput isDarkMode={isDarkMode} value={formData.age} onChange={handleInputChange('age')} />
                    <ReadAloudSection
                        isDarkMode={isDarkMode}
                        selectedRole={formData.selectedRole}
                        name={formData.name}
                        roles={selectOptionsVoiceRoles}
                    />
                    <RecordButton 
                        soundUri={soundUri}
                        isPlaying={isPlaying}
                        isRecording={isRecording}
                        onStartRecording={startRecording}
                        onStopRecording={stopRecording}
                        onPlay={startPlaying}
                        onStopPlay={stopPlaying}
                        recordingNotificationVisible={recordingNotificationVisible}
                        opacityAnim={opacityAnim}
                    />
                    <TouchableOpacity style={styles.saveButton}>
                        <ThemedText type="default" style={styles.saveButtonText}>Сохранить</ThemedText>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.closeButton}>
                    <CloseButton isDarkMode={isDarkMode} onPress={onClose} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: { flex: 1 },
    content: {
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
});

export default VoiceLibrary;