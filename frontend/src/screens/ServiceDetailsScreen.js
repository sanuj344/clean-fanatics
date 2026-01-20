import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
 const { refreshUser, user } = useContext(AuthContext);

export default function ServiceDetailsScreen({ route, navigation }) {
  const { service } = route.params;
  const { user } = useContext(AuthContext);



const bookService = async () => {
  try {
    const res = await API.post("/bookings", {
      serviceId: service.id,
    });

    await refreshUser(); // 🔥 real-time credit update

    navigation.replace("BookingSuccess", {
      serviceTitle: service.title,
      bookingId: res.data.id,
      status: res.data.status,
      creditsLeft: user.credits - service.creditCost,
    });
  } catch (err) {
    Alert.alert(
      "Booking failed",
      err.response?.data?.message || "Something went wrong"
    );
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.title}</Text>
      <Text>{service.category}</Text>
      <Text>⭐ {service.ratingAvg || "New"}</Text>
      <Text style={styles.cost}>Credits Required: {service.creditCost}</Text>

      <Text style={styles.balance}>Your Credits: {user.credits}</Text>

      <Button title="Book Service" onPress={bookService} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  cost: { marginTop: 15, fontWeight: "bold" },
  balance: { marginVertical: 15 },
});
