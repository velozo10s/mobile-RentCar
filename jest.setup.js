// jest.setup.js
import '@testing-library/jest-native/extend-expect';
// Mock oficial de Reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
global.__reanimatedWorkletInit = () => {};

// Vector icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Config
jest.mock('react-native-config', () => ({API_BASE_URL: 'http://test.local'}));

// Mock de react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: () => [
    {languageCode: 'en', countryCode: 'US', languageTag: 'en-US', isRTL: false},
  ],
  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'America/New_York',
  uses24HourClock: () => false,
  usesMetricSystem: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: available => {
    const fallback = {languageTag: 'en-US', isRTL: false};
    if (!Array.isArray(available) || available.length === 0) return fallback;
    return available.includes('en-US')
      ? {languageTag: 'en-US', isRTL: false}
      : fallback;
  },
}));

// i18n mock simple
// --- Mock robusto de i18next (con .on/.off y encadenable) ---
jest.mock('i18next', () => {
  const listeners = new Map();

  const i18n = {
    // chain
    use() {
      return this;
    },
    init: jest.fn().mockResolvedValue(true),

    // traducción básica
    t: (k, opts) => (opts && opts.defaultValue ? opts.defaultValue : k),

    // idioma y cambios (emite 'languageChanged')
    language: 'en',
    changeLanguage: jest.fn().mockImplementation(async lng => {
      i18n.language = lng;
      const subs = listeners.get('languageChanged') || [];
      subs.forEach(fn => fn(lng));
      return true;
    }),

    // eventos
    on: (evt, cb) => {
      const subs = listeners.get(evt) || [];
      subs.push(cb);
      listeners.set(evt, subs);
    },
    off: (evt, cb) => {
      const subs = listeners.get(evt) || [];
      listeners.set(
        evt,
        subs.filter(f => f !== cb),
      );
    },
  };

  return {__esModule: true, default: i18n};
});

// (opcional) si usas hooks/HOC de react-i18next
jest.mock('react-i18next', () => ({
  __esModule: true,
  withTranslation: () => C => C,
  useTranslation: () => ({
    t: (k, opts) => (opts && opts.defaultValue ? opts.defaultValue : k),
  }),
  initReactI18next: {type: '3rdParty', init: () => {}},
}));

// Navigation
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      openDrawer: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Dates
jest.mock('react-native-paper-dates', () => ({
  DatePickerInput: () => null,
  registerTranslation: () => {},
  en: {},
  es: {},
}));

// Evitar warning de iconos de react-native-paper en tests
// jest.setup.js

// 1) El componente específico que te aparece en el stacktrace
jest.mock('react-native-paper/src/components/MaterialCommunityIcon', () => {
  const React = require('react');
  return function MaterialCommunityIcon() {
    return React.createElement('span', {'data-testid': 'rnp-icon'});
  };
});

// 2) (por si Paper usa el wrapper genérico Icon en tu versión)
jest.mock('react-native-paper/src/components/Icon', () => {
  const React = require('react');
  return {
    default: function Icon() {
      return React.createElement('span', {'data-testid': 'rnp-icon'});
    },
  };
});

// FastImage -> usa Image
jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const {Image} = require('react-native');
  return ({source, ...props}) =>
    React.createElement(Image, {
      source,
      ...props,
      accessibilityLabel: source?.uri || 'img',
    });
});

jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const {View} = require('react-native');
  const FastImage = props => React.createElement(View, props, props.children);
  FastImage.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };
  FastImage.priority = {low: 'low', normal: 'normal', high: 'high'};
  return FastImage;
});

// Mock de react-native-splash-screen (evita ESM en node_modules y llamadas nativas)
jest.mock('react-native-splash-screen', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  __esModule: true,
  // Componente de passthrough para tests
  KeyboardAwareScrollView: ({children}) => children,
  default: ({children}) => children,
}));

// Mock del drawer layout (evita ESM y nativos)
jest.mock('react-native-drawer-layout', () => ({
  __esModule: true,
  default: ({children}) => children,
}));

// Mock de @react-navigation/drawer para no montar navegación real
jest.mock('@react-navigation/drawer', () => {
  const React = require('react');
  const {View} = require('react-native');

  const createDrawerNavigator = () => {
    const Navigator = ({children}) => (
      <View testID="DrawerNavigator">{children}</View>
    );
    const Screen = ({children}) => <View>{children}</View>;
    const Group = ({children}) => <View>{children}</View>;
    return {Navigator, Screen, Group};
  };

  return {
    __esModule: true,
    createDrawerNavigator,
    DrawerContentScrollView: ({children}) => <View>{children}</View>,
    DrawerItemList: () => null,
    DrawerItem: () => null,
  };
});

const origWarn = console.warn;
console.warn = (...args) => {
  const msg = String(args[0] ?? '');
  if (
    msg.includes('Tried to use the icon') ||
    msg.includes('not wrapped in act')
  )
    return;
  origWarn(...args);
};

const origError = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('not wrapped in act')) return; // ya lo manejamos con timers
  origError(...args);
};
