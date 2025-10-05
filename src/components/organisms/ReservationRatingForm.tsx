import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import RatingStars from '../molecules/RatingStars';

import rootStore from '../../lib/stores/rootStore';
import {Rating, RatingDirection} from '../../lib/types/ratings.ts';
import useApi from '../../lib/hooks/useApi.ts';
import {useTranslation} from 'react-i18next';

type Props = {
  reservationId: number;
  direction?: RatingDirection; // defaults to 'customer_to_company'
  onCreated?: (rating: Rating) => void;
};

export default function ReservationRatingForm({
  reservationId,
  direction = 'customer_to_company',
  onCreated,
}: Props) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const api = useApi();
  const theme = useTheme();
  const {t} = useTranslation();

  const valid = score >= 1 && score <= 5;

  const submit = () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    api
      .createReservationRating(reservationId, {direction, score, comment})
      .handle({
        onSuccess: rating => {
          rootStore.uiStore.showSnackbar(t('ratings.submitted'), 'success');
          onCreated?.(rating);
        },
        onError: () => {
          rootStore.uiStore.showSnackbar(t('ratings.submitError'), 'danger');
        },
        onFinally: () => setSubmitting(false),
      });
  };

  return (
    <View style={{gap: 12, backgroundColor: theme.colors.background}}>
      <Text variant="titleMedium">{t('ratings.title')}</Text>

      <RatingStars value={score} onChange={setScore} />

      <HelperText type={valid ? 'info' : 'error'} visible>
        {valid ? t('ratings.hint') : t('ratings.required')}
      </HelperText>

      <TextInput
        mode="outlined"
        label={t('ratings.comment')}
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Button
        mode="contained"
        onPress={submit}
        disabled={!valid || submitting}
        loading={submitting}>
        {t('ratings.submit')}
      </Button>
    </View>
  );
}
