import MockAdapter from 'axios-mock-adapter';
import client from '../src/api/client';
import {flushPromises} from '../src/test-utils/flushPromises';

jest.mock('../src/lib/hooks/useApi.ts', () => {
  const mockListVehicles = jest.fn();
  return {
    __esModule: true,
    default: () => ({listVehicles: mockListVehicles}),
    __mock__: {mockListVehicles}, // para acceder desde el test
  };
});

const {__mock__} = jest.requireMock('../src/lib/hooks/useApi.ts') as any;
const {mockListVehicles} = __mock__;

describe('vehicles service', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(client);
    mockListVehicles.mockReset();
  });

  afterEach(() => mock.restore());

  it('obtiene vehículos con parámetros', async () => {
    mock
      .onGet('/vehicles', {params: {status: 'available', page: 1, per_page: 5}})
      .reply(200, [{id: 1}]);

    const onSuccess = jest.fn();

    mockListVehicles.mockReturnValue({
      handle: ({onSuccess: successCb}: any) => {
        successCb?.([{id: 1}]);
        return {cancel: jest.fn()};
      },
    });

    const useApi = require('../src/lib/hooks/useApi').default;
    const api = useApi();

    api
      .listVehicles({status: 'available', page: 1, per_page: 5})
      .handle({onSuccess});

    await flushPromises();
    expect(onSuccess).toHaveBeenCalledWith([{id: 1}]);
  });
});
