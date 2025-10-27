import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  DatePickerInput,
  TimePickerModal,
  en,
  es,
  registerTranslation,
} from 'react-native-paper-dates';
import i18n from 'i18next';
import {FormikSelectInputProps} from '../../lib/types/formik';

// ⚠️ Registrar traducciones una sola vez a nivel de módulo
registerTranslation('en', en);
registerTranslation('es', es);

type FormikDateInputProps = FormikSelectInputProps & {
  /** Muestra el selector de hora además del de fecha */
  showTime?: boolean;
  /** Si guardás strings, el componente igual soporta Date | string | null */
  valueAs?: 'date' | 'iso'; // opcional, por si querés forzar salida
};

export default function FormikDateInput(props: FormikDateInputProps) {
  const {
    field,
    form,
    label,
    placeholder,
    defaultValue,
    style,
    showTime = true,
    ...rest
  } = props;

  // Normalizá a Date
  const value: Date | null = useMemo(() => {
    const v = field.value;
    if (!v) return null;
    return v instanceof Date ? v : new Date(v);
  }, [field.value]);

  const [timeVisible, setTimeVisible] = useState(false);

  // Seed inicial
  useEffect(() => {
    if (defaultValue != null && !field.value) {
      form.setFieldValue(field.name, defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFieldDate = useCallback(
    (d: Date | null) => {
      form.setFieldValue(field.name, d);
      form.setFieldTouched(field.name, true, false);
    },
    [field.name, form],
  );

  const handleDateChange = useCallback(
    (d?: Date) => {
      if (!d) return setFieldDate(null);
      // Si hay hora previa, la preservamos
      const prev = value ?? new Date();
      const merged = new Date(d);
      merged.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
      setFieldDate(merged);
    },
    [setFieldDate, value],
  );

  const handleTimeConfirm = useCallback(
    ({hours, minutes}: {hours: number; minutes: number}) => {
      const base = value ?? new Date();
      const merged = new Date(base);
      merged.setHours(hours, minutes, 0, 0);
      setFieldDate(merged);
      setTimeVisible(false);
    },
    [setFieldDate, value],
  );

  const use24 = useMemo(
    () => !/^en(-|$)/i.test(i18n.language),
    [i18n.language],
  );

  const timeLabel = useMemo(() => {
    if (!value) return placeholder ?? 'HH:mm';
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(value);
  }, [value, placeholder]);

  const pickerValue: Date | undefined = value ?? undefined;

  return (
    <View style={[{marginTop: 10, gap: 8}, style]}>
      <DatePickerInput
        locale={i18n.language}
        label={label}
        placeholder={placeholder}
        value={pickerValue}
        onChange={handleDateChange}
        inputMode="start"
        mode="outlined"
        {...rest} // <- acá pasan maximumDate, minimumDate, etc.
      />

      {showTime && (
        <>
          <TextInput
            mode="outlined"
            label={i18n.t('common.time') || 'Time'}
            value={timeLabel}
            editable={false}
            right={
              <TextInput.Icon
                icon="clock-outline"
                onPress={() => setTimeVisible(true)}
              />
            }
            onPressIn={() => setTimeVisible(true)}
          />

          <TimePickerModal
            visible={timeVisible}
            onDismiss={() => setTimeVisible(false)}
            onConfirm={handleTimeConfirm}
            hours={value?.getHours() ?? 12}
            minutes={value?.getMinutes() ?? 0}
            use24HourClock={use24}
            locale={i18n.language}
            label={i18n.t('common.selectTime') || 'Select time'}
          />
        </>
      )}
    </View>
  );
}
