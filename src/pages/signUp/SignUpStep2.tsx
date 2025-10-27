import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Field, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {Button} from 'react-native-paper';

import FormikSelectInput from '../../components/formik/FormikSelectInput.tsx';
import FormikTextInput from '../../components/formik/FormikTextInput.tsx';
import FormikPhoneInput from '../../components/formik/FormikPhoneInput.tsx';
import FormikEmailInput from '../../components/formik/FormikEmailInput.tsx';
import FormikDateInput from '../../components/formik/FormikDateInput.tsx';

import {SUPPORTED_DOCUMENTS} from '../../lib/constants/documents.ts';
import {SelectInputOptionsProp} from '../../lib/types/selectInput.ts';
import {
  yearsAgo,
  isAtLeastAge,
  formatYYYYMMDD,
} from '../../lib/helpers/date.ts'; // 👈

const ADULT_YEARS = 18;
const MAX_BIRTH_DATE = yearsAgo(ADULT_YEARS); // hoy - 18

interface SignUpStep2Props {
  onNext?: (data: {}) => void;
  onBack?: () => void;
}

export default function SignUpStep2({onBack, onNext}: SignUpStep2Props) {
  const {t} = useTranslation();
  const [loading] = React.useState(false);

  const initialValues = {
    documentType: 'CI',
    documentNumber: '1111111',
    phoneNumber: '+595982471257',
    nationalityCode: 'PY',
    // Sugerencia UX: iniciar en la fecha máxima para que el selector no parta de "hoy"
    birthDate: MAX_BIRTH_DATE,
    username: 'jperez',
  };

  const validationSchema = Yup.object({
    documentType: Yup.string()
      .oneOf(['CI', 'PASSPORT'], 'Invalid document type')
      .required('Document type is required'),
    documentNumber: Yup.string()
      .matches(/^[a-zA-Z0-9]{5,20}$/, 'Invalid document number')
      .required('Document number is required'),
    phoneNumber: Yup.string()
      .matches(/^\+?\d{7,15}$/, 'Invalid phone number format')
      .required('Phone number is required'),
    nationalityCode: Yup.string()
      .length(2, 'Nationality must be a 2-letter country code')
      .required('Nationality is required'),
    birthDate: Yup.date()
      .required('Birth date is required')
      .max(MAX_BIRTH_DATE, t('Debe ser mayor de 18 años')) // bloqueo por Yup
      .test('is-adult', t('Debe ser mayor de 18 años'), value =>
        value ? isAtLeastAge(new Date(value), ADULT_YEARS) : false,
      ),
    username: Yup.string().required('Username is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      // (opcional) enviar birthDate como string YYYY-MM-DD
      const payload = {
        ...formik.values,
        birthDate: formatYYYYMMDD(new Date(formik.values.birthDate)),
      };
      onNext?.(payload);
    },
  });

  const documentOptions: SelectInputOptionsProp[] = useMemo(
    () =>
      SUPPORTED_DOCUMENTS.map(doc => ({
        id: doc.id,
        value: t(doc.labelKey),
      })),
    [t],
  );

  const onBackPress = () => onBack?.();

  return (
    <FormikProvider value={formik}>
      <View style={styles.fields}>
        <Field
          component={FormikSelectInput}
          name="documentType"
          label={t('signUp.documentType')}
          placeholder={t('signUp.documentTypePlaceholder')}
          options={documentOptions}
          showSearch={false}
        />
        <Field
          component={FormikTextInput}
          name="documentNumber"
          label={t('signUp.documentNumber')}
          placeholder={t('signUp.documentNumberPlaceholder')}
        />
        <Field
          component={FormikPhoneInput}
          name="phoneNumber"
          label={t('signUp.phoneNumber')}
          placeholder={t('signUp.phoneNumberPlaceholder')}
        />
        <Field
          component={FormikTextInput}
          name="nationalityCode"
          label={t('signUp.nationalityCode')}
          placeholder={t('signUp.nationalityCodePlaceholder')}
        />

        {/*
         * FormikDateInput debería propagar props al DatePicker.
         * Si tu componente los soporta, pasá maximumDate={MAX_BIRTH_DATE}
         */}
        <Field
          component={FormikDateInput}
          name="birthDate"
          label={t('signUp.birthDate')}
          placeholder={t('signUp.birthDatePlaceholder')}
          maximumDate={MAX_BIRTH_DATE}
          showTime={false}
        />

        <Field
          component={FormikEmailInput}
          name="username"
          label={t('signUp.username')}
          placeholder={t('signUp.usernamePlaceholder')}
        />

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={onBackPress}
            loading={loading}
            style={styles.flexButton}>
            {t('common.back')}
          </Button>
          <Button
            mode="contained"
            onPress={formik.submitForm}
            loading={loading}
            style={styles.flexButton}>
            {t('common.next')}
          </Button>
        </View>
      </View>
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  fields: {gap: 20},
  buttonRow: {flexDirection: 'row', width: '100%', marginTop: 24},
  flexButton: {flex: 1, marginHorizontal: 4},
});
