import {useNavigation as useDefaultNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {
  AuthStackParamList,
  HomeStackParamList,
  SettingsStackParamList,
  ReservationsStackParamList,
} from '../types/navigation';

type StackName =
  | 'AuthStack'
  | 'HomeStack'
  | 'SettingsStack'
  | 'ReservationStack';

type NavMap = {
  AuthStack: NativeStackNavigationProp<AuthStackParamList>;
  HomeStack: NativeStackNavigationProp<HomeStackParamList>;
  SettingsStack: NativeStackNavigationProp<SettingsStackParamList>;
  ReservationStack: NativeStackNavigationProp<ReservationsStackParamList>;
};

export function useNavigation(stack: 'AuthStack'): NavMap['AuthStack'];
export function useNavigation(stack: 'HomeStack'): NavMap['HomeStack'];
export function useNavigation(stack: 'SettingsStack'): NavMap['SettingsStack'];
export function useNavigation(
  stack: 'ReservationStack',
): NavMap['ReservationStack'];

export function useNavigation(stack: StackName) {
  switch (stack) {
    case 'AuthStack':
      return useDefaultNavigation<NavMap['AuthStack']>();
    case 'HomeStack':
      return useDefaultNavigation<NavMap['HomeStack']>();
    case 'SettingsStack':
      return useDefaultNavigation<NavMap['SettingsStack']>();
    case 'ReservationStack':
      return useDefaultNavigation<NavMap['ReservationStack']>();
    default:
      return useDefaultNavigation<NativeStackNavigationProp<{}>>();
  }
}
