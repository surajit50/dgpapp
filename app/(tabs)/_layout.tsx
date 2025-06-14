import { ProfileButton } from "@/components/ProfileButton";
import { MENU_ITEMS, MenuItem } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface UserData {
  role: string;
}

export default function TabsLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const theme = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user: UserData = JSON.parse(userData);
        setUserRole(user.role.toLowerCase());
        const filteredMenu = MENU_ITEMS.filter((item) =>
          item.roles.includes(user.role.toLowerCase())
        );
        setMenuItems(filteredMenu);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const getIconName = (icon: string) => {
    switch (icon) {
      case "home":
        return "home";
      case "users":
        return "people";
      case "bar-chart":
        return "bar-chart";
      case "user":
        return "person";
      default:
        return "home";
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <ProfileButton />,
        headerStyle: {
          backgroundColor: "white",
        },
        headerTintColor: "#000",
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {menuItems.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={getIconName(item.icon) as any}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
