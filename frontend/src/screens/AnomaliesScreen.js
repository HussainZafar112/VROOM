import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function AnomaliesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anomaly Detection</Text>

      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>Coolant temperature rising unusually fast</Text>
          <Text style={styles.cardTime}>10:30 AM</Text>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.gauge}>
            <Text style={styles.gaugeText}>🌡️</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No other anomalies detected</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 13,
    color: "#999",
  },
  cardRight: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  gauge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gaugeText: {
    fontSize: 28,
  },
  viewButton: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});