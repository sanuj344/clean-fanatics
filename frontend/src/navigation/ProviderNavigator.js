import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProviderHome from "../screens/ProviderHome";

const Stack = createNativeStackNavigator();

export default function ProviderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProviderHome" component={ProviderHome} />
    </Stack.Navigator>
  );
}
