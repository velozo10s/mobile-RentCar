import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Text, Chip} from 'react-native-paper';
import {en, es, registerTranslation} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../lib/hooks/useAppTheme.ts';

type filters = 'all' | 'pending' | 'active' | 'completed' | 'cancelled';

type status = {
  id: filters;
  labelKey: string;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onApply: (status: status) => void;
  initialValues: status;
};

const SUPPORTED_LANGUAGES: status[] = [
  {id: 'all', labelKey: 'reservations.status.all'},
  {id: 'pending', labelKey: 'reservations.status.pending'},
  {id: 'active', labelKey: 'reservations.status.active'},
  {id: 'completed', labelKey: 'reservations.status.completed'},
  {id: 'cancelled', labelKey: 'reservations.status.cancelled'},
];

export default function ReservationsFiltersSheet({
  visible,
  onDismiss,
  onApply,
  initialValues,
}: Props) {
  const theme = useTheme();
  const {t} = useTranslation();

  const [status, setStatus] = useState<status>(initialValues);
  registerTranslation('en', en);
  registerTranslation('es', es);

  const reset = () =>
    setStatus({
      id: 'all',
      labelKey: 'reservations.status.all',
    });

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
          {t('reservations.filters')}
        </Text>

        <Text style={{marginBottom: 6}}>{t('reservations.status.label')}</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 8,
            }}>
            {SUPPORTED_LANGUAGES.map(b => (
              <Chip
                key={b.id}
                selected={status.id === b.id}
                onPress={() => setStatus({id: b.id, labelKey: b.labelKey})}>
                {t(b.labelKey)}
              </Chip>
            ))}
          </View>
        </View>

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
              onPress={() => onApply(status)}>
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
  select: {
    marginTop: 16,
    backgroundColor: 'transparent',
  },
});
