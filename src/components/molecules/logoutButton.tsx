import {Button, useTheme} from 'react-native-paper';
import useApi from '../../lib/hooks/useApi.ts';
import {useStore} from '../../lib/hooks/useStore.ts';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';

export default function LogoutButton() {
  const api = useApi();
  const {userStore} = useStore();
  const theme = useTheme();
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const data = {
    refreshToken: userStore.refreshToken,
  };

  const logout = () => {
    setLoading(true);
    api.logout(data).handle({
      onSuccess: () => {
        userStore.logout();
      },
      onError: err => {
        console.log('Server replied with an error:', err.response);
      },
      onFinally: () => setLoading(false),
    });
  };

  return (
    <Button
      onPress={() => logout()}
      disabled={isLoading}
      loading={isLoading}
      textColor={theme.colors.error}
      style={{paddingBottom: 16}}>
      {!isLoading && t('settings.logout')}
    </Button>
  );
}
