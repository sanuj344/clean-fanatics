import { View, Text, Button } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminHome() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Admin Dashboard
      </Text>
      <Text>Welcome {user?.name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
