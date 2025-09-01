import React from 'react';
import {act, fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '../src/test-utils/render';
import VehicleListScreen from '../src/pages/vehicles/VehicleListScreen';
import {flushPromises} from '../src/test-utils/flushPromises';

// Mock del hook y exposición de funciones mockeadas
jest.mock('../src/lib/hooks/useApi.ts', () => {
  const mockListVehicles = jest.fn();
  const mockGetVehicleTypes = jest.fn();
  const mockGetVehicleBrands = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      listVehicles: mockListVehicles,
      getVehicleTypes: mockGetVehicleTypes,
      getVehicleBrands: mockGetVehicleBrands,
    }),
    __mock__: {mockListVehicles, mockGetVehicleTypes, mockGetVehicleBrands},
  };
});

const {__mock__} = jest.requireMock('../src/lib/hooks/useApi.ts') as any;
const {mockListVehicles, mockGetVehicleTypes, mockGetVehicleBrands} = __mock__;

describe('VehicleListScreen', () => {
  beforeEach(() => {
    mockListVehicles.mockReset();
    mockGetVehicleTypes.mockReset();
    mockGetVehicleBrands.mockReset();

    mockListVehicles.mockImplementation((_params: any) => ({
      handle: ({onSuccess, onFinally}: any) => {
        onSuccess?.([
          {
            id: 1,
            brand_name: 'Toyota',
            model: 'Corolla',
            year: 2022,
            images: [],
          },
          {id: 2, brand_name: 'Honda', model: 'Civic', year: 2021, images: []},
        ]);
        onFinally?.();
      },
    }));

    mockGetVehicleTypes.mockImplementation(() => ({
      handle: ({onSuccess, onFinally}: any) => {
        onSuccess?.([
          {id: 2, name: 'SUV', i18n_key: 'vehicles.type.SUV'},
          {id: 1, name: 'Sedan', i18n_key: 'vehicles.type.SEDAN'},
        ]);
        onFinally?.();
      },
    }));

    mockGetVehicleBrands.mockImplementation(() => ({
      handle: ({onSuccess, onFinally}: any) => {
        onSuccess?.([
          {id: 10, name: 'Toyota'},
          {id: 20, name: 'Honda'},
        ]);
        onFinally?.();
      },
    }));
  });

  it('aplica filtros mediante el modal', async () => {
    const {getByTestId, getByText} = renderWithProviders(<VehicleListScreen />);

    await act(async () => {
      await flushPromises();
    });

    fireEvent.press(getByTestId('filters-button')); // abre modal

    // Nota: si tu UI muestra “SUV” (no la key i18n), usa getByText('SUV')
    fireEvent.press(getByText('Toyota'));
    fireEvent.press(getByText('vehicles.type.SUV'));

    fireEvent.press(getByTestId('filters-apply'));

    expect(mockListVehicles).toHaveBeenLastCalledWith(
      expect.objectContaining({
        brand_id: 10,
        type_id: 2,
      }),
    );
  });
});
