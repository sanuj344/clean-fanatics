import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ServiceDetailsScreen from "../screens/ServiceDetailsScreen";
import BookingSuccessScreen from "../screens/BookingSuccessScreen";

const Stack = createNativeStackNavigator();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{ title: "Service Details" }}
      />
      <Stack.Screen
  name="BookingSuccess"
  component={BookingSuccessScreen}
  options={{ headerShown: false }}
/>
    </Stack.Navigator>
  );
}
