import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../pages/LoginScreen.tsx';
import SignUpScreen from '../../pages/signUp/SignUpScreen.tsx';
import SignUpStep1 from '../../pages/signUp/SignUpStep1.tsx';
import SignUpStep2 from '../../pages/signUp/SignUpStep2.tsx';
import {AuthStackParamList} from '../../lib/types/navigation.ts';
import ForgotPassword from '../../pages/ForgotPassword.tsx';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SignUpStep1" component={SignUpStep1} />
      <Stack.Screen name="SignUpStep2" component={SignUpStep2} />
    </Stack.Navigator>
  );
}
