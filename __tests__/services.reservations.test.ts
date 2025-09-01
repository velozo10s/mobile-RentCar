// __tests__/services.reservations.test.ts
import client from '../src/api/client';
import {flushPromises} from '../src/test-utils/flushPromises';

describe('reservations service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('envía createReservation y devuelve el payload', async () => {
    // 👇 finge la respuesta del cliente real
    const postSpy = jest
      .spyOn(client, 'post')
      .mockResolvedValue({data: {id: 2, status: 'pending'}} as any);

    // cargar el hook/servicio *después* del spy
    const useApi = require('../src/lib/hooks/useApi').default;
    const api = useApi();

    const onSuccess = jest.fn();

    api
      .createReservation({
        startAt: '2025-08-20T10:00:00-04:00',
        endAt: '2025-08-23T10:00:00-04:00',
        vehicleIds: [1, 2],
        note: 'Kids seat',
      })
      .handle({onSuccess});

    await flushPromises();

    expect(postSpy).toHaveBeenCalled(); // opcional: valida que posteó
    expect(onSuccess).toHaveBeenCalledWith({id: 2, status: 'pending'});
  });
});
