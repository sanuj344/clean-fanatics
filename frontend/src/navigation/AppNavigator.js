import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

import CustomerNavigator from "./CustomerNavigator";
import ProviderNavigator from "./ProviderNavigator";
import AdminNavigator from "./AdminNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : user.role === "CUSTOMER" ? (
        <CustomerNavigator />
      ) : user.role === "PROVIDER" ? (
        <ProviderNavigator />
      ) : (
        <AdminNavigator />
      )}
    </NavigationContainer>
  );
}
