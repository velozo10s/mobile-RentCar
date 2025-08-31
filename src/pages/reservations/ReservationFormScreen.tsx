import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import useApi from '../../lib/hooks/useApi.ts';
import {useNavigation} from '../../lib/hooks/useNavigation';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import {Field, FormikProvider, useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';
import FormikDateInput from '../../components/formik/FormikDateInput.tsx';
import FormikTextInput from '../../components/formik/FormikTextInput.tsx';
import rootStore from '../../lib/stores/rootStore.ts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type RouteParams = {id: number; startAt?: Date; endAt?: Date};

export default function ReservationFormScreen() {
  const {params} = useRoute<{key: string; name: string; params: RouteParams}>();
  const navigation = useNavigation('HomeStack');

  const [loading, setLoading] = useState(false);
  const api = useApi();
  const {t} = useTranslation();
  const theme = useTheme();

  const confirmReservation = (data: {
    startAt: Date | undefined;
    endAt: Date | undefined;
    vehicleIds: Number[];
    note: string;
  }) => {
    setLoading(true);
    api.createReservation(data).handle({
      onSuccess: () => {
        rootStore.uiStore.showSnackbar(
          t('snackBarMessages.bookSuccess'),
          'success',
          5000,
        );
        navigation.navigate('VehicleList');
      },
      onFinally: () => setLoading(false),
    });
  };

  const initialValues = {
    startAt: params.startAt ? params.startAt : new Date(),
    endAt: params.endAt,
    vehicleIds: [params.id],
    note: '',
  };

  const validationSchema = Yup.object({
    startAt: Yup.date().required('Start Date is a required field'),
    endAt: Yup.date().required('End Date is a required field'),
    note: Yup.string(),
  });

  const onConfirmPress = () => {
    confirmReservation(formik.values);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onConfirmPress,
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled">
      <ScrollView>
        <Text variant="titleLarge" style={styles.title}>
          Book your reservation
        </Text>
        <FormikProvider value={formik}>
          <View style={styles.fields}>
            <Field
              component={FormikDateInput}
              name="startAt"
              label={t('vehicles.startDate')}
              placeholder={t('vehicles.startDate')}
            />
            <Field
              component={FormikDateInput}
              name="endAt"
              label={t('vehicles.endDate')}
              placeholder={t('vehicles.endDate')}
            />
            <Field
              component={FormikTextInput}
              name="note"
              label="Note"
              placeholder="Note"
            />
            <Button
              mode="contained"
              onPress={onConfirmPress}
              disabled={loading}
              loading={loading}
              style={styles.button}>
              {!loading && t('vehicles.confirmReservation')}
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
    paddingTop: '50%',
  },
  title: {
    fontWeight: '700',
    marginBottom: 40,
  },
  fields: {
    gap: 80,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: -35,
  },
});
