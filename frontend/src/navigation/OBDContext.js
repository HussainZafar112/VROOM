import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
// IMPORTANT: This library requires the Expo BARE Workflow or Development Builds, 
// and will NOT work in the standard Expo Go app.
import { BleManager } from 'react-native-ble-plx'; 
import { Buffer } from 'buffer'; // Often required for correct Base64/ASCII conversion in React Native

// Common UUIDs for ELM327 over BLE
const OBD_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; 
const OBD_CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; 

// Utility functions for data conversion
const stringToBase64 = (str) => Buffer.from(str, 'ascii').toString('base64');
const base64ToString = (base64) => Buffer.from(base64, 'base64').toString('ascii');

const manager = new BleManager(); 

export const OBDContext = createContext();

export const OBDProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [device, setDevice] = useState(null);
    const [scannedDevices, setScannedDevices] = useState({});
    const [obdData, setObdData] = useState({}); // Stores processed data (e.g., {RPM: 1500, Temp: 90})
    const [log, setLog] = useState([]); // Connection/Command log

    // Helper to log messages
    const logMessage = (msg) => {
        const timestampedMsg = `${new Date().toLocaleTimeString()} - ${msg}`;
        setLog(prev => [...prev.slice(-49), timestampedMsg]); // Keep the last 50 logs
        console.log(`[OBD LOG] ${timestampedMsg}`);
    };
    
    // --- Data Interpretation Logic ---

    /**
     * Converts raw ELM327 hexadecimal response string into meaningful data.
     * @param {string} rawHex - E.g., '41 0C 15 B8\r\r>'
     * @returns {object|null} { key: 'RPM', value: 1390 }
     */
    const processElmResponse = useCallback((rawHex) => {
        // Clean up the response from the adapter (remove prompt characters like '>' and carriage returns)
        const cleanedResponse = rawHex.trim().replace(/>/g, '').replace(/\r/g, '').toUpperCase();
        const parts = cleanedResponse.split(/\s+/).filter(p => p.length > 0);

        if (parts.length < 2) {
             // Handle simple responses like 'OK', 'NO DATA', 'SEARCHING...'
            if (cleanedResponse === 'OK' || cleanedResponse.includes('SEARCHING')) return { key: 'STATUS', value: cleanedResponse };
            if (cleanedResponse.includes('NO DATA')) return { key: 'ERROR', value: 'NO DATA' };
            return null;
        }

        // Standard Mode 01 response starts with 41 (40h + 1h mode)
        if (parts[0] === '41') { 
            const pid = parts[1]; // The PID (e.g., 0C)
            
            // PID 0C: Engine RPM (A, B) -> Formula: ((256 * A) + B) / 4
            if (pid === '0C' && parts.length >= 4) {
                const A = parseInt(parts[2], 16);
                const B = parseInt(parts[3], 16);
                const rpm = ((256 * A) + B) / 4;
                return { key: 'RPM', value: rpm };
            }

            // PID 05: Engine Coolant Temperature (A) -> Formula: A - 40
            if (pid === '05' && parts.length >= 3) {
                const A = parseInt(parts[2], 16);
                const tempC = A - 40;
                return { key: 'CoolantTemp', value: tempC };
            }

            // PID 0D: Vehicle Speed (A) -> Formula: A
            if (pid === '0D' && parts.length >= 3) {
                const speed = parseInt(parts[2], 16);
                return { key: 'SpeedKmH', value: speed };
            }
            // Add more PIDs and their decoding formulas here...
        }
        
        // Mode 03 response for DTCs (Diagnostic Trouble Codes)
        if (parts[0] === '43') { // 40h + 3h mode
            // DTC response logic is complex, involving decoding groups of 2 bytes.
            // For now, return the raw DTC data for later processing
            return { key: 'RAW_DTC', value: parts.slice(1).join(' ') };
        }

        return null; 
    }, []);

    // --- OBD Interaction ---
    
    /**
     * Sends a raw command to the OBD adapter and reads the response.
     * @param {string} command - The raw ELM327 command, e.g., '010C' or 'AT Z'.
     */
    const sendCommand = useCallback(async (command, serviceUuid = OBD_SERVICE_UUID, characteristicUuid = OBD_CHARACTERISTIC_UUID) => {
        if (!device || !isConnected) {
            logMessage("Error: Not connected to OBD device.");
            return null;
        }

        try {
            // ELM327 commands often need a Carriage Return (\r) to execute
            const elmCommand = command + '\r'; 
            const base64Command = stringToBase64(elmCommand);
            
            logMessage(`Sending command: ${command}`);

            // 1. Write the command
            await device.writeCharacteristicWithResponseForService(
                serviceUuid, 
                characteristicUuid, 
                base64Command
            );

            // 2. Read the response
            const readCharacteristic = await device.readCharacteristicForService(
                serviceUuid, 
                characteristicUuid
            );

            const rawResponse = base64ToString(readCharacteristic.value).trim();
            
            // 3. Process the response
            const processed = processElmResponse(rawResponse);
            
            if (processed && processed.key && processed.value !== undefined) {
                if (processed.key !== 'STATUS' && processed.key !== 'ERROR') {
                    setObdData(prev => ({ ...prev, [processed.key]: processed.value }));
                }
                logMessage(`Data processed: ${processed.key} = ${processed.value}`);
            } else {
                logMessage(`Received raw: ${rawResponse}`);
            }

            return rawResponse;

        } catch (error) {
            logMessage(`Command ${command} FAILED: ${error.message}`);
            return null;
        }
    }, [device, isConnected, logMessage, processElmResponse]);

    // Simple loop to request common PIDs periodically for real-time data
    const startDataStream = useCallback((connectedDevice) => {
        if (!connectedDevice) return () => {};

        // Commands to initialize the ELM327 chip (essential steps)
        const initializationCommands = [
            'AT Z',    // Reset ELM device
            'AT E0',   // Echo Off
            'AT L0',   // Linefeeds Off
            'AT S0',   // Spaces Off
            'AT SP 0', // Set protocol to Auto
        ];

        // Ensure initialization happens before starting the data loop
        const initialize = async () => {
            logMessage("Starting ELM327 Initialization Sequence...");
            for (const cmd of initializationCommands) {
                await sendCommand(cmd);
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for device readiness
            }
            logMessage("Initialization complete. Starting data stream.");
        };

        initialize();

        // PIDs to continuously monitor
        const pids = ['010C', '010D', '0105']; // RPM, Speed, Temp

        const intervalId = setInterval(() => {
            // Cycle through PIDs sequentially
            const nextPid = pids[Math.floor(Math.random() * pids.length)];
            sendCommand(nextPid);
        }, 500); // Poll every 500ms for continuous updates

        // Return the cleanup function
        return () => clearInterval(intervalId);
    }, [sendCommand, logMessage]);


    // --- Bluetooth Management ---

    const scanForDevices = () => {
        if (isScanning) return;
        setScannedDevices({});
        setIsScanning(true);
        logMessage("Starting device scan...");
        
        // Request Permissions before scanning (mandatory on Android/iOS)
        // Note: You must handle permission requests for Bluetooth/Location in your main app component
        // or a dedicated permissions utility, as the manager alone doesn't grant them.

        manager.startDeviceScan(null, { allowDuplicates: false }, (error, scannedDevice) => {
            if (error) {
                logMessage(`Scanning error: ${error.message}`);
                setIsScanning(false);
                return;
            }
            
            // Filter devices by name (ELM, OBD, or similar)
            if (scannedDevice.name && (scannedDevice.name.toUpperCase().includes('OBD') || scannedDevice.name.toUpperCase().includes('ELM') || scannedDevice.serviceUUIDs?.includes(OBD_SERVICE_UUID))) {
                setScannedDevices(prev => ({ ...prev, [scannedDevice.id]: scannedDevice }));
            }
        });

        // Stop scanning after 15 seconds
        setTimeout(() => {
            manager.stopDeviceScan();
            setIsScanning(false);
            logMessage(`Scan stopped. Found ${Object.keys(scannedDevices).length} devices.`);
        }, 15000);
    };

    const connectToDevice = async (deviceToConnect) => {
        manager.stopDeviceScan(); 
        setIsScanning(false);

        try {
            logMessage(`Attempting connection to ${deviceToConnect.name || 'Unknown Device'}...`);
            const connectedDevice = await deviceToConnect.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            await connectedDevice.requestMTU(256); // Optimize data throughput
            
            setDevice(connectedDevice);
            setIsConnected(true);
            logMessage(`Successfully connected to ${connectedDevice.name}.`);

            // Start the data streaming loop
            const cleanupStream = startDataStream(connectedDevice);
            
            // Add a listener to handle unexpected disconnects
            const disconnectListener = connectedDevice.onDisconnected((error, disconnectedDevice) => {
                logMessage(`Device disconnected: ${error ? error.message : 'User action'}`);
                setDevice(null);
                setIsConnected(false);
                cleanupStream(); 
                disconnectListener.remove(); 
            });

        } catch (error) {
            logMessage(`Connection failed: ${error.message}`);
            setIsConnected(false);
        }
    };
    
    const disconnect = async () => {
        if (device) {
            logMessage(`Disconnecting from ${device.name}...`);
            try {
                // Cancel connection will trigger the onDisconnected listener which handles cleanup
                await device.cancelConnection(); 
            } catch (e) {
                // If cancellation fails, force state reset
                logMessage(`Error during disconnection: ${e.message}. Resetting state.`);
                setIsConnected(false);
                setDevice(null);
                setObdData({});
            }
        } else {
            setIsConnected(false);
            setDevice(null);
            setObdData({});
        }
    };

    // Initial Bluetooth state check
    useEffect(() => {
        let stateSubscription;
        try {
            stateSubscription = manager.onStateChange((state) => {
                if (state === 'PoweredOn') {
                    logMessage("Bluetooth is ready.");
                    // Check permissions here if not handled elsewhere
                } else {
                    logMessage(`Bluetooth State: ${state}. Please enable Bluetooth.`);
                }
            }, true);
        } catch(e) {
            logMessage(`Error initializing BLE manager: ${e.message}`);
        }

        return () => {
             // Cleanup BleManager instance and subscription when component unmounts
            if (stateSubscription) stateSubscription.remove();
            manager.destroy(); 
        };
    }, [logMessage]);
    
    const contextValue = useMemo(() => ({
        isConnected,
        isScanning,
        device,
        scannedDevices,
        obdData,
        log,
        scanForDevices,
        connectToDevice,
        disconnect,
        sendCommand,
    }), [isConnected, isScanning, device, scannedDevices, obdData, log, scanForDevices, connectToDevice, disconnect, sendCommand]);


    return (
        <OBDContext.Provider value={contextValue}>
            {children}
        </OBDContext.Provider>
    );
};