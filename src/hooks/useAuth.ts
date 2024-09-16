import { useDispatch } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useRefreshTokenMutation } from '@/src/services/AuthService'; 
import { logout } from '@/src/store/reducers/AuthSlice';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const dispatch = useDispatch();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const refreshAccessToken = async () => {
    const credentials = await Keychain.getGenericPassword();

    if (credentials) {
      const refreshTokenValue = credentials.password;
      console.log('Используемый токен обновления');

      try {
        const result = await refreshTokenMutation({ refreshToken: refreshTokenValue }).unwrap();
        console.log('Получен новый токен доступа');

        await Keychain.setGenericPassword(result.accessToken, refreshTokenValue);
        return result.accessToken;
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
        handleLogout();
      }
    } else {
      console.warn('Учетные данные не найдены.');
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
          console.log('Токен истек, обновляем токен.');
          return await refreshAccessToken();
        } else {
          console.log('Токен всё ещё действителен.');
        }
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
        handleLogout();
      }
    } else {
      console.warn('Учетные данные не найдены при проверке истечения токена.');
    }
    return null;
  };

  const handleLogout = async () => {
    console.log('Выход из системы. Сбрасываем учетные данные.');
    await Keychain.resetGenericPassword();
    dispatch(logout());
  };

  return { checkTokenExpiry, handleLogout };
};

export default useAuth;