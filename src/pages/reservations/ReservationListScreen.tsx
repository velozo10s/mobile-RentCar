import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, FlatList, RefreshControl, StyleSheet} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import {Reservation} from '../../lib/types/reservations';
import ReservationCard from '../../components/molecules/ReservationCard';
import {useNavigation} from '../../lib/hooks/useNavigation';
import useApi from '../../lib/hooks/useApi.ts';
import {useTranslation} from 'react-i18next';
import FilterButton from '../../components/molecules/FilterButton.tsx';
import ReservationsFiltersSheet from '../../components/organisms/ReservationsFiltersSheet.tsx';

type StatusTab = 'all' | 'pending' | 'active' | 'completed' | 'cancelled';

type status = {
  id: StatusTab;
  labelKey: string;
};

export default function ReservationListScreen() {
  const nav = useNavigation('ReservationStack');

  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const api = useApi();
  const theme = useTheme();
  const {t} = useTranslation();

  const [statusFilter, setStatusFilter] = useState<status>({
    id: 'all',
    labelKey: 'reservations.status.all',
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    api.listReservations({status: statusFilter.id}).handle({
      onSuccess: res => setData(res),
      onFinally: () => {
        setLoading(false);
        setRefreshing(false);
      },
    });
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const applyFilters = (f: status) => {
    setFiltersOpen(false);
    setStatusFilter(f);
  };

  const openFilters = () => setFiltersOpen(true);
  const closeFilters = () => setFiltersOpen(false);

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.title}>
          {t('reservations.title')}
        </Text>
        <FilterButton onPress={openFilters} />
      </View>
    ),
    [statusFilter],
  );

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <ReservationCard
            reservation={item}
            onPress={() => nav.navigate('ReservationDetails', {id: item.id})}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          !loading && data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('common.empty')}</Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />

      <ReservationsFiltersSheet
        visible={filtersOpen}
        onDismiss={closeFilters}
        onApply={applyFilters}
        initialValues={statusFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    paddingVertical: 24,
  },
  headerContainer: {
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  emptyContainer: {
    padding: 24,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  listContent: {
    paddingBottom: 16,
  },
});
