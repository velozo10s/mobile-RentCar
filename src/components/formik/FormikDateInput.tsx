import React, {useEffect} from 'react';
import {FormikSelectInputProps} from '../../lib/types/formik.ts';
import {DatePickerInput} from 'react-native-paper-dates';
import {en, registerTranslation} from 'react-native-paper-dates';

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

  // seed the initial value if provided
  useEffect(() => {
    if (defaultValue != null && !field.value) {
      form.setFieldValue(field.name, defaultValue);
    }
  }, []);

  return (
    // <SelectInput
    //   value={field.value}
    //   onChange={val => {
    //     form.setFieldValue(field.name, val);
    //     form.setFieldTouched(field.name, true);
    //   }}
    //   label={label}
    //   placeholder={placeholder}
    //   options={options}
    //   onSearch={onSearch}
    //   style={style}
    //   {...rest}
    // />
    <DatePickerInput
      locale="en"
      label={label}
      placeholder={placeholder}
      value={field.value}
      onChange={val => {
        form.setFieldValue(field.name, val);
        form.setFieldTouched(field.name, true);
      }}
      inputMode="end"
      style={{
        marginTop: 10,
        marginBottom: -30,
      }}
      {...rest}
    />
  );
}
