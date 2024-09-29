import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ISelectOption } from '@/src/typing/settings';
import { TextInput } from 'react-native';

const useVoiceLibraryLogic = (isDarkMode: boolean, isVisible: boolean, onClose: () => void) => {
    const [formData, setFormData] = useState<{
        selectedRole: string;
        name: string;
        gender: 'male' | 'female';
        age: string;
    }>({
        selectedRole: '',
        name: '',
        gender: 'male',
        age: ''
    });

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const textInputRef = useRef<TextInput | null>(null);

    useEffect(() => {
        if (isVisible) {
            lockOrientation();
        }
    }, [isVisible]);

    const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync();
    };

    const toggleRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            await recording?.stopAndUnloadAsync();
            const uri = recording?.getURI();
            alert(`Аудио сохранено по пути: ${uri}`);
        } else {
            const { status } = await Audio.requestPermissionsAsync();
            if (status === 'granted') {
                const { recording: newRecording } = await Audio.Recording.createAsync();
                setRecording(newRecording);
                setIsRecording(true);
            } else {
                alert('Необходим доступ к микрофону');
            }
        }
    };

    const handleInputChange = (name: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (role: ISelectOption) => {
        setFormData(prev => ({ ...prev, selectedRole: role.name }));
    };

    const selectedOption: ISelectOption | null = formData.selectedRole
        ? { name: formData.selectedRole, value: formData.selectedRole }
        : null;

    useEffect(() => {
        return () => {
            unlockOrientation();
        };
    }, []);

    return {
        formData,
        setFormData,
        isRecording,
        toggleRecording,
        handleInputChange,
        handleRoleSelect,
        selectedOption,
        textInputRef,
    };
};

export default useVoiceLibraryLogic;