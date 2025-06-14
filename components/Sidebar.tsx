import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MENU_ITEMS } from "../constants/navigation";

interface SidebarProps {
  userRole: string;
  onClose?: () => void;
}

export function Sidebar({ userRole, onClose }: SidebarProps) {
  const router = useRouter();
  const currentPath = usePathname();

  const filteredMenu = MENU_ITEMS.filter((item) =>
    item.roles.includes(userRole.toLowerCase())
  );

  const handleNavigation = (route: string) => {
    router.push(route as any);
    onClose?.();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData"]);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.menuContainer}>
        {filteredMenu.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.menuItem,
              currentPath === `/${item.name}` && styles.activeMenuItem,
            ]}
            onPress={() => handleNavigation(item.name)}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={currentPath === `/${item.name}` ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.menuText,
                currentPath === `/${item.name}` && styles.activeMenuText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: Dimensions.get("window").width * 0.75,
    maxWidth: 300,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 5,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: "#F0F8FF",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#666",
  },
  activeMenuText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#FF3B30",
  },
});
