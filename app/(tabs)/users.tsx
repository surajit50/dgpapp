import { StyleSheet, Text, View } from "react-native";

export default function UsersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Management</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
