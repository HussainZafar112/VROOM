// src/screens/DashboardScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OBDContext } from '../navigation/OBDContext';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a1a', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
    subtitle: { color: '#FFC107', fontSize: 16, fontWeight: '600' },
    statusBox: { backgroundColor: '#2a2a2a', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    statusText: { color: '#fff', fontSize: 16, flexShrink: 1 },
    statusLight: (isConnected) => ({ width: 10, height: 10, borderRadius: 5, backgroundColor: isConnected ? '#4CAF50' : '#FF5722', marginLeft: 10 }),
    cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 15, marginBottom: 15, width: '48.5%' },
    cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 5 },
    cardValue: { fontSize: 22, color: '#fff', fontWeight: '600' },
    button: { backgroundColor: '#FFC107', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 16 },
});

const DashboardScreen = ({ navigation }) => {
    const { isConnected, obdData = {}, isScanning } = useContext(OBDContext);

    const speedMph = ((obdData.SpeedKmH ?? 0) * 0.621371).toFixed(0);
    const rpm = obdData.RPM ?? 0;
    const coolantTemp = obdData.CoolantTemp ? `${obdData.CoolantTemp}°C` : 'N/A';
    const fuelLevel = obdData.FuelLevel ?? '75%';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.subtitle}>Vehicle Status</Text>
                        <Text style={styles.title}>Live Metrics</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { screen: 'MyVehicles' })}>
                        <Ionicons name="car-outline" size={30} color="#FFC107" />
                    </TouchableOpacity>
                </View>

                <View style={styles.statusBox}>
                    <Text style={styles.statusText}>
                        <Ionicons name="bluetooth" size={18} color="#fff" />{' '}
                        OBD Status: {isConnected ? 'Connected' : (isScanning ? 'Scanning...' : 'Disconnected')}
                    </Text>
                    {isScanning && <ActivityIndicator size="small" color="#FFC107" />}
                    <View style={styles.statusLight(isConnected)} />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isConnected ? '#4CAF50' : '#FFC107' }]}
                    onPress={() => {
                        if (isConnected) {
                            console.log('Already streaming live data.');
                        } else {
                            navigation.navigate('DeviceSelection'); 
                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {isConnected ? 'STREAMING LIVE DATA' : 'SELECT OBD DEVICE'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.cardGrid}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Speed</Text>
                        <Text style={styles.cardValue}>{speedMph} mph</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>RPM</Text>
                        <Text style={styles.cardValue}>{rpm}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Coolant Temp</Text>
                        <Text style={styles.cardValue}>{coolantTemp}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Fuel Level</Text>
                        <Text style={styles.cardValue}>{fuelLevel}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.statusBox, { backgroundColor: '#3a3a3a' }]}
                    onPress={() => navigation.navigate('Diagnostics')}
                >
                    <Text style={styles.statusText}>Run Diagnostics Scan</Text>
                    <Ionicons name="arrow-forward" size={24} color="#FFC107" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DashboardScreen;
