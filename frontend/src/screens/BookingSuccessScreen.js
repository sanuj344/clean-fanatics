import { View, Text, Button, StyleSheet } from "react-native";

export default function BookingSuccessScreen({ route, navigation }) {
  const { serviceTitle, bookingId, status, creditsLeft } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Booking Confirmed</Text>

      <Text style={styles.text}>Service: {serviceTitle}</Text>
      <Text style={styles.text}>Booking ID: {bookingId}</Text>
      <Text style={styles.text}>Status: {status}</Text>
      <Text style={styles.text}>Credits Left: {creditsLeft}</Text>

      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
