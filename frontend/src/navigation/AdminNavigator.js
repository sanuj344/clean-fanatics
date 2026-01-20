import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminHome from "../screens/AdminHome";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHome" component={AdminHome} />
    </Stack.Navigator>
  );
}
