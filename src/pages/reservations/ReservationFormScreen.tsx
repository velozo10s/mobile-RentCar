import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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

type RouteParams = {vehicleId: number};

export default function ReservationFormScreen() {
  const {params} = useRoute<{key: string; name: string; params: RouteParams}>();
  const navigation = useNavigation('HomeStack');

  const [loading, setLoading] = useState(false);
  const api = useApi();
  const {t} = useTranslation();
  const theme = useTheme();

  const confirmReservation = (data: {
    startAt: Date;
    endAt: Date;
    vehicleIds: Number[];
    note: string;
  }) => {
    setLoading(true);
    api.createReservation(data).handle({
      onSuccess: res => {
        rootStore.uiStore.showSnackbar('Success!!!', 'success');
        navigation.navigate('VehicleList');
      },
      onError: err => {
        //@ts-ignore
        rootStore.uiStore.showSnackbar(err.response.data.error, 'danger');
      },
      successMessage: 'Se ha registrado su reserva.',
      onFinally: () => setLoading(false),
    });
    // api.login(data).handle({
    //   onSuccess: res => {
    //     //.userStore.setAuth(res);
    //   },
    //   onError: err => {
    //     //@ts-ignore
    //     //rootStore.uiStore.showSnackbar(err.response.data.error, 'danger');
    //   },
    //   successMessage: t('snackBarMessages.loginSuccess'),
    //   //errorMessage: t('snackBarMessages.loginError'),
    //   onFinally: () => setLoading(false),
    // });
  };

  const initialValues = {
    startAt: new Date(),
    endAt: new Date(),
    vehicleIds: [params.vehicleId],
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
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="titleLarge" style={styles.title}>
        Book your reservation
      </Text>
      {/*<DatePickerInput*/}
      {/*  locale="en"*/}
      {/*  label="Start Date"*/}
      {/*  value={startAt}*/}
      {/*  onChange={d => setStartAt(d)}*/}
      {/*  inputMode="start"*/}
      {/*/>*/}
      {/*<DatePickerInput*/}
      {/*  locale="en"*/}
      {/*  label="End Date"*/}
      {/*  value={endAt}*/}
      {/*  onChange={d => setEndAt(d)}*/}
      {/*  inputMode="end"*/}
      {/*/>*/}
      {/*<TextInput*/}
      {/*  label="Note"*/}
      {/*  value={note}*/}
      {/*  onChangeText={setNote}*/}
      {/*  style={{marginTop: 16}}*/}
      {/*  multiline*/}
      {/*/>*/}
      {/*<Button*/}
      {/*  mode="contained"*/}
      {/*  style={{marginTop: 24}}*/}
      {/*  onPress={handleSubmit}*/}
      {/*  loading={loading}*/}
      {/*  disabled={!startAt || !endAt || loading}>*/}
      {/*  Confirm Reservation*/}
      {/*</Button>*/}
      <FormikProvider value={formik}>
        <View style={styles.fields}>
          <Field
            component={FormikDateInput}
            name="startAt"
            label="Start Date"
            placeholder="Start Date"
          />
          <Field
            component={FormikDateInput}
            name="endAt"
            label="End Date"
            placeholder="End Date"
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
    </View>
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
