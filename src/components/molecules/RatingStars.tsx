import React from 'react';
import {View, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  value: number; // 0..5
  onChange?: (v: number) => void;
  size?: number;
  disabled?: boolean;
  testID?: string;
};

export default function RatingStars({
  value,
  onChange,
  size = 28,
  disabled,
  testID,
}: Props) {
  return (
    <View style={{flexDirection: 'row'}} testID={testID}>
      {[1, 2, 3, 4, 5].map(n => {
        const filled = n <= value;
        const color = filled ? '#FFB300' : '#C8C8C8';
        return (
          <Pressable
            key={n}
            disabled={disabled}
            onPress={() => onChange?.(n)}
            style={{paddingHorizontal: 2, paddingVertical: 4}}
            accessibilityRole="button"
            accessibilityLabel={`rate-${n}`}>
            <Icon
              name={filled ? 'star' : 'star-border'}
              size={size}
              color={color}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
