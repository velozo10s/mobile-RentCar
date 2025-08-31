import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, Button, Chip, ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import type {Vehicle} from '../../lib/types/vehicles';
import {useTranslation} from 'react-i18next';

type Props = {vehicle: Vehicle; onPress?: () => void};

const VehicleCard = memo(({vehicle, onPress}: Props) => {
  const {t} = useTranslation();
  const dayPrice = Number(vehicle.price_per_day);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const uri = vehicle.primary_image || 'https://picsum.photos/900/600';

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.mediaWrapper}>
        {!failed ? (
          <>
            <FastImage
              style={styles.image}
              source={{
                uri,
                headers: {
                  'User-Agent': 'RentApp/1.0 (contacto@tuapp.com)',
                  Accept: 'image/*',
                  Referer: 'https://tuapp.example',
                },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                console.log('IMG ERROR', vehicle.id);
                setFailed(true);
                setLoading(false);
              }}
            />
            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            )}
          </>
        ) : (
          <View style={styles.fallback}>
            <Text>Sin imagen</Text>
          </View>
        )}
      </View>

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
  },
  mediaWrapper: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden', // acá sí es seguro, sin elevation
    backgroundColor: '#eee',
  },
  image: {width: '100%', height: '100%'},
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  cardContent: {paddingVertical: 10},
  subText: {opacity: 0.7, marginTop: 2},
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
