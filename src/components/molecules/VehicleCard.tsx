import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Card, Text, Button, Chip} from 'react-native-paper';
import type {Vehicle} from '../../lib/types/vehicles.ts';
import {useTranslation} from 'react-i18next';

type Props = {
  vehicle: Vehicle;
  onPress?: () => void;
};

const VehicleCard = memo(({vehicle, onPress}: Props) => {
  const dayPrice = Number(vehicle.price_per_day);
  // const hourPrice = Number(vehicle.price_per_hour);
  const {t} = useTranslation();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Image
        source={{uri: vehicle.primary_image}}
        style={styles.image}
        resizeMode="cover"
      />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium">
          {vehicle.brand_name} {vehicle.model} • {vehicle.year}
        </Text>
        <Text variant="bodyMedium" style={styles.subText}>
          {t(`vehicles.type.${vehicle.type_name}`)} •{' '}
          {t(`vehicles.transmission.${vehicle.transmission}`)}
        </Text>

        <View style={styles.chipContainer}>
          <Chip compact>{`$${dayPrice.toFixed(2)}${t(
            'vehicles.perDay',
          )}`}</Chip>
          {/*<Chip compact>{`$${hourPrice.toFixed(2)}${t(*/}
          {/*  'listVehicles.perHour',*/}
          {/*)}`}</Chip>*/}
          <Chip compact>{vehicle.color}</Chip>
          <Chip compact>{t(`vehicles.fuel.${vehicle.fuel_type}`)}</Chip>
        </View>
      </Card.Content>

      <Card.Actions style={styles.cardActions}>
        <Button mode="contained-tonal" onPress={onPress}>
          {t('vehicles.viewDetails')}
        </Button>
      </Card.Actions>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: '#eee',
  },
  cardContent: {
    paddingVertical: 10,
  },
  subText: {
    opacity: 0.7,
    marginTop: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});

export default VehicleCard;
