import React, {useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import {useTranslation} from 'react-i18next';
import useApi from '../../lib/hooks/useApi.ts';
import {Text} from 'react-native-paper';
import {useStore} from '../../lib/hooks/useStore.ts';
import SignUpStep1 from './SignUpStep1.tsx';
import SignUpStep2 from './SignUpStep2.tsx';
//import ProgressBar from './ProgressBar.tsx';
//import rootStore from '../../lib/stores/rootStore.ts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen() {
  const [step, setStep] = useState(1);
  const theme = useTheme();
  const {t} = useTranslation();
  const api = useApi();
  const rootStore = useStore();
  //const [loading, setLoading] = React.useState(false);
  const [collectedData, setCollectedData] = useState({});

  const goNext = (data: {}) => {
    setCollectedData(prev => ({...prev, ...data}));
    setStep(step + 1);
  };

  const goBack = () => setStep(step - 1);

  const signUp = (data: {}) => {
    console.log('datos listos para enviar: ', JSON.stringify(data));
    //setLoading(true);
    api.signUp(data).handle({
      onSuccess: res => {
        rootStore.userStore.setAuth(res);
      },
      onError: err => {
        //@ts-ignore
        rootStore.uiStore.showSnackbar(err.response.data.error, 'danger');
      },
      successMessage: t('snackBarMessages.signUpSuccess'),
      //errorMessage: t('snackBarMessages.signUpError'),
      //onFinally: () => setLoading(false),
    });
  };

  const onSignUpPress = (data: {}) => {
    const finalData = {...collectedData, ...data};
    setCollectedData(finalData);
    signUp(finalData);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}
      enableOnAndroid={true}
      extraScrollHeight={160}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled">
      <ScrollView>
        <Text variant="headlineLarge" style={styles.title}>
          {t('signUp.title')}
        </Text>
        {/*<ProgressBar currentStep={step} total={2} />*/}
        {step === 1 && <SignUpStep1 onNext={goNext} />}
        {step === 2 && <SignUpStep2 onNext={onSignUpPress} onBack={goBack} />}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: '25%',
  },
  title: {
    fontWeight: '700',
    marginBottom: 32,
  },
});
