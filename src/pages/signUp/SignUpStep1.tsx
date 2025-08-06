import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Field, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import FormikEmailInput from '../../components/formik/FormikEmailInput.tsx';
import FormikPasswordInput from '../../components/formik/FormikPasswordInput.tsx';
import {Button} from 'react-native-paper';
import FormikTextInput from '../../components/formik/FormikTextInput.tsx';

interface SignUpStep1Props {
  onNext?: (data: {}) => void;
}

export default function SignUpStep1({onNext}: SignUpStep1Props) {
  const {t} = useTranslation();

  const initialValues = {
    firstName: 'Juan',
    lastName: 'Perez',
    email: 'test@davilozo.com',
    password: 'Password123@',
    confirmPassword: 'Password123@',
    context: 'APP',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is a required field'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(
        /[@$!%*?&#]/,
        'Password must contain at least one special character',
      )
      .required('Password is a required field'),
    confirmPassword: Yup.string().required(
      'Confirm Password is a required field',
    ),
    context: Yup.string()
      .oneOf(['APP', 'WEB'], 'Invalid context') // adjust options based on your use case
      .required('Context is required'),
  });

  const onNextPress = () => {
    if (onNext) {
      onNext(formik.values);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onNextPress,
  });

  return (
    <FormikProvider value={formik}>
      <View style={styles.fields}>
        <Field
          component={FormikTextInput}
          name="firstName"
          label={t('signUp.firstName')}
          placeholder={t('signUp.firstNamePlaceholder')}
        />

        <Field
          component={FormikTextInput}
          name="lastName"
          label={t('signUp.lastName')}
          placeholder={t('signUp.lastNamePlaceholder')}
        />

        <Field
          component={FormikEmailInput}
          name="email"
          label={t('signUp.email')}
          placeholder={t('signUp.emailPlaceholder')}
        />

        <Field
          component={FormikPasswordInput}
          name="password"
          label={t('signUp.password')}
          placeholder={t('signUp.passwordPlaceholder')}
        />

        <Field
          component={FormikPasswordInput}
          name="confirmPassword"
          label={t('signUp.confirmPassword')}
          placeholder={t('signUp.confirmPasswordPlaceholder')}
        />
        <Button mode="contained" onPress={onNextPress} style={styles.button}>
          {t('common.next')}
        </Button>
      </View>
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 20,
  },
  button: {
    marginTop: 24,
    marginBottom: 12,
  },
});
