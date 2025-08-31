import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {DrawerNavigationProp} from '@react-navigation/drawer';

export type DrawerParamList = {
  MainTabs: undefined;
  // here goes drawer-only screens if added more in the future.
};

export type TabParamList = {
  HomeTab: undefined;
  SettingsTab: undefined;
  // here goes bottom-tabs-only screens if added more in the future.
};

export type SearchBarNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'HomeTab'>,
  DrawerNavigationProp<DrawerParamList>
>;

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  SignUpStep1: {
    onNext: () => void;
  };
  SignUpStep2: {
    onNext: () => void;
    onBack: () => void;
  };
};

export type HomeStackParamList = {
  Home: undefined;
  VehicleList: undefined;
  VehicleDetails: {
    id: number;
    startAt: number | null;
    endAt: number | null;
  };
  ReservationForm: {
    id: number;
    startAt: number | null;
    endAt: number | null;
  };
};

export type SettingsStackParamList = {
  Settings: undefined;
};
