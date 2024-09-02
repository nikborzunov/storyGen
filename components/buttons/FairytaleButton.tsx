import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FairytaleButtonProps {
    onPress: () => void;
    disabled?: boolean; 
}

const FairytaleButton: React.FC<FairytaleButtonProps> = ({ onPress, disabled = false }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={!disabled ? onPress : undefined}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                <ThemedText style={styles.buttonText}>{disabled ? 'Подождите...' : 'Новая Сказка'}</ThemedText>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#DAA520',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default FairytaleButton;