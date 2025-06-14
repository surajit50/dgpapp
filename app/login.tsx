import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginUser } from "../services/api";
import { LoginRequest } from "../types/auth";

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const loginData: LoginRequest = {
        ...credentials,
        ...(showTwoFactor && { code: twoFactorCode }),
      };

      const response = await loginUser(loginData);

      if (response.twoFactorRequired) {
        setShowTwoFactor(true);
        Alert.alert("2FA Required", response.message);
        return;
      }

      if (response.emailVerificationRequired) {
        Alert.alert("Verification Required", response.message);
        return;
      }

      if (response.success && response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        if (response.user) {
          await AsyncStorage.setItem("userData", JSON.stringify(response.user));
        }
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", response.message || "Login failed");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Network error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={credentials.email}
          onChangeText={(text) =>
            setCredentials((prev) => ({ ...prev, email: text }))
          }
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={credentials.password}
          onChangeText={(text) =>
            setCredentials((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry
          editable={!loading}
        />

        {showTwoFactor && (
          <TextInput
            style={styles.input}
            placeholder="Enter 2FA Code"
            value={twoFactorCode}
            onChangeText={setTwoFactorCode}
            keyboardType="numeric"
            editable={!loading}
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {showTwoFactor ? "Verify Code" : "Login"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
