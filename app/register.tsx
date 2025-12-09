import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { storageHelper } from "../storage";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");

  const [loading, setLoading] = useState(false);

  const register = async () => {
    try {
      if (!email || !password || !confirmPassword || !nama || !nim || !jurusan || !angkatan) {
        alert("Semua field harus diisi!");
        return;
      }

      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password harus sama!");
        return;
      }

      if (password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
      }

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const mahasiswaData = {
        userId,
        email,
        Nama: nama,
        NIM: nim,
        Jurusan: jurusan,
        Angkatan: angkatan,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "mahasiswa"), mahasiswaData);

      storageHelper.setString("uid", userId);

      alert("Registrasi berhasil!");
      router.replace("/home");

    } catch (err: any) {
      console.log("Error:", err);

      let msg = "Registrasi gagal!";
      if (err.code === "auth/email-already-in-use") msg = "Email sudah terdaftar!";
      if (err.code === "auth/invalid-email") msg = "Format email tidak valid!";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formBox}>
          <Text style={styles.title}>Registrasi Mahasiswa</Text>

          {/* Informasi Akun */}
          <Text style={styles.section}>Informasi Akun</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#9BB8FF"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#9BB8FF"
            style={styles.input}
          />

          <TextInput
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Konfirmasi Password"
            placeholderTextColor="#9BB8FF"
            style={styles.input}
          />

          {/* Data Mahasiswa */}
          <Text style={styles.section}>Data Mahasiswa</Text>

          <TextInput
            value={nama}
            onChangeText={setNama}
            placeholder="Nama Lengkap"
            placeholderTextColor="#9BB8FF"
            style={styles.input}
          />

          <TextInput
            value={nim}
            onChangeText={setNim}
            placeholder="NIM"
            placeholderTextColor="#9BB8FF"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            value={jurusan}
            onChangeText={setJurusan}
            placeholder="Jurusan"
            placeholderTextColor="#9BB8FF"
            style={styles.input}
          />

          <TextInput
            value={angkatan}
            onChangeText={setAngkatan}
            placeholder="Angkatan"
            placeholderTextColor="#9BB8FF"
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={register}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 15 }}>
            <Text style={styles.linkText}>
              Sudah punya akun? <Text style={styles.linkBold}>Login di sini</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

  scrollArea: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  formBox: {
    width: "90%",
    maxWidth: 380,
    padding: 26,
    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",

    shadowColor: "#4DA3FF",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
  },

  section: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 18,
  },

  input: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0E3FF",
    fontSize: 16,
    marginBottom: 12,
  },

  button: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#4DA3FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,

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

  linkText: {
    color: "#E9F4FF",
    textAlign: "center",
    fontSize: 14,
  },

  linkBold: {
    color: "#fff",
    fontWeight: "700",
  },
});
