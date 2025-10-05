import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Chip,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import {Reservation} from '../../lib/types/reservations';
import {useNavigation} from '../../lib/hooks/useNavigation';
import i18n from 'i18next';
import {format, Locale} from 'date-fns';
import {es, enUS} from 'date-fns/locale';
import useApi from '../../lib/hooks/useApi.ts';
import {useTranslation} from 'react-i18next';
import {Rating} from '../../lib/types/ratings.ts';
import RatingStars from '../../components/molecules/RatingStars.tsx';
import ReservationRatingForm from '../../components/organisms/ReservationRatingForm.tsx';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type RouteParams = {id: number};
const localeMap: Record<string, Locale> = {es, en: enUS, 'en-US': enUS};

// ---- Colores de estado ----
const statusColor: Record<string, string | undefined> = {
  pending: '#FFC107', // warning
  confirmed: '#4CAF50', // success
  active: '#1976D2', // info
  completed: '#9E9E9E', // default
  declined: '#D32F2F', // error
  cancelled: '#D32F2F', // error
};

function formatRange(startISO?: string, endISO?: string) {
  const loc = localeMap[i18n.language] ?? enUS;
  if (!startISO || !endISO) return '';
  try {
    const s = new Date(startISO);
    const e = new Date(endISO);
    return `${format(s, 'PPp', {locale: loc})} → ${format(e, 'PPp', {
      locale: loc,
    })}`;
  } catch {
    return `${startISO} → ${endISO}`;
  }
}

export default function ReservationDetailsScreen() {
  const {params} = useRoute<{key: string; name: string; params: RouteParams}>();
  const nav = useNavigation('HomeStack');

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [loadingRating, setLoadingRating] = useState(true);

  const api = useApi();
  const {t} = useTranslation();
  const theme = useTheme();

  const fetchData = useCallback(() => {
    setLoading(true);
    api.getReservation(params.id).handle({
      onSuccess: data => setReservation(data),
      onFinally: () => {
        setLoading(false);
        setRefreshing(false);
      },
    });
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // fetch rating after reservation loads:
  useEffect(() => {
    if (!reservation) return;
    setLoadingRating(true);
    api.getReservationRating(reservation.id, 'customer_to_company').handle({
      onSuccess: r => {
        const rating = Array.isArray(r) ? r[0] ?? null : r ?? null;
        setMyRating(rating);
      },
      onFinally: () => setLoadingRating(false),
    });
  }, [reservation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const cancelReservation = () => {
    if (!reservation) return;
    Alert.alert(
      t('reservations.cancel.title'),
      t('reservations.cancel.alert'),
      [
        {text: t('common.no'), style: 'cancel'},
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => {
            api.cancelReservation(reservation.id).handle({
              onSuccess: () => {
                fetchData();
              },
            });
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  if (loading && !reservation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!reservation) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.centerText}>{t('reservations.notFound')}</Text>
        <Button style={styles.mt12} onPress={() => nav.goBack()}>
          {t('common.back')}
        </Button>
      </View>
    );
  }

  const amount = Number(reservation.total_amount || 0);
  const statusKey = (reservation.status || 'pending').toLowerCase();
  const statusLabel = t(`reservations.status.${statusKey}`);

  const now = new Date();
  const ended = reservation ? new Date(reservation.end_at) <= now : false;
  const canRate =
    reservation && reservation.status?.toLowerCase?.() === 'completed' && ended;

  const range = formatRange(reservation.start_at, reservation.end_at);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}
      enableOnAndroid={true}
      extraScrollHeight={70}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled">
      <ScrollView
        contentContainerStyle={{
          gap: 10,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.headerRow}>
          <Text variant="titleLarge">
            {t('reservations.reservation')} #{reservation.id}
          </Text>
          <Chip
            compact
            mode="flat"
            style={[
              styles.chip,
              {backgroundColor: statusColor[statusKey] ?? '#6c757d'},
            ]}
            textStyle={styles.chipText}>
            {statusLabel}
          </Chip>
        </View>

        <Text variant="bodyMedium" style={styles.mutedText}>
          {range}
        </Text>

        {!!reservation.note && (
          <Text variant="bodyMedium">
            <Text style={styles.noteLabel}>{t('reservations.note')}: </Text>
            {reservation.note}
          </Text>
        )}

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.itemsTitle}>
          {t('reservations.items')}
        </Text>

        <View style={styles.itemsList}>
          {reservation.items?.length ? (
            reservation.items.map((it, idx) => {
              const title =
                [it.brand_name, it.model, it.year].filter(Boolean).join(' ') ||
                `${t('reservations.vehicle')} #${it.vehicle_id}`;

              return (
                <View key={`${it.vehicle_id}-${idx}`} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text variant="labelLarge" numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.itemMeta} numberOfLines={1}>
                      {t('reservations.vehicle')} #{it.vehicle_id}
                    </Text>
                  </View>

                  <Text variant="titleSmall" style={styles.itemAmount}>
                    {Number(it.line_amount ?? 0).toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyItems}>
              <Text style={styles.mutedText}>—</Text>
            </View>
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.totalRow}>
          <Text variant="labelLarge" style={styles.totalLabel}>
            {t('reservations.total')}
          </Text>
          <Text variant="titleMedium">
            {amount.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
          </Text>
        </View>

        <Divider style={{marginVertical: 8}} />

        <View style={{gap: 8}}>
          <Text variant="titleMedium">{i18n.t('ratings.sectionTitle')}</Text>

          {loadingRating ? (
            <ActivityIndicator />
          ) : myRating ? (
            // Read-only view of existing rating
            <View
              style={{
                backgroundColor: '#0000000A',
                padding: 12,
                borderRadius: 12,
                gap: 6,
              }}>
              <Text>{t('ratings.yourRating')}</Text>
              <RatingStars value={myRating.score} disabled />
              {!!myRating.comment && (
                <Text style={{opacity: 0.8}}>{myRating.comment}</Text>
              )}
              <Text style={{opacity: 0.6, fontSize: 12}}>
                {t('ratings.submittedAt', {
                  date: new Date(myRating.created_at).toLocaleString(),
                })}
              </Text>
            </View>
          ) : canRate ? (
            // Creation form (customer → company)
            <ReservationRatingForm
              reservationId={reservation.id}
              direction="customer_to_company"
              onCreated={r => setMyRating(r)}
            />
          ) : (
            <Text style={{opacity: 0.7}}>{t('ratings.notEligible')}</Text>
          )}
        </View>

        <View style={styles.actionsRow}>
          {statusKey === 'pending' && (
            <Button mode="contained" onPress={cancelReservation}>
              {t('reservations.cancel.button')}
            </Button>
          )}
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  centerText: {
    textAlign: 'center',
  },
  mt12: {
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ---- Chip ----
  chip: {
    borderRadius: 16,
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  mutedText: {
    opacity: 0.8,
  },
  noteLabel: {
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  itemsTitle: {
    marginBottom: 6,
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#00000008',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    opacity: 0.7,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    alignSelf: 'center',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemMeta: {
    opacity: 0.7,
  },
  itemAmount: {
    minWidth: 90,
    textAlign: 'right',
  },
  emptyItems: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
