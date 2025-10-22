import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { AuthContext } from "../navigation/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>No user loaded</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("MyVehicles")}>
          <Text style={styles.menuText}>🚗 My Vehicles</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Privacy")}>
          <Text style={styles.menuText}>🔒 Privacy Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  profileHeader: { alignItems: "center", marginVertical: 30 },
  avatar: { backgroundColor: "#333", padding: 20, borderRadius: 50 },
  avatarText: { fontSize: 30 },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 10 },
  email: { color: "#aaa", fontSize: 14 },
  section: { marginVertical: 20, paddingHorizontal: 20 },
  sectionTitle: { color: "#FFC107", fontSize: 18, marginBottom: 10 },
  menuItem: { backgroundColor: "#222", padding: 15, borderRadius: 10, marginBottom: 10 },
  menuText: { color: "#fff", fontSize: 16 },
  logoutButton: { backgroundColor: "#ff4444", padding: 15, borderRadius: 10, margin: 20 },
  logoutText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
