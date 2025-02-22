import { useDispatch } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useRefreshTokenMutation } from '@/src/services/AuthService'; 
import { logout } from '@/src/store/reducers/AuthSlice';
import { jwtDecode } from 'jwt-decode';
import { resetStoryState } from '../store/reducers/StorySlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const refreshAccessToken = async () => {
    try {
      const result = await refreshTokenMutation().unwrap();
      await Keychain.setGenericPassword(result.accessToken, '');
      return result.accessToken;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      handleLogout();
    }
  };

  const checkTokenExpiry = async () => {
    const credentials = await Keychain.getGenericPassword();

    if (credentials) {
      const accessToken = credentials.password;

      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          return await refreshAccessToken();
        }
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
        handleLogout();
      }
    } else {
      console.warn('Учетные данные не найдены при проверке истечения токена.');
    }
  };

  const handleLogout = async () => {
    await Keychain.resetGenericPassword();
    dispatch(resetStoryState());
    dispatch(logout());
  };

  return { checkTokenExpiry, handleLogout };
};

export default useAuth;