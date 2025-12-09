import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../firebaseConfig";
import { storageHelper } from "../storage";

interface MahasiswaData {
  Nama: string;
  NIM: string;
  Jurusan: string;
  Angkatan: string;
}

export default function Home() {
  const [data, setData] = useState<MahasiswaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const uid = storageHelper.getString("uid");
      if (!uid) throw new Error("UID tidak ditemukan. Silakan login kembali.");

      const q = query(
        collection(db, "mahasiswa"),
        where("userId", "==", uid)
      );

      const snap = await getDocs(q);

      const arr: MahasiswaData[] = [];
      snap.forEach((doc) => arr.push(doc.data() as MahasiswaData));

      setData(arr);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    storageHelper.remove("uid");
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFIL MAHASISWA</Text>
      </View>

      {/* Data Section */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Data Mahasiswa</Text>

        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4DA3FF" />
            <Text style={styles.loadingText}>Memuat data...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && data.length > 0 && (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Nama:</Text>
              <Text style={styles.value}>{data[0].Nama}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>NIM:</Text>
              <Text style={styles.value}>{data[0].NIM}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Jurusan:</Text>
              <Text style={styles.value}>{data[0].Jurusan}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Angkatan:</Text>
              <Text style={styles.value}>{data[0].Angkatan}</Text>
            </View>
          </View>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F4FF",
  },

  /* Header Blue */
  header: {
    backgroundColor: "#85C8FF",
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#4DA3FF",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 0.5,
  },

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4DA3FF",
    marginBottom: 16,
  },

  /* Card Mahasiswa */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,

    borderWidth: 1,
    borderColor: "#D0E7FF",

    shadowColor: "#4DA3FF",
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  label: {
    width: 100,
    color: "#6E7B8A",
    fontWeight: "600",
  },

  value: {
    flex: 1,
    fontWeight: "700",
    color: "#2D3A4A",
  },

  centerContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },

  loadingText: {
    marginTop: 10,
    color: "#4DA3FF",
  },

  errorBox: {
    backgroundColor: "#FFE5E7",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },

  errorText: {
    color: "#B71C1C",
  },

  /* Logout Button */
  logoutButton: {
    backgroundColor: "#4DA3FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4DA3FF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
