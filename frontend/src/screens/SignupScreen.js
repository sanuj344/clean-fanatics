import { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../context/AuthContext";

export default function SignupScreen({ navigation }) {
  const { signup } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  const handleSignup = async () => {
    try {
      await signup({
        name,
        email,
        password,
        role,
      });
      alert("Signup successful. Please login.");
      navigation.navigate("Login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Select Role</Text>
      <Picker
        selectedValue={role}
        onValueChange={(value) => setRole(value)}
        style={styles.picker}
      >
        <Picker.Item label="Customer" value="CUSTOMER" />
        <Picker.Item label="Provider" value="PROVIDER" />
         <Picker.Item label="Admin (Demo Only)" value="ADMIN" />

      </Picker>

      <Button title="Signup" onPress={handleSignup} />

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  label: { marginBottom: 5 },
  picker: { marginBottom: 15 },
  link: { marginTop: 15, textAlign: "center", color: "blue" },
});
