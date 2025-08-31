import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
} from 'react-native-paper';
import {
  DatePickerInput,
  en,
  es,
  registerTranslation,
} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import {VehicleListFilters} from '../../lib/types/vehicles.ts';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import useApi from '../../lib/hooks/useApi.ts';
import i18n from 'i18next';

type Types = {
  id: number;
  name: string;
  description?: string;
};

type Brands = {
  id: number;
  name: string;
  country_code?: string;
};

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

  const canApply = useMemo(() => {
    // Require both dates if one is set (your stated requirement)
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
      onSuccess: res => {
        setTypes(res);
      },
      onFinally: () => {
        setLoading(false);
      },
    });
  };

  const fetchBrands = () => {
    api.getVehicleBrands().handle({
      onSuccess: res => {
        setBrands(res);
      },
      onFinally: () => {
        setLoading(false);
      },
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
          padding: 16,
        }}>
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

        {/* Brand / Type selections (simple Chips list) */}
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
          {types.map(types => (
            <Chip
              key={types.id}
              selected={local.type_id === types.id}
              onPress={() =>
                setLocal(p => ({
                  ...p,
                  type_id: p.type_id === types.id ? undefined : types.id,
                }))
              }>
              {t(`vehicles.type.${types.name}`)}
            </Chip>
          ))}
        </View>
        {t.name}
        <Divider style={{marginVertical: 8}} />

        {/* Dates */}
        <Text style={{marginBottom: 6}}>{t('vehicles.filters.dates')}</Text>
        <View style={{flexDirection: 'row', gap: 8}}>
          <DatePickerInput
            locale={i18n.language}
            label={t('vehicles.startDate')}
            value={local.startAt}
            onChange={d => setLocal(p => ({...p, startAt: d ?? undefined}))}
            inputMode="start"
            mode="outlined"
            style={{flex: 1}}
          />
          <DatePickerInput
            locale={i18n.language}
            label={t('vehicles.endDate')}
            value={local.endAt}
            onChange={d => setLocal(p => ({...p, endAt: d ?? undefined}))}
            inputMode="end"
            mode="outlined"
            style={{flex: 1}}
          />
        </View>
        <HelperText type={canApply ? 'info' : 'error'} visible>
          {
            canApply
              ? t('vehicles.filters.dateHint') // e.g. “Select both dates to filter by availability”
              : t('vehicles.filters.dateError') // e.g. “Start and end dates must be set and valid”
          }
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
              mode="contained"
              disabled={!canApply}
              onPress={() => onApply(local)}>
              {t('common.apply')}
            </Button>
          </View>
        </View>
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
  title: {padding: 10},
});
