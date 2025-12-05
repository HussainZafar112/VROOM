import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../navigation/AuthContext"; //  import the context
import * as Google from "expo-auth-session/providers/google";
import { BASE } from "../navigation/api"; 
export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login } = useContext(AuthContext); //  use login from context

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          name: fullName,
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (res.ok) {
        // ✅ build session
        const session = {
          token: "dummy-token", // backend doesn’t create one yet
          user: data.user,
        };

        // ✅ persist & update auth context
        await login(session);

        alert("Signup successful!");
      } else {
        alert(data.detail || data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>VROOM</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpText}>?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Create your account</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder=""
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder=""
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder=""
              placeholderTextColor="#666"
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder=""
              placeholderTextColor="#666"
              secureTextEntry
            />

            <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
              <Text style={styles.createButtonText}>Create account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton}>
              <Text style={styles.googleButtonText}>G Sign up with Google</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  logo: { fontSize: 24, fontWeight: "700", color: "#fff" },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  helpText: { fontSize: 18, color: "#fff", fontWeight: "700" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 40, textAlign: "center" },
  form: { width: "100%" },
  label: { fontSize: 14, color: "#fff", marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: "#2a2a2a", borderRadius: 12, padding: 16, color: "#fff", fontSize: 16 },
  createButton: { backgroundColor: "#FFC107", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  createButtonText: { fontSize: 16, fontWeight: "700", color: "#000" },
  googleButton: { backgroundColor: "#2a2a2a", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 16 },
  googleButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  terms: { color: "#999", fontSize: 12, textAlign: "center", marginTop: 24 },
});
