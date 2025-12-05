import React, { useContext, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OBDContext } from '../navigation/OBDContext';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a1a', paddingHorizontal: 20 },
    header: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#3a3a3a' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    subtitle: { color: '#999', fontSize: 14 },
    list: { flex: 1, paddingVertical: 10 },
    deviceItem: { 
        backgroundColor: '#2a2a2a', 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    deviceName: { color: '#fff', fontSize: 16, fontWeight: '600' },
    deviceId: { color: '#999', fontSize: 12 },
    logArea: { marginTop: 20, backgroundColor: '#2a2a2a', padding: 10, borderRadius: 8, height: 150 },
    logTitle: { color: '#FFC107', fontWeight: 'bold', marginBottom: 5 },
    logText: { color: '#ddd', fontSize: 10 },
    connectButton: { padding: 10, borderRadius: 8, minWidth: 90, alignItems: 'center' },
    connectButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    scanButton: { 
        backgroundColor: '#FFC107', 
        padding: 15, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 20, 
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    scanButtonText: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 16 },
    emptyText: { color: '#999', textAlign: 'center', marginTop: 30 },
});

export default function DeviceSelectionScreen({ navigation }) {
    const { 
        scannedDevices, 
        isScanning, 
        isConnected,
        log,
        scanForDevices, 
        connectToDevice,
        device 
    } = useContext(OBDContext);

    const devicesArray = Object.values(scannedDevices).sort((a, b) => 
        (a.name || 'Unknown').localeCompare(b.name || 'Unknown')
    );

    useEffect(() => {
        if (!isConnected) scanForDevices();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: 'Select OBD Adapter',
            headerRight: () => isConnected ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="wifi" size={24} color="#4CAF50" />
                    <Text style={{ color: '#4CAF50', marginLeft: 5, fontWeight: 'bold' }}>Connected</Text>
                </View>
            ) : null
        });
    }, [isConnected, navigation]);

    const renderDeviceItem = ({ item }) => {
        const isCurrentDevice = item.id === device?.id;
        const buttonColor = isCurrentDevice ? '#4CAF50' : '#03A9F4';
        const buttonText = isCurrentDevice ? 'Connected' : 'Connect';

        return (
            <View style={styles.deviceItem}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
                    <Text style={styles.deviceId}>{item.id}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.connectButton, { backgroundColor: buttonColor }]} 
                    onPress={() => {
                        if (!isCurrentDevice) {
                            scanForDevices(true); 
                            connectToDevice(item);
                        }
                    }}
                    disabled={isCurrentDevice}
                >
                    <Text style={styles.connectButtonText}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        <Ionicons name="bluetooth" size={24} color="#FFC107" />
                        {isScanning ? ' Scanning...' : ' Devices Found'}
                    </Text>
                    <Text style={styles.subtitle}>Tap 'Connect' to pair with your OBD adapter and start streaming data.</Text>
                </View>

                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => isScanning ? scanForDevices(true) : scanForDevices()}
                    disabled={isConnected}
                >
                    {isScanning && <ActivityIndicator size="small" color="#1a1a1a" style={{ marginRight: 10 }} />}
                    <Text style={styles.scanButtonText}>
                        {isScanning ? 'STOP SCANNING' : 'RESCAN FOR DEVICES'}
                    </Text>
                </TouchableOpacity>

                <FlatList
                    style={styles.list}
                    data={devicesArray}
                    keyExtractor={(item) => item.id}
                    renderItem={renderDeviceItem}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>
                            {isScanning ? 'Searching for devices...' : 'No devices found. Ensure Bluetooth is on and the OBD adapter is powered.'}
                        </Text>
                    )}
                />

                <View style={styles.logArea}>
                    <Text style={styles.logTitle}>Connection Log</Text>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ justifyContent: 'flex-end' }}>
                        {log.map((msg, index) => (
                            <Text key={index} style={styles.logText}>{msg}</Text>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}
