import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  Button,
  Modal,
  Portal,
  Text,
  RadioButton,
  Divider,
  Chip,
  HelperText,
  ActivityIndicator,
  TextInput,
} from 'react-native-paper';
import {
  DatePickerInput,
  TimePickerModal,
  en,
  es,
  registerTranslation,
} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import {VehicleListFilters} from '../../lib/types/vehicles.ts';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import useApi from '../../lib/hooks/useApi.ts';
import i18n from 'i18next';

type Types = {id: number; name: string; description?: string};
type Brands = {id: number; name: string; country_code?: string};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: VehicleListFilters) => void;
  initialValues: VehicleListFilters;
};

export default function VehicleFiltersSheet({
  visible,
  onDismiss,
  onApply,
  initialValues,
}: Props) {
  const theme = useTheme();
  const {t} = useTranslation();
  const api = useApi();

  const [local, setLocal] = useState<VehicleListFilters>(initialValues);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [types, setTypes] = useState<Types[]>([]);
  registerTranslation('en', en);
  registerTranslation('es', es);

  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const use24 = !/^en(-|$)/i.test(i18n.language);

  const fmtTime = (d?: Date) =>
    new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d ?? new Date());

  const canApply = useMemo(() => {
    if ((local.startAt && !local.endAt) || (!local.startAt && local.endAt))
      return false;
    return !(local.startAt && local.endAt && local.endAt < local.startAt);
  }, [local.startAt, local.endAt]);

  const reset = () =>
    setLocal({
      q: '',
      sort: 'created_at',
      order: 'desc',
      brand_id: undefined,
      type_id: undefined,
      startAt: undefined,
      endAt: undefined,
    });

  const fetchTypes = () => {
    api.getVehicleTypes().handle({
      onSuccess: res => setTypes(res),
      onFinally: () => setLoading(false),
    });
  };
  const fetchBrands = () => {
    api.getVehicleBrands().handle({
      onSuccess: res => setBrands(res),
      onFinally: () => setLoading(false),
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchTypes();
    fetchBrands();
  }, []);

  if (loading && (brands.length === 0 || types.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          margin: 16,
          borderRadius: 16,
          backgroundColor: theme.colors.background,
          maxHeight: '85%',
          overflow: 'hidden',
        }}>
        <ScrollView
          contentContainerStyle={{padding: 16}}
          keyboardShouldPersistTaps="handled">
          <Text variant="titleMedium" style={{marginBottom: 20}}>
            {t('vehicles.filters.filters')}
          </Text>

          {/* Sort + Order */}
          <Text style={{marginBottom: 6}}>{t('vehicles.filters.sortBy')}</Text>
          <RadioButton.Group
            onValueChange={v => setLocal(p => ({...p, sort: v as any}))}
            value={local.sort}>
            <RadioButton.Item
              label={t('vehicles.filters.newest')}
              value="created_at"
            />
            <RadioButton.Item
              label={t('vehicles.filters.pricePerDay')}
              value="price_per_day"
            />
          </RadioButton.Group>

          <View style={{flexDirection: 'row', gap: 8, marginVertical: 8}}>
            <Chip
              selected={local.order === 'asc'}
              disabled={local.sort !== 'price_per_day'}
              onPress={() => setLocal(p => ({...p, order: 'asc'}))}>
              {t('vehicles.filters.orderAsc')}
            </Chip>
            <Chip
              selected={local.order === 'desc'}
              disabled={local.sort !== 'price_per_day'}
              onPress={() => setLocal(p => ({...p, order: 'desc'}))}>
              {t('vehicles.filters.orderDesc')}
            </Chip>
          </View>

          <Divider style={{marginVertical: 8}} />

          {/* Brand */}
          <Text style={{marginBottom: 6}}>{t('vehicles.filters.brand')}</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 8,
            }}>
            <Chip
              selected={!local.brand_id}
              onPress={() => setLocal(p => ({...p, brand_id: undefined}))}>
              {t('common.any')}
            </Chip>
            {brands.map(b => (
              <Chip
                key={b.id}
                selected={local.brand_id === b.id}
                onPress={() =>
                  setLocal(p => ({
                    ...p,
                    brand_id: p.brand_id === b.id ? undefined : b.id,
                  }))
                }>
                {b.name}
              </Chip>
            ))}
          </View>

          {/* Type */}
          <Text style={{marginBottom: 6}}>{t('vehicles.filters.type')}</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 8,
            }}>
            <Chip
              selected={!local.type_id}
              onPress={() => setLocal(p => ({...p, type_id: undefined}))}>
              {t('common.any')}
            </Chip>
            {types.map(tp => (
              <Chip
                key={tp.id}
                selected={local.type_id === tp.id}
                onPress={() =>
                  setLocal(p => ({
                    ...p,
                    type_id: p.type_id === tp.id ? undefined : tp.id,
                  }))
                }>
                {t(`vehicles.type.${tp.name}`)}
              </Chip>
            ))}
          </View>

          <Divider style={{marginVertical: 8}} />

          {/* Dates */}
          <Text style={{marginBottom: 6}}>{t('vehicles.filters.dates')}</Text>
          <View style={{flexDirection: 'row', gap: 8}}>
            <DatePickerInput
              locale={i18n.language}
              label={t('vehicles.startDate')}
              value={local.startAt}
              onChange={d => {
                if (!d) return setLocal(p => ({...p, startAt: undefined}));
                // si no había hora previa, inicializa con hora actual
                const prev = local.startAt;
                const baseNow = new Date();
                const merged = new Date(d);
                merged.setHours(
                  prev?.getHours() ?? baseNow.getHours(),
                  prev?.getMinutes() ?? baseNow.getMinutes(),
                  0,
                  0,
                );
                setLocal(p => ({...p, startAt: merged}));
              }}
              inputMode="start"
              mode="outlined"
              style={{flex: 1}}
            />
            <DatePickerInput
              locale={i18n.language}
              label={t('vehicles.endDate')}
              value={local.endAt}
              onChange={d => {
                if (!d) return setLocal(p => ({...p, endAt: undefined}));
                const prev = local.endAt;
                const baseNow = new Date();
                const merged = new Date(d);
                merged.setHours(
                  prev?.getHours() ?? baseNow.getHours(),
                  prev?.getMinutes() ?? baseNow.getMinutes(),
                  0,
                  0,
                );
                setLocal(p => ({...p, endAt: merged}));
              }}
              inputMode="end"
              mode="outlined"
              style={{flex: 1}}
            />
          </View>

          {/* Times (start & end) */}
          <View style={{flexDirection: 'row', gap: 8, marginTop: 8}}>
            {/* Start time */}
            <View style={{flex: 1}}>
              <Text style={{marginBottom: 6}}>
                {t('vehicles.startTime') || 'Start time'}
              </Text>
              <TextInput
                mode="outlined"
                value={fmtTime(local.startAt)}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="clock-outline"
                    onPress={() => local.startAt && setStartTimeOpen(true)}
                  />
                }
                onPressIn={() => local.startAt && setStartTimeOpen(true)}
                disabled={!local.startAt}
              />
            </View>

            {/* End time */}
            <View style={{flex: 1}}>
              <Text style={{marginBottom: 6}}>
                {t('vehicles.endTime') || 'End time'}
              </Text>
              <TextInput
                mode="outlined"
                value={fmtTime(local.endAt)}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="clock-outline"
                    onPress={() => local.endAt && setEndTimeOpen(true)}
                  />
                }
                onPressIn={() => local.endAt && setEndTimeOpen(true)}
                disabled={!local.endAt}
              />
            </View>
          </View>

          {/* Modals de hora */}
          <TimePickerModal
            visible={startTimeOpen}
            onDismiss={() => setStartTimeOpen(false)}
            onConfirm={({hours, minutes}) => {
              const base = local.startAt ?? new Date();
              const merged = new Date(base);
              merged.setHours(hours, minutes, 0, 0);
              setLocal(p => ({...p, startAt: merged}));
              setStartTimeOpen(false);
            }}
            hours={(local.startAt ?? new Date()).getHours()}
            minutes={(local.startAt ?? new Date()).getMinutes()}
            use24HourClock={use24}
            locale={i18n.language}
            label={t('common.selectTime')}
          />

          <TimePickerModal
            visible={endTimeOpen}
            onDismiss={() => setEndTimeOpen(false)}
            onConfirm={({hours, minutes}) => {
              const base = local.endAt ?? new Date();
              const merged = new Date(base);
              merged.setHours(hours, minutes, 0, 0);
              setLocal(p => ({...p, endAt: merged}));
              setEndTimeOpen(false);
            }}
            hours={(local.endAt ?? new Date()).getHours()}
            minutes={(local.endAt ?? new Date()).getMinutes()}
            use24HourClock={use24}
            locale={i18n.language}
            label={t('common.selectTime')}
          />

          <HelperText type={canApply ? 'info' : 'error'} visible>
            {canApply
              ? t('vehicles.filters.dateHint')
              : t('vehicles.filters.dateError')}
          </HelperText>

          {/* Actions */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <Button onPress={reset}>{t('common.reset')}</Button>
            <View style={{flexDirection: 'row', gap: 8}}>
              <Button onPress={onDismiss}>{t('common.cancel')}</Button>
              <Button
                testID="filters-apply"
                mode="contained"
                disabled={!canApply}
                onPress={() => onApply(local)}>
                {t('common.apply')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footerLoading: {
    paddingVertical: 16,
  },
  footerEnd: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 10,
  },
});
