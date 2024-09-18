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
            <Animated.View
                style={[
                    styles.button,
                    (disabled || blocked) && styles.buttonDisabled,  // Добавление стилей заблокированной кнопки
                    { transform: [{ scale: scaleAnim }] }
                ]}
            >
                <ThemedText
                    style={[
                        styles.buttonText,
                        (disabled || blocked) && styles.buttonTextDisabled  // Добавление стилей для текста заблокированной кнопки
                    ]}
                >
                    {text}
                </ThemedText>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#DAA520',  // Основной золотистый фон для кнопки
        padding: 15,  // Пространство внутри кнопки для комфортного нажатия
        borderRadius: 30,  // Округленные формы, создающие мягкий визуальный эффект
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 6,  // Тень, чтобы кнопка "висела" над поверхностью
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,  // Легкая тень для эффекта глубины
        shadowRadius: 8,
        minWidth: 120,  // Минимальная ширина, чтобы все текстовые варианты вниз подходили
    },
    buttonText: {
        fontSize: 18,  // Чуть меньший шрифт для хорошей читаемости
        fontWeight: 'bold',
        color: '#FFFFFF',  // Белый цвет для контрастного текста
        textShadowColor: 'rgba(0, 0, 0, 0.25)',  // Легкая тень на тексте для эффекта тиснения
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonDisabled: {
        backgroundColor: '#B8A089',  // Приглушенная версия фона для заблокированного состояния
    },
    buttonTextDisabled: {
        color: '#D7D2C8',  // Более приглушенный цвет текста для заблокированного состояния
    },
});

export default FairytaleButton;