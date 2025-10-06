import React from 'react';
import {Image, View} from 'react-native';
import BaseModal from './modal';
import {Text} from 'react-native-paper';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  uri?: string | null;
  title?: string;
};

export default function DocPreviewModal({
  visible,
  onDismiss,
  uri,
  title,
}: Props) {
  return (
    <BaseModal
      isVisible={visible}
      onDismiss={onDismiss}
      title={title ?? 'Preview'}
      content={
        uri ? (
          <Image
            source={{uri}}
            style={{
              width: '100%',
              height: 300,
              borderRadius: 8,
              backgroundColor: '#eee',
            }}
            resizeMode="contain"
          />
        ) : (
          <View
            style={{
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>No preview available</Text>
          </View>
        )
      }
      actions={[{text: 'Close', onPress: onDismiss}]}
    />
  );
}
