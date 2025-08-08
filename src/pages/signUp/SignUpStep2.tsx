import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Field, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {Button} from 'react-native-paper';
import FormikSelectInput from '../../components/formik/FormikSelectInput.tsx';
import {SUPPORTED_DOCUMENTS} from '../../lib/constants/documents.ts';
import {SelectInputOptionsProp} from '../../lib/types/selectInput.ts';
import FormikTextInput from '../../components/formik/FormikTextInput.tsx';
import FormikPhoneInput from '../../components/formik/FormikPhoneInput.tsx';
import FormikEmailInput from '../../components/formik/FormikEmailInput.tsx';

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
    birthDate: '1970-01-01',
    username: 'jperez',
  };

  const validationSchema = Yup.object({
    documentType: Yup.string()
      .oneOf(['CI', 'PASSPORT'], 'Invalid document type') // adjust enum values if necessary
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
    birthDate: Yup.date().required('Birth date is required'),
    username: Yup.string().required('Username is required'),
  });

  const onSignUpPress = () => {
    if (onNext) {
      onNext(formik.values);
    }
  };

  const onBackPress = () => {
    //signUp(formik.values);
    if (onBack) {
      onBack();
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSignUpPress,
  });

  const documentOptions: SelectInputOptionsProp[] = useMemo(
    () =>
      SUPPORTED_DOCUMENTS.map(doc => ({
        id: doc.id,
        value: t(doc.labelKey),
      })),
    [t],
  );

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
        <Field
          component={FormikTextInput}
          name="birthDate"
          label={t('signUp.birthDate')}
          placeholder={t('signUp.birthDatePlaceholder')}
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
            onPress={onSignUpPress}
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
  fields: {
    gap: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 24,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 24,
  },
  flexButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
