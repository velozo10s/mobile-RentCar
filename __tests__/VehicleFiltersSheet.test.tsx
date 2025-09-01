// __tests__/VehicleFiltersSheet.test.tsx
import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import {renderWithProviders} from '../src/test-utils/render';
import VehicleFiltersSheet from '../src/components/organisms/VehicleFiltersSheet';
import {VehicleListFilters} from '../src/lib/types/vehicles';

jest.mock('../src/lib/hooks/useApi.ts', () => () => ({
  getVehicleTypes: () => ({
    handle: ({onSuccess, onFinally}: any) => {
      onSuccess?.([
        {id: 1, name: 'Sedan'},
        {id: 2, name: 'SUV'},
      ]);
      onFinally?.();
    },
  }),
  getVehicleBrands: () => ({
    handle: ({onSuccess, onFinally}: any) => {
      onSuccess?.([
        {id: 10, name: 'Toyota'},
        {id: 20, name: 'Honda'},
      ]);
      onFinally?.();
    },
  }),
}));

const initial: VehicleListFilters = {
  q: '',
  sort: 'created_at',
  order: 'desc',
  brand_id: undefined,
  type_id: undefined,
  startAt: undefined,
  endAt: undefined,
};

describe('VehicleFiltersSheet', () => {
  it('carga marcas/tipos y aplica filtros de marca/tipo', async () => {
    const onApply = jest.fn();

    renderWithProviders(
      <VehicleFiltersSheet
        visible
        onDismiss={() => {}}
        onApply={onApply}
        initialValues={initial}
      />,
    );

    // Chips from mocked API should be there
    const toyota = await screen.findByText('Toyota');
    const suv = await screen.findByText('vehicles.type.SUV'); // you translate via t(`vehicles.type.${name}`)

    // select brand + type
    fireEvent.press(toyota);
    fireEvent.press(suv);

    fireEvent.press(screen.getByText('common.apply')); // our i18n mock returns the key

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({brand_id: 10, type_id: 2}),
    );
  });

  it('desactiva “Aplicar” si solo se establece una fecha', async () => {
    const onApply = jest.fn();

    renderWithProviders(
      <VehicleFiltersSheet
        visible
        onDismiss={() => {}}
        onApply={onApply}
        initialValues={{...initial, startAt: new Date()}} // endAt missing
      />,
    );

    const applyBtn = screen.getByTestId('filters-apply');
    expect(applyBtn).toBeDisabled();
  });
});
