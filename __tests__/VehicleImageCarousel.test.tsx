import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '../src/test-utils/render';
import VehicleImageCarousel from '../src/components/molecules/VehicleImageCaruosel.tsx';

const images = [
  {url: 'https://img/c.jpg', is_primary: false},
  {url: 'https://img/a.jpg', is_primary: true}, // should sort first
  {url: 'https://img/b.jpg', is_primary: false},
];

describe('VehicleImageCarousel', () => {
  it('renderiza los puntos y maneja el scroll', () => {
    const {getByTestId, getAllByTestId, UNSAFE_getByType} = renderWithProviders(
      <VehicleImageCarousel images={images} height={150} />,
    );

    // establish container width
    const wrapper = getByTestId('vehicle-carousel');
    fireEvent(wrapper, 'layout', {
      nativeEvent: {layout: {width: 300, height: 150}},
    });

    // dots render
    expect(getByTestId('carousel-dots')).toBeTruthy();
    expect(
      getAllByTestId('dot').length + getAllByTestId('dot-active').length,
    ).toBe(3);

    // simulate page 2
    const {FlatList} = require('react-native');
    const list = UNSAFE_getByType(FlatList);
    fireEvent(list, 'onMomentumScrollEnd', {
      nativeEvent: {contentOffset: {x: 300}},
    });

    // active dot should still be exactly one
    expect(getAllByTestId('dot-active').length).toBe(1);
  });
});
