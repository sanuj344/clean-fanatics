import { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { fetchServices } from "../api/serviceApi";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await fetchServices();
    setServices(data);
  };

  const renderService = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() =>
      navigation.navigate("ServiceDetails", { service: item })
    }
  >
    <Text style={styles.title}>{item.title}</Text>
    <Text>{item.category}</Text>
    <Text>⭐ {item.ratingAvg || "New"}</Text>
    <Text>Credits: {item.creditCost}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi, {user.name}</Text>
        <Text style={styles.credits}>Credits: {user.credits}</Text>
        <Text onPress={logout} style={styles.logout}>Logout</Text>
      </View>

      {/* Services */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderService}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    marginBottom: 15,
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  credits: { marginTop: 5 },
  logout: { color: "red", marginTop: 5 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "bold" },
});
