import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import {useTranslation} from 'react-i18next';
import MainSearchBar from '../../components/molecules/searchBar.tsx';
import MainFab from '../../components/molecules/fab.tsx';
import {ActivityIndicator, SegmentedButtons} from 'react-native-paper';
import {useNavigation} from '../../lib/hooks/useNavigation.ts';
import VehicleCard from '../../components/molecules/VehicleCard.tsx';
import useApi from '../../lib/hooks/useApi.ts';
import {Vehicle, VehicleListFilters} from '../../lib/types/vehicles.ts';
import i18n from 'i18next';
import FilterButton from '../../components/molecules/FilterButton.tsx';
import VehicleFiltersSheet from '../../components/organisms/VehicleFiltersSheet.tsx';

const PER_PAGE = 10;

export default function VehicleListScreen() {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation('HomeStack');
  const api = useApi();

  const [data, setData] = useState<Vehicle[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [q, setQ] = useState('');

  const [filters, setFilters] = useState<VehicleListFilters>({
    q: '',
    sort: 'created_at',
    order: 'desc',
    brand_id: undefined,
    type_id: undefined,
    startAt: undefined,
    endAt: undefined,
  });

  useEffect(() => {
    const id = setTimeout(() => setQ(searchText.trim()), 350);
    return () => clearTimeout(id);
  }, [searchText]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.q?.trim()) n++;
    if (filters.brand_id) n++;
    if (filters.type_id) n++;
    if (filters.startAt && filters.endAt) n++;
    if (!(filters.sort === 'created_at' && filters.order === 'desc')) n++;
    return n;
  }, [filters]);

  const fetchPage = useCallback(
    (nextPage: number, replace = false) => {
      const params = {
        page: nextPage,
        per_page: PER_PAGE,
        sort: filters.sort,
        order: filters.order,
        q: q || undefined,
        brand_id: filters.brand_id,
        type_id: filters.type_id,
        // send ISO strings only if both dates are valid
        ...(filters.startAt && filters.endAt
          ? {
              startAt: filters.startAt.toISOString(),
              endAt: filters.endAt.toISOString(),
            }
          : {}),
      };

      api.listVehicles(params).handle({
        onSuccess: res => {
          setHasMore(res.length === PER_PAGE);
          setPage(nextPage);
          setData(prev => (replace ? res : [...prev, ...res]));
        },
        onFinally: () => {
          setLoading(false);
          setRefreshing(false);
        },
      });
    },
    [filters, q],
  );

  useEffect(() => {
    setLoading(true);
    fetchPage(1, true);
  }, [filters.sort, filters.order, fetchPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || refreshing) return;
    fetchPage(page + 1);
  }, [fetchPage, hasMore, loading, page, refreshing]);

  // filter sheet
  const [filtersOpen, setFiltersOpen] = useState(false);
  const openFilters = () => setFiltersOpen(true);
  const closeFilters = () => setFiltersOpen(false);

  const applyFilters = (f: VehicleListFilters) => {
    setFiltersOpen(false);
    setFilters({
      ...f,
      q, // keep debounced q in sync with text input
    });
  };

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <SegmentedButtons
            value={filters.sort}
            onValueChange={v => setFilters(p => ({...p, sort: v as any}))}
            buttons={[
              {value: 'created_at', label: i18n.t('vehicles.filters.newest')},
              {
                value: 'price_per_day',
                label: i18n.t('vehicles.filters.pricePerDay'),
              },
            ]}
            style={{flex: 1}}
          />
          <FilterButton onPress={openFilters} activeCount={activeFilterCount} />
        </View>
      </View>
    ),
    [filters.sort, filters.order, searchText, activeFilterCount],
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
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <MainSearchBar
        text={searchText}
        onChangeText={setSearchText}
        placeholder={t('vehicles.search')}
      />
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <VehicleCard
            vehicle={item}
            onPress={() => {
              navigation.navigate('VehicleDetails', {
                id: item.id,
                startAt: filters.startAt?.getTime() ?? null,
                endAt: filters.endAt?.getTime() ?? null,
              });
            }}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator />
            </View>
          ) : (
            // <View style={styles.footerEnd}>
            //   <Text style={[styles.title, {color: theme.colors.primary}]}>
            //     No more vehicles
            //   </Text>
            // </View>
            <></>
          )
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyContainer}>
              <ActivityIndicator animating={false} />
              <Text style={{color: theme.colors.onBackground}}>
                {t('common.empty')}
              </Text>
            </View>
          )
        }
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <MainFab />
      <VehicleFiltersSheet
        visible={filtersOpen}
        onDismiss={closeFilters}
        onApply={applyFilters}
        initialValues={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
