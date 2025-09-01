import React from 'react';
import {IconButton, Badge} from 'react-native-paper';
import {View} from 'react-native';

type Props = {
  onPress: () => void;
  activeCount?: number; // number of active filters to show as a badge
};

export default function FilterButton({onPress, activeCount = 0}: Props) {
  const showBadge = activeCount > 0;
  return (
    <View>
      <IconButton
        testID="filters-button"
        icon="filter-variant"
        onPress={onPress}
        accessibilityLabel="Open filters"
      />
      {showBadge && (
        <Badge style={{position: 'absolute', top: 4, right: 4}}>
          {activeCount}
        </Badge>
      )}
    </View>
  );
}
