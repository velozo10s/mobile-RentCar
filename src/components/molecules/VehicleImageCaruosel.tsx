// components/molecules/VehicleImageCarousel/index.tsx
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  FlatList,
  Pressable,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';

export type VehicleImage = {url: string; is_primary: boolean};

type Props = {
  images: VehicleImage[];
  height?: number;
  borderRadius?: number;
  onImagePress?: (index: number) => void;
};

const DOT = 8;

const IMG_HEADERS = {
  'User-Agent': 'RentApp/1.0 (contacto@tuapp.com)',
  Accept: 'image/*',
  Referer: 'https://tuapp.example',
};

const FALLBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8z/C/HwAF8gJ5m3+gYQAAAABJRU5ErkJggg==';

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
      return [...list].sort(
        (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0),
      );
    }
    return [{url: FALLBACK, is_primary: true}];
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
        style={{width: containerWidth || '100%', height, overflow: 'hidden'}}>
        <FastImage
          style={{width: '100%', height: '100%', backgroundColor: '#eee'}}
          source={{
            uri: item.url,
            headers: IMG_HEADERS,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onError={() => console.log('IMG ERROR carousel', i)}
        />
      </Pressable>
    ),
    [containerWidth, height, onImagePress],
  );

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
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate="fast"
        snapToInterval={containerWidth > 0 ? containerWidth : undefined}
        snapToAlignment="start"
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
        style={{width: '100%', height}}
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
