import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import HomeScreen from '../../pages/HomeScreen';
import VehicleListScreen from '../../pages/vehicles/VehicleListScreen';
import VehicleDetailsScreen from '../../pages/vehicles/VehicleDetailsScreen.tsx';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
      <Stack.Screen name="VehicleList" component={VehicleListScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    </Stack.Navigator>
  );
}
