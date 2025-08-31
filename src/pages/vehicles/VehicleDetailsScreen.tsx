import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {ActivityIndicator, Button, Chip, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {Vehicle} from '../../lib/types/vehicle.ts';
import {useNavigation} from '../../lib/hooks/useNavigation';
import useApi from '../../lib/hooks/useApi.ts';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import VehicleImageCarousel from '../../components/molecules/VehicleImageCaruosel.tsx';

type RouteParams = {id: number; startAt?: number; endAt?: number};

export default function VehicleDetailsScreen() {
  const {params} = useRoute<{key: string; name: string; params: RouteParams}>();
  const nav = useNavigation('HomeStack');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const theme = useTheme();

  const {t} = useTranslation();

  useEffect(() => {
    api.getVehicle(params.id).handle({
      onSuccess: res => setVehicle(res),
      onFinally: () => setLoading(false),
    });
  }, [params.id]);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  if (!vehicle) {
    return (
      <View
        style={{...styles.container, backgroundColor: theme.colors.background}}>
        <Text style={{textAlign: 'center', marginTop: 50}}>
          Vehicle not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.container,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}>
      <VehicleImageCarousel
        images={vehicle.images}
        height={190}
        borderRadius={12}
      />
      <Text variant="titleLarge">
        {vehicle.brand_name} {vehicle.model} ({vehicle.year})
      </Text>
      <Text variant="bodyMedium" style={{opacity: 0.7}}>
        {t(`vehicles.type.${vehicle.type_name}`)} •{' '}
        {t(`vehicles.transmission.${vehicle.transmission}`)} • {vehicle.seats}{' '}
        {t('vehicles.seats')}
      </Text>

      <View
        style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12}}>
        <Chip compact>{`$${Number(vehicle.price_per_day).toFixed(2)}${t(
          'vehicles.perDay',
        )}`}</Chip>
        <Chip compact>{`$${Number(vehicle.price_per_hour).toFixed(2)}${t(
          'vehicles.perHour',
        )}`}</Chip>
        <Chip compact>{vehicle.color}</Chip>
        <Chip compact>{t(`vehicles.fuel.${vehicle.fuel_type}`)}</Chip>
      </View>

      <Text style={{marginTop: 16}}>{vehicle.vehicle_type_description}</Text>
      {/*<Text style={{marginTop: 16}}>VIN: {vehicle.vin}</Text>*/}
      <Text style={{marginTop: 16}}>
        {t('vehicles.mileage')} {vehicle.mileage} km
      </Text>
      <Text>Insurance Fee: ${vehicle.insurance_fee}</Text>

      <Button
        mode="contained"
        style={{marginTop: 24}}
        onPress={() =>
          nav.navigate('ReservationForm', {
            id: vehicle.id,
            startAt: params.startAt ?? null,
            endAt: params.endAt ?? null,
          })
        }>
        {t('vehicles.bookNow')}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 8,
    marginBottom: 16,
  },
});
