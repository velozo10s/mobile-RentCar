import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Chip, Text, Button, Divider} from 'react-native-paper';
import type {Reservation} from '../../lib/types/reservations';
import {format, Locale} from 'date-fns';
import {es, enUS} from 'date-fns/locale';
import i18n from 'i18next';

type Props = {
  reservation: Reservation;
  onPress?: () => void; // go to details
};

const localeMap: Record<string, Locale> = {es, en: enUS, 'en-US': enUS};

function formatRange(startISO: string, endISO: string) {
  const loc = localeMap[i18n.language] ?? enUS;
  try {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const sTxt = format(s, 'PPp', {locale: loc});
    const eTxt = format(e, 'PPp', {locale: loc});
    return `${sTxt} → ${eTxt}`;
  } catch {
    return `${startISO} → ${endISO}`;
  }
}

const statusColor: Record<string, string | undefined> = {
  pending: '#f0ad4e', // naranja
  active: '#0275d8', // azul
  //completed: '#5cb85c', // verde
  confirmed: '#5cb85c', // verde
  cancelled: '#d9534f', // rojo
};

const ReservationCard = memo(({reservation, onPress}: Props) => {
  const status = reservation.status?.toLowerCase?.() ?? 'pending';
  const amount = Number(reservation.total_amount || 0);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <Text variant="titleMedium">
            {i18n.t('reservations.reservation')} #{reservation.id}
          </Text>
          <Chip
            compact
            mode="flat"
            style={{
              backgroundColor: statusColor[status] ?? '#6c757d', // fallback gris
            }}
            textStyle={{
              color: '#fff', // asegura contraste sobre fondos fuertes
              fontWeight: 'bold',
            }}>
            {i18n.t(`reservations.status.${status}`, status)}
          </Chip>
        </View>

        <Text variant="bodyMedium" style={{opacity: 0.8}}>
          {formatRange(reservation.start_at, reservation.end_at)}
        </Text>

        {!!reservation.note && (
          <Text variant="bodySmall" style={{opacity: 0.7}}>
            {i18n.t('reservations.note')}: {reservation.note}
          </Text>
        )}

        <Divider style={{marginVertical: 4}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text variant="labelLarge" style={{opacity: 0.7}}>
            {i18n.t('reservations.total')}
          </Text>
          <Text variant="titleMedium">
            {amount.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
          </Text>
        </View>
      </Card.Content>

      <Card.Actions
        style={{
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}>
        <Button mode="contained-tonal" onPress={onPress}>
          {i18n.t('common.viewDetails')}
        </Button>
      </Card.Actions>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    gap: 8,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ReservationCard;
