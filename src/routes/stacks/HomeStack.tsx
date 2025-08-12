import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import HomeScreen from '../../pages/HomeScreen';
import VehicleListScreen from '../../pages/vehicles/VehicleListScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
      <Stack.Screen name="VehicleList" component={VehicleListScreen} />
    </Stack.Navigator>
  );
}
