import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { AuthContext } from "../navigation/AuthContext"; 
import * as Google from "expo-auth-session/providers/google";
import { BASE } from "../navigation/api";  // correct relative path

// Helper function to replace alert() with console log messages
const showMessage = (message) => {
    console.log(`[USER MESSAGE] ${message}`);
    // NOTE: In a finished app, replace this with a custom Toast or Modal component.
};

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useContext(AuthContext); 

    const handleLogin = async () => {
        try {
            const res = await fetch(`${BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok && data.session) {
                // fetch full user profile after successful login
                
                const userRes = await fetch(`${BASE}/auth/user/${data.session.user_id}`);
                const userData = await userRes.json();

                await login({
                    token: data.session.token,
                    user: userData, 
                });
                
                // Replaced alert()
                showMessage("Login successful!");
            } else {
                // Replaced alert()
                showMessage(data.detail || data.error || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            // Replaced alert()
            showMessage("Error connecting to server");
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.header}>
                <Text style={styles.logo}>VROOM</Text>
                <TouchableOpacity style={styles.helpButton}>
                    <Text style={styles.helpText}>?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Your car's digital doctor</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        placeholderTextColor="#666"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#666"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.googleButton}>
                        <Text style={styles.googleButtonText}>G Sign in with Google</Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                            <Text style={styles.signupLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: "700",
        color: "#fff",
    },
    helpButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    helpText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 40,
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    label: {
        fontSize: 14,
        color: "#fff",
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: "#FFC107",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 24,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },
    forgotPassword: {
        color: "#fff",
        textAlign: "center",
        marginTop: 16,
        fontSize: 14,
    },
    googleButton: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 16,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    signupText: {
        color: "#999",
        fontSize: 14,
    },
    signupLink: {
        color: "#FFC107",
        fontSize: 14,
        fontWeight: "700",
    },
});