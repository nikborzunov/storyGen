import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

interface FairytaleButtonProps {
    customText?: string;
    onPress: () => void;
    disabled?: boolean;
    blocked?: boolean;
}

const FairytaleButton: React.FC<FairytaleButtonProps> = ({ customText, onPress, disabled = false, blocked = false }) => {
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

    let text;

    if (blocked) {
        text = 'Кнопка заблокирована';
    } else if (disabled) {
        text = 'Подождите...';
    } else {
        text = customText || 'Новая Сказка';
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={!(disabled || blocked) ? onPress : undefined}
            disabled={disabled || blocked}
            activeOpacity={0.7}
        >
            <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                <ThemedText style={styles.buttonText}>{text}</ThemedText>
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
        minWidth: 80,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default FairytaleButton;