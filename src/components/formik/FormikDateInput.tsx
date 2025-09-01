import React, {useEffect} from 'react';
import {FormikSelectInputProps} from '../../lib/types/formik.ts';
import {DatePickerInput} from 'react-native-paper-dates';
import {en, es, registerTranslation} from 'react-native-paper-dates';
import i18n from 'i18next';

export default function FormikDateInput(props: FormikSelectInputProps) {
  const {
    field,
    form,
    options,
    label,
    placeholder,
    defaultValue,
    onSearch,
    style,
    ...rest
  } = props;
  registerTranslation('en', en);
  registerTranslation('es', es);

  // seed the initial value if provided
  useEffect(() => {
    if (defaultValue != null && !field.value) {
      form.setFieldValue(field.name, defaultValue);
    }
  }, []);

  return (
    <DatePickerInput
      locale={i18n.language} // so it follows your localization
      label={label}
      placeholder={placeholder}
      value={field.value}
      onChange={val => {
        form.setFieldValue(field.name, val);
        form.setFieldTouched(field.name, true);
      }}
      inputMode="end"
      mode={'outlined'}
      style={{
        marginTop: 10,
      }}
      {...rest}
    />
  );
}
