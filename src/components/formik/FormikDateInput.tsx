import React, {useEffect, useState} from 'react';
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
// ajustá el tipo si tu proyecto usa otro
import {FormikSelectInputProps} from '../../lib/types/formik';

export default function FormikDateTimeInput(props: FormikSelectInputProps) {
  const {field, form, label, placeholder, defaultValue, style, ...rest} = props;

  // i18n de los pickers
  registerTranslation('en', en);
  registerTranslation('es', es);

  const [timeVisible, setTimeVisible] = useState(false);

  // por si guardás strings ISO en formik, normalizá a Date
  const value: Date | null = field.value ? new Date(field.value) : null;

  // seed inicial
  useEffect(() => {
    if (defaultValue != null && !field.value) {
      form.setFieldValue(field.name, defaultValue);
    }
  }, []);

  const handleDateChange = (d: Date | undefined) => {
    if (!d) {
      form.setFieldValue(field.name, null);
      return;
    }
    const prev = value ?? new Date();
    const merged = new Date(d);
    merged.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
    form.setFieldValue(field.name, merged);
    form.setFieldTouched(field.name, true);
  };

  const handleTimeConfirm = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    const base = value ?? new Date();
    const merged = new Date(base);
    merged.setHours(hours, minutes, 0, 0);
    form.setFieldValue(field.name, merged);
    form.setFieldTouched(field.name, true);
    setTimeVisible(false);
  };

  const timeLabel = value
    ? new Intl.DateTimeFormat(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(value)
    : placeholder ?? 'HH:mm';

  const use24 = !/^en(-|$)/i.test(i18n.language);
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
        {...rest}
      />

      {/* “Input” de hora que abre el TimePickerModal */}
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
    </View>
  );
}
