import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import {useTranslation} from 'react-i18next';
import MainSearchBar from '../../components/molecules/searchBar.tsx';
import MainFab from '../../components/molecules/fab.tsx';
import {
  ActivityIndicator,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import {useNavigation} from '../../lib/hooks/useNavigation.ts';
import VehicleCard from '../../components/molecules/VehicleCard.tsx';
import useApi from '../../lib/hooks/useApi.ts';
import {Vehicle} from '../../lib/types/vehicles.ts';
import rootStore from '../../lib/stores/rootStore.ts';

const PER_PAGE = 10;

export default function HomeScreen() {
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
  const [sort, setSort] = useState<'created_at' | 'price_per_day'>(
    'created_at',
  );
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [q, setQ] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setQ(searchText.trim()), 350);
    return () => clearTimeout(id);
  }, [searchText]);

  const fetchPage = useCallback(
    (nextPage: number, replace = false) => {
      const params = {
        status: 'available',
        page: nextPage,
        per_page: PER_PAGE,
        sort,
        order,
        q: q || undefined,
      };

      api.listVehicles(params).handle({
        onSuccess: res => {
          setHasMore(res.length === PER_PAGE);
          setPage(nextPage);
          setData(prev => (replace ? res : [...prev, ...res]));
        },
        onError: err => {
          setLoading(false);
          setRefreshing(false);
          //@ts-ignore
          rootStore.uiStore.showSnackbar(err.response.data.error, 'danger');
        },
        onFinally: () => {
          setLoading(false);
          setRefreshing(false);
        },
      });
    },
    [order, q, sort],
  );

  useEffect(() => {
    setLoading(true);
    fetchPage(1, true);
  }, [sort, order, fetchPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || refreshing) return;
    fetchPage(page + 1);
  }, [fetchPage, hasMore, loading, page, refreshing]);

  const ListHeader = (
    <View style={styles.headerContainer}>
      <SegmentedButtons
        value={sort}
        onValueChange={v => setSort(v as any)}
        buttons={[
          {value: 'created_at', label: t('vehicles.newest')},
          {value: 'price_per_day', label: t('vehicles.pricePerDay')},
        ]}
        style={{width: '85%'}}
      />
      <IconButton
        icon={order === 'desc' ? 'sort-descending' : 'sort-ascending'}
        onPress={() =>
          sort === 'price_per_day'
            ? setOrder(o => (o === 'desc' ? 'asc' : 'desc'))
            : null
        }
        accessibilityLabel="Toggle order"
      />
    </View>
  );

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <MainSearchBar
        text={searchText}
        onChangeText={setSearchText}
        placeholder={t('vehicles.search')}
      />
      <View
        style={{...styles.container, backgroundColor: theme.colors.background}}>
        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <VehicleCard
              vehicle={item}
              onPress={() => {
                navigation.navigate('VehicleDetails', {id: item.id});
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
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <MainFab />
      </View>
    </>
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
    flexDirection: 'row',
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
