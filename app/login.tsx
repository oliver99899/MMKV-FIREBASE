import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebaseConfig";
import { storageHelper } from "../storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      storageHelper.setString("uid", user.user.uid);
      router.replace("/home");
    } catch (err) {
      console.log(err);
      alert("Login gagal! Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Glass overlay background */}
      <View style={styles.overlay} />

      <View style={styles.formBox}>
        <Text style={styles.title}>Selamat Datang</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#9BB8FF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#9BB8FF"
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={login}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.linkText}>
            Belum punya akun?{" "}
            <Text style={styles.linkBold}>Daftar sekarang</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85C8FF",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  formBox: {
    width: "90%",
    maxWidth: 380,
    padding: 30,
    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",

    shadowColor: "#4DA3FF",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,

    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 24,
    letterSpacing: 0.5,
  },

  input: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0E3FF",
    color: "#000",
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#4DA3FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#4DA3FF",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonDisabled: {
    backgroundColor: "#9BCBFF",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  linkContainer: {
    marginTop: 16,
  },

  linkText: {
    color: "#E9F4FF",
    fontSize: 14,
  },

  linkBold: {
    color: "#fff",
    fontWeight: "800",
  },
});
