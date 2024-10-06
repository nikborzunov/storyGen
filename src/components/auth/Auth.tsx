import React, { useCallback, useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ThemedText } from '@/src/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useGoogleLoginMutation } from '@/src/services/AuthService';
import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { authSlice, AuthState } from '@/src/store/reducers/AuthSlice';
import useAuth from '@/src/hooks/useAuth';
import { UserResponse } from '@/src/typing/user';
import { useNavigation } from 'expo-router';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SettingsParamList } from '@/src/typing/settings';

WebBrowser.maybeCompleteAuthSession();

const Auth: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const extra = Constants.expoConfig?.extra || (Constants.manifest as any)?.extra;
  const config = {
    iosClientId: extra?.GOOGLE_CLIENT_ID_IOS,
    webClientId: extra?.GOOGLE_CLIENT_ID_WEB,
    androidClientId: extra?.GOOGLE_CLIENT_ID_ANDROID,
  };

  const navigation = useNavigation();
  const route = useRoute<RouteProp<SettingsParamList, 'Settings'>>();
  const isAuthModalOpen = route.params?.isAuthModalOpen;

  const [request, response, promptAsync] = Google.useAuthRequest(config, { native: 'com.nikborzunov.storyGen://' });
  const [modalVisible, setModalVisible] = useState(false);
  const [login, { isLoading }] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const { isAuthenticated, email } = useSelector((state: { auth: AuthState }) => state.auth);
  
  const { checkTokenExpiry, handleLogout } = useAuth();

  const getBackgroundColor = useCallback(() => {
    if (modalVisible || isAuthModalOpen) return '#6c757d';
    return isDarkMode ? '#0056b3' : '#007bff';
  }, [modalVisible, route.params?.isAuthModalOpen, isDarkMode]);

  useEffect(() => {
    const updateToken = async () => {
      await checkTokenExpiry();
    };

    updateToken();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken && authentication.accessToken) {
        handleToken(authentication.idToken, authentication.accessToken);
      }
    }
  }, [response]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setModalVisible(true);
    };
  }, [isAuthModalOpen]);
  
  useEffect(() => {
    if (isAuthModalOpen) {
      navigation.setParams({ isAuthModalOpen: undefined } as any);
    }
  }, [modalVisible]); 

  const handleToken = async (idToken: string, accessToken: string) => {
    try {
      const userResponse: UserResponse = await login({ idToken, accessToken }).unwrap();
  
      const { accessToken: newAccessToken, refreshToken, user } = userResponse;
      const { userId, email } = user;
  
      if (!newAccessToken || !userId || !email) {
        throw new Error('Нет токена доступа, userId или email');
      }
  
      await Keychain.setGenericPassword(newAccessToken, refreshToken);
  
      dispatch(authSlice.actions.login({ accessToken: newAccessToken, refreshToken, userId, email }));
  
      setModalVisible(false);
    } catch (error) {
      console.error('Ошибка аутентификации: ', error);
      showError("Ошибка при авторизации. Проверьте ваши данные.");
    }
  };

  const showError = (message: string) => {
    Alert.alert('Ошибка', message);
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <>
          <TouchableOpacity
            style={[
              styles.googleButton,
              { backgroundColor: getBackgroundColor() },
            ]}
            onPress={() => setModalVisible(true)}
            disabled={!request}>
            <Text style={styles.googleButtonText}>Авторизоваться через Google</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: isDarkMode ? '#222' : '#fff' },
                ]}>
                <View style={styles.header}>
                  <ThemedText
                    type="subtitle"
                    style={[
                      styles.modalText,
                      { color: isDarkMode ? '#ffffff' : '#000000' },
                    ]}>
                    Авторизация
                  </ThemedText>
                  <MaterialIcons
                    name="close"
                    size={28}
                    color={isDarkMode ? '#ffffff' : '#333333'}
                    onPress={() => setModalVisible(false)}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => promptAsync()}
                  disabled={isLoading}>
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Загрузка...' : 'Авторизоваться'}
                  </Text>
                  {isLoading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.actionContainer}>
          {email && (
            <View style={styles.successMessageContainer}>
              <ThemedText type="subtitle" style={styles.successMessageText}>
                {email}
              </ThemedText>
            </View>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>Выйти</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  googleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loader: {
    marginTop: 10,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  successMessageContainer: {
    backgroundColor: '#4caf50',
    padding: 10,
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 8,
  },
  successMessageText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Auth;