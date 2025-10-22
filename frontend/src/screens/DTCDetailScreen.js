import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function DTCDetailScreen({ route, navigation }) {
  const { code } = route.params || { code: "P0301" };

  const adviceItems = [
    { icon: "✓", text: "Check Spark Plugs" },
    { icon: "✓", text: "Inspect Ignition Coils" },
    { icon: "✓", text: "Avoid High RPM" },
    { icon: "✓", text: "Monitor Fuel Efficiency" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.code}>{code}</Text>
        <Text style={styles.title}>Cylinder 1 Misfire Detected</Text>
        <Text style={styles.subtitle}>Summary</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Severity: <Text style={styles.severityHigh}>High</Text></Text>
        <Text style={styles.description}>
          Your vehicle's engine is experiencing a misfire, which means one or more cylinders are not firing correctly. This can lead to reduced power, rough idling, and increased fuel consumption. Immediate attention is recommended to prevent further damage.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actionable Advice</Text>
        {adviceItems.map((item, index) => (
          <View key={index} style={styles.adviceItem}>
            <View style={styles.adviceIcon}>
              <Text style={styles.adviceIconText}>{item.icon}</Text>
            </View>
            <Text style={styles.adviceText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Export as PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Talk to Ustaad</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  code: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
  },
  severityHigh: {
    color: "#ef4444",
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#999",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  adviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  adviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  adviceIconText: {
    fontSize: 18,
  },
  adviceText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#FFC107",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
});