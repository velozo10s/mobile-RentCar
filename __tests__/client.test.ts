import MockAdapter from 'axios-mock-adapter';
import client, {wrapRequest} from '../src/api/client';
import rootStore from '../src/lib/stores/rootStore';
import {flushPromises} from '../src/test-utils/flushPromises';

describe('client axios instance', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(client);
    jest.spyOn(rootStore.uiStore, 'showSnackbar').mockImplementation(() => {});
    rootStore.userStore.accessToken = 'abc.token';
  });

  afterEach(() => mock.restore());

  test('agrega el encabezado Authorization cuando existe un token', async () => {
    mock.onGet('/ping').reply(200, {ok: true});
    const req = client.get('/ping');
    await req;
    const lastReq = mock.history.get[0];
    expect(lastReq.headers?.Authorization).toBe('Bearer abc.token');
  });

  it('llama a onSuccess y muestra successMessage', async () => {
    mock.onGet('/ok').reply(200, {result: 1});

    const onSuccess = jest.fn();
    wrapRequest(client.get('/ok')).handle({
      onSuccess,
      successMessage: 'ok!',
    });

    await flushPromises();
    expect(onSuccess).toHaveBeenCalledWith({result: 1});
    expect(rootStore.uiStore.showSnackbar).toHaveBeenCalledWith(
      'ok!',
      'success',
    );
  });

  it('maneja errores 4xx/5xx mostrando errorMessage', async () => {
    mock.onGet('/fail').reply(400, {error: 'bad'});

    const onError = jest.fn();
    wrapRequest(client.get('/fail')).handle({
      onError,
      errorMessage: 'boom',
    });

    await flushPromises();
    expect(onError).toHaveBeenCalled();
    expect(rootStore.uiStore.showSnackbar).toHaveBeenCalledWith(
      'boom',
      'danger',
    );
  });

  it('maneja error de red con snackbar genérico', async () => {
    mock.onGet('/net').networkError();

    wrapRequest(client.get('/net')).handle({});
    await flushPromises();

    expect(rootStore.uiStore.showSnackbar).toHaveBeenCalled(); // message from i18n mock
  });
});
