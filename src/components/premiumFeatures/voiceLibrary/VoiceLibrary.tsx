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
import { useAddVoiceMutation } from '@/src/services/VoiceService';
import { useSelector } from 'react-redux';
import { selectVoices } from '@/src/store/reducers/VoiceLibrarySlice';
import VoiceLibraryList from './VoiceLibraryList';

const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ isDarkMode, isVisible, onClose }) => {
    const voices = useSelector(selectVoices);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        selectedRole: '',
    });
    const textInputRef = useRef<TextInput>(null);
    const [addVoice, { isLoading }] = useAddVoiceMutation();
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

    const handleInputChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoleSelect = (selectedRole: { name: string; value: string }) => {
        setFormData(prev => ({ ...prev, selectedRole: selectedRole.value }));
    };

    const handleSave = async () => {
        if (!soundUri) {
            console.error('Аудиофайл не записан. Проверьте, была ли запись завершена.');
            return;
        }
    
        try {
            const audioBlob = await fetch(soundUri).then((r) => r.blob());
            
            if (audioBlob.size > 5 * 1024 * 1024) {
                console.error('Размер файла превышает лимит в 5 МБ.');
                return;
            }
    
            const audiofile = new File([audioBlob], "audiofile.mp3", {
                type: "audio/mp3",
            });
    
            if (audioBlob.size === 0) {
                console.error('Полученный файл пустой. Убедитесь, что запись прошла успешно.');
                return;
            }
    
            const selectedRoleKey = selectOptionsVoiceRoles.find(role => role.value === formData.selectedRole)?.key;
     
            const fd = new FormData();
            fd.append("voiceSampleAudio", audiofile, "audio/mpeg");
            fd.append('role', selectedRoleKey || '');
            fd.append('name', formData.name);
            fd.append('gender', formData.gender);
            fd.append('age', formData.age);


            // Логирование содержимого FormData
            for (let i = 0; i < fd._parts.length; i++) {
                const [key, value] = fd._parts[i]; // Получаем ключ и значение из _parts
                if (value instanceof File) {
                    console.log(`Key: ${key}, File Name: ${value.name}, Type: ${value.type}, Size: ${value.size} bytes`);
                } else {
                    console.log(`Key: ${key}, Value:`, value);
                }
            }
     
            await addVoice(fd).unwrap();
            console.log('Голос успешно добавлен.');
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении голоса VoiceLibraryComponent:', error);
        }
    };

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
                        title={formData.selectedRole ? selectOptionsVoiceRoles.find(role => role.value === formData.selectedRole)?.name : "Кто это?"}
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
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
                        <ThemedText type="default" style={styles.saveButtonText}>Сохранить</ThemedText>
                    </TouchableOpacity>
                </ScrollView>

                {voices && <VoiceLibraryList voices={voices} />}

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