import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>VROOM</Text>
      
      {/* Quick Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Summary</Text>
        
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Car Connected</Text>
              <Text style={styles.cardDesc}>Your vehicle is currently connected and providing real-time data.</Text>
            </View>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.icon}>🚗</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Engine Health</Text>
              <Text style={styles.cardDesc}>AI analysis indicates your engine is in optimal condition.</Text>
            </View>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.icon}>⚙️</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Last Oil Change</Text>
              <Text style={styles.cardDesc}>Next oil change predicted in 3,500 miles.</Text>
            </View>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.icon}>🛢️</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Anomalies')}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Anomaly Detection</Text>
              <Text style={styles.cardDesc}>View any abrupt changes in your vehicle's engine.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Scan Button */}
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.scanButtonText}>Scan Vehicle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#999",
    maxWidth: "80%",
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 30,
  },
  arrow: {
    fontSize: 32,
    color: "#666",
  },
  scanButton: {
    backgroundColor: "#FFC107",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});