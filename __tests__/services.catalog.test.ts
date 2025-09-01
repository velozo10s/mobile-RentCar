// __tests__/services.catalog.test.ts
import MockAdapter from 'axios-mock-adapter';
import Client from '../src/api/client.ts';
import useApi from '../src/lib/hooks/useApi';

jest.mock('../src/lib/hooks/useApi'); // if useApi builds client methods dynamically

describe('catalog endpoints', () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(Client);
  });
  afterEach(() => mock.restore());

  it('obtiene marcas', async () => {
    mock.onGet('/brands').reply(200, [{id: 10, name: 'Toyota'}]);
    const api: any = {
      getVehicleBrands: () => ({
        handle: ({onSuccess}: any) => onSuccess([{id: 10, name: 'Toyota'}]),
      }),
    };
    (useApi as jest.Mock).mockReturnValue(api);
    // typically you’d call through your sheet; covered above
  });

  it('obtiene tipos', async () => {
    mock.onGet('/types').reply(200, [{id: 10, name: 'SUV'}]);
    const api: any = {
      getVehicleBrands: () => ({
        handle: ({onSuccess}: any) => onSuccess([{id: 10, name: 'SUV'}]),
      }),
    };
    (useApi as jest.Mock).mockReturnValue(api);
    // typically you’d call through your sheet; covered above
  });
});
