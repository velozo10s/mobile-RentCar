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
        contentContainerStyle={[
          styles.modalContent,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text variant="titleMedium" style={styles.title}>
          {t('reservations.filters')}
        </Text>

        <Text style={styles.label}>{t('reservations.status.label')}</Text>
        <View style={styles.chipWrapper}>
          {SUPPORTED_LANGUAGES.map(b => (
            <Chip
              key={b.id}
              selected={status.id === b.id}
              onPress={() => setStatus({id: b.id, labelKey: b.labelKey})}>
              {t(b.labelKey)}
            </Chip>
          ))}
        </View>

        <View style={styles.footer}>
          <Button onPress={reset}>{t('common.reset')}</Button>
          <View style={styles.footerButtons}>
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
  modalContent: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
