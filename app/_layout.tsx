import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 0.94 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
        }}
      />
    </GestureHandlerRootView>
  );
}
