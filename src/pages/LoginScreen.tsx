import React from 'react';
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from '../lib/hooks/useAppTheme.ts';
import {useTranslation} from 'react-i18next';
import useApi from '../lib/hooks/useApi.ts';
import {Field, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import FormikEmailInput from '../components/formik/FormikEmailInput.tsx';
import FormikPasswordInput from '../components/formik/FormikPasswordInput.tsx';
import {Button, Text} from 'react-native-paper';
import {useStore} from '../lib/hooks/useStore.ts';
import {useNavigation} from '../lib/hooks/useNavigation.ts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';

export default function LoginScreen() {
  const theme = useTheme();
  const {t} = useTranslation();
  const api = useApi();
  const rootStore = useStore();
  const navigation = useNavigation('AuthStack');
  const [loading, setLoading] = React.useState(false);

  const login = (data: {user: string; password: string; context: string}) => {
    setLoading(true);
    api.login(data).handle({
      onSuccess: res => {
        rootStore.userStore.setAuth(res);
        rootStore.uiStore.showSnackbar(
          i18n.t('snackBarMessages.loginSuccess', {
            username: rootStore.userStore.user?.username,
          }),
          'success',
        );
      },
      onFinally: () => setLoading(false),
    });
  };

  const initialValues = {
    user: '',
    password: '',
    context: 'APP',
  };

  const validationSchema = Yup.object({
    user: Yup.string()
      // .email('Invalid email')
      .required('User is a required field'),
    password: Yup.string().required('Password is a required field'),
  });

  const onLoginPress = () => {
    login(formik.values);
    Keyboard.dismiss();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onLoginPress,
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}
      enableOnAndroid={true}
      extraScrollHeight={5}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled">
      <ScrollView style={styles.scroll}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('login.title')}
        </Text>
        <FormikProvider value={formik}>
          <View style={styles.fields}>
            <Field
              testID="login-user"
              component={FormikEmailInput}
              name="user"
              label={t('login.user')}
              placeholder={t('login.userPlaceholder')}
            />
            <Field
              testID="login-password"
              component={FormikPasswordInput}
              name="password"
              label={t('login.password')}
              placeholder={t('login.passwordPlaceholder')}
            />
            <Button
              testID="login-submit"
              mode="contained"
              onPress={onLoginPress}
              disabled={loading}
              loading={loading}
              style={styles.button}>
              {!loading && t('login.loginButton')}
            </Button>
          </View>
          <Button
            mode="text"
            style={{paddingTop: 12}}
            onPress={() => navigation.navigate('ForgotPassword')}>
            {t('login.forgotPassword')}
          </Button>
          <View style={styles.footer}>
            <Text style={{color: theme.colors.onBackground}}>
              {t('login.noAccount')}
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('SignUp')}
              style={{}}>
              {t('signUp.title')}
            </Button>
          </View>
        </FormikProvider>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scroll: {
    marginTop: '50%',
  },
  title: {
    fontWeight: '700',
    marginBottom: 32,
  },
  fields: {
    gap: 20,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
