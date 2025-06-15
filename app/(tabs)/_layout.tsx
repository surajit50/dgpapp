import { Sidebar } from "../../components/Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      if (token && userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {isAuthenticated && (
          <Sidebar 
            userRole={userRole}
            onClose={() => setIsSidebarVisible(false)}
          />
        )}
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerTintColor: "#000",
              headerLeft: isAuthenticated ? () => (
                <TouchableOpacity 
                  onPress={() => setIsSidebarVisible(!isSidebarVisible)}
                  style={styles.menuButton}
                >
                  <Text>☰</Text>
                </TouchableOpacity>
              ) : undefined,
            }}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    padding: 10,
    marginLeft: 10,
  }
});