import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

export default function DiagnosticsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("dtc");

  const dtcCodes = [
    { id: "1", code: "P0301", description: "Engine Control Module (ECM)", active: true },
    { id: "2", code: "P0700", description: "Transmission Control Module (TCM)", active: true },
    { id: "3", code: "C1234", description: "Anti-lock Brake System (ABS)", active: true },
    { id: "4", code: "B0100", description: "Supplemental Restraint System (SRS)", active: true },
  ];

  const renderDTCItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.dtcItem}
      onPress={() => navigation.navigate('DTCDetail', { code: item.code })}
    >
      <View style={styles.dtcInfo}>
        <Text style={styles.dtcCode}>{item.code}</Text>
        <Text style={styles.dtcDesc}>{item.description}</Text>
      </View>
      <View style={[styles.statusDot, item.active && styles.statusActive]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dtc" && styles.tabActive]}
          onPress={() => setActiveTab("dtc")}
        >
          <Text style={[styles.tabText, activeTab === "dtc" && styles.tabTextActive]}>
            DTC Scan Results
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "live" && styles.tabActive]}
          onPress={() => setActiveTab("live")}
        >
          <Text style={[styles.tabText, activeTab === "live" && styles.tabTextActive]}>
            Live Data (PIDs)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === "dtc" ? (
        <>
          <FlatList
            data={dtcCodes}
            renderItem={renderDTCItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
          <TouchableOpacity style={styles.explainButton}>
            <Text style={styles.explainButtonText}>Explain</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Live data monitoring coming soon</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFC107",
  },
  tabText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  list: {
    padding: 16,
  },
  dtcItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  dtcInfo: {
    flex: 1,
  },
  dtcCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  dtcDesc: {
    fontSize: 13,
    color: "#999",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#666",
  },
  statusActive: {
    backgroundColor: "#4ade80",
  },
  explainButton: {
    backgroundColor: "#FFC107",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  explainButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
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