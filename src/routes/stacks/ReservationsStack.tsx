import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReservationListScreen from '../../pages/reservations/ReservationListScreen.tsx';

const Stack = createNativeStackNavigator();

export default function ReservationsStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Reservations" component={ReservationListScreen} />
    </Stack.Navigator>
  );
}
