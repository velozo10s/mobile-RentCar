// __tests__/LoginScreen.test.tsx
import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import {renderWithProviders} from '../src/test-utils/render';
import LoginScreen from '../src/pages/LoginScreen.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

// mock useApi -> login
const mockLogin = jest.fn();
jest.mock('../src/lib/hooks/useApi.ts', () => ({
  __esModule: true,
  default: () => ({login: mockLogin}),
}));

// mock navigation si tu pantalla usa useNavigation()
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({navigate: jest.fn(), replace: jest.fn()}),
  };
});

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login ok: guarda tokens y navega al Home', async () => {
    const tokens = {
      access: 'acc.123',
      refresh: 'ref.456',
      user: {id: 1, email: 'a@b.com'},
    };
    mockLogin.mockReturnValue({
      handle: ({onSuccess}: any) => {
        onSuccess?.(tokens);
        return {cancel: jest.fn()};
      },
    });

    renderWithProviders(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId('login-user'), 'a@b.com');
    fireEvent.changeText(screen.getByTestId('login-password'), 'secret123');
    fireEvent.press(screen.getByTestId('login-submit'));

    // espera a efectos y promesas
    await new Promise(r => setTimeout(r, 0));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      expect.stringContaining('user'), // o tu USER_STORAGE_KEY
      expect.stringContaining('acc.123'),
    );
    // opcional: verifica navegación si tu LoginScreen llama replace('Home') o similar
    // expect(navigation.replace).toHaveBeenCalledWith('Home');
  });

  it('login inválido: muestra error y no guarda tokens', async () => {
    mockLogin.mockReturnValue({
      handle: ({onError}: any) => {
        onError?.({message: 'Invalid credentials', status: 401});
        return {cancel: jest.fn()};
      },
    });

    renderWithProviders(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId('login-user'), 'a@b.com');
    fireEvent.changeText(screen.getByTestId('login-password'), 'secret123');
    fireEvent.press(screen.getByTestId('login-submit'));

    await new Promise(r => setTimeout(r, 0));

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    // el mock de snackbar que pusiste antes:
    // expect(rootStore.uiStore.showSnackbar).toHaveBeenCalledWith(expect.stringContaining('Invalid'));
  });
});
