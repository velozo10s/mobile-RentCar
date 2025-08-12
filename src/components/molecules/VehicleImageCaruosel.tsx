// components/molecules/VehicleImageCarousel/index.tsx
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  Pressable,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export type VehicleImage = {url: string; is_primary: boolean};

type Props = {
  images: VehicleImage[];
  height?: number;
  borderRadius?: number;
  onImagePress?: (index: number) => void;
};

const DOT = 8;

const VehicleImageCarousel: React.FC<Props> = ({
  images,
  height = 220,
  borderRadius = 12,
  onImagePress,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList<VehicleImage>>(null);

  const data = useMemo(() => {
    const list = Array.isArray(images) ? images.filter(Boolean) : [];
    if (list.length) {
      // Sort so is_primary = true is first
      return [...list].sort(
        (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0),
      );
    }
    return [
      {
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8z/C/HwAF8gJ5m3+gYQAAAABJRU5ErkJggg==',
        is_primary: true,
      },
    ];
  }, [images]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w && w !== containerWidth) setContainerWidth(w);
  };

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!containerWidth) return;
      const newIndex = Math.round(
        e.nativeEvent.contentOffset.x / containerWidth,
      );
      setIndex(newIndex);
    },
    [containerWidth],
  );

  const renderItem = useCallback(
    ({item, index: i}: {item: VehicleImage; index: number}) => (
      <Pressable
        onPress={() => onImagePress?.(i)}
        style={{
          width: containerWidth || '100%', // fill until we know exact width
          height,
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: item.url}}
          style={{width: '100%', height: '100%', backgroundColor: '#eee'}}
          resizeMode="cover"
        />
      </Pressable>
    ),
    [containerWidth, height, onImagePress],
  );

  // IMPORTANT: wrapper needs width so onLayout fires with a real value
  return (
    <View
      onLayout={onLayout}
      style={{width: '100%', height, borderRadius, overflow: 'hidden'}}>
      <FlatList
        ref={flatRef}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate="fast"
        // enable snapping only after we know the width
        snapToInterval={containerWidth > 0 ? containerWidth : undefined}
        snapToAlignment="start"
        // pass getItemLayout only when width is known
        {...(containerWidth > 0
          ? {
              getItemLayout: (_: any, i: number) => ({
                length: containerWidth,
                offset: containerWidth * i,
                index: i,
              }),
            }
          : null)}
        removeClippedSubviews
        initialNumToRender={1}
        windowSize={2}
        style={{width: '100%', height}} // fill wrapper; items control exact width
      />

      {/* dots */}
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
        }}>
        {data.map((_, i) => (
          <View
            key={i}
            style={{
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor:
                i === index
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default VehicleImageCarousel;
