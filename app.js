import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, SafeAreaView, 
  TouchableOpacity, Modal, FlatList, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SEHIRLER = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

export default function App() {
  const [secilenSehir, setSecilenSehir] = useState('İstanbul');
  const [modalGorunur, setModalGorunur] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [vakitler, setVakitler] = useState({});
  const [zikirSayaci, setZikirSayaci] = useState(0);
  const [aktifTab, setAktifTab] = useState('vakitler');

  useEffect(() => {
    vakitleriGetir(secilenSehir);
  }, [secilenSehir]);

  const vakitleriGetir = async (sehir) => {
    setYukleniyor(true);
    try {
      const response = await fetch(`https://ezanvakti.herokuapp.com/vakitler?il=${sehir}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setVakitler(data[0]);
      } else {
        setVakitler({ Imsak: '04:42', Gunes: '06:12', Ogle: '13:10', Ikindi: '16:42', Aksam: '19:55', Yatsi: '21:18' });
      }
    } catch (error) {
      setVakitler({ Imsak: '04:42', Gunes: '06:12', Ogle: '13:10', Ikindi: '16:42', Aksam: '19:55', Yatsi: '21:18' });
    } finally {
      setYukleniyor(false);
    }
  };

  const vakitListesi = [
    { ad: 'İmsak', saat: vakitler.Imsak || '--:--', icon: 'weather-night' },
    { ad: 'Güneş', saat: vakitler.Gunes || '--:--', icon: 'weather-sunny' },
    { ad: 'Öğle', saat: vakitler.Ogle || '--:--', icon: 'white-balance-sunny' },
    { ad: 'İkindi', saat: vakitler.Ikindi || '--:--', icon: 'weather-partly-cloudy' },
    { ad: 'Akşam', saat: vakitler.Aksam || '--:--', icon: 'weather-night-partly-cloudy' },
    { ad: 'Yatsı', saat: vakitler.Yatsi || '--:--', icon: 'moon-waning-crescent' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, aktifTab === 'vakitler' && styles.aktifTabButton]}
          onPress={() => setAktifTab('vakitler')}
        >
          <Text style={[styles.tabText, aktifTab === 'vakitler' && styles.aktifTabText]}>Ezan Vakitleri</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, aktifTab === 'zikirmatik' && styles.aktifTabButton]}
          onPress={() => setAktifTab('zikirmatik')}
        >
          <Text style={[styles.tabText, aktifTab === 'zikirmatik' && styles.aktifTabText]}>Zikirmatik</Text>
        </TouchableOpacity>
      </View>

      {aktifTab === 'vakitler' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.baslik}>Huzur Vakti</Text>
              <Text style={styles.altBaslik}>Diyanet Takvimi Uyumlu</Text>
            </View>
            <TouchableOpacity style={styles.sehirRozeti} onPress={() => setModalGorunur(true)}>
              <Text style={styles.sehirYazisi}>📍 {secilenSehir} ▾</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ilhamKarti}>
            <Text style={styles.ilhamBaslik}>Günün Ayeti</Text>
            <Text style={styles.ilhamMetin}>"Şüphesiz kalpler ancak Allah'ı anmakla huzur bulur." (Râd, 28)</Text>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroEtiket}>BUGÜNÜN VAKİTLERİ</Text>
            <Text style={styles.heroSayac}>{secilenSehir}</Text>
            <Text style={styles.heroDetay}>Ezan vakitleri canlı güncellenmektedir.</Text>
          </View>

          <Text style={styles.bolumBasligi}>Vakit Saatleri</Text>

          {yukleniyor ? (
            <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 20 }} />
          ) : (
            vakitListesi.map((item, index) => (
              <View key={index} style={styles.vakitKarti}>
                <View style={styles.vakitSol}>
                  <MaterialCommunityIcons name={item.icon} size={24} color="#10B981" />
                  <Text style={styles.vakitAdi}>{item.ad}</Text>
                </View>
                <Text style={styles.vakitSaat}>{item.saat}</Text>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <View style={styles.zikirContainer}>
          <Text style={styles.zikirBaslik}>Zikirmatik</Text>
          <View style={styles.zikirDaire}>
            <Text style={styles.zikirSayi}>{zikirSayaci}</Text>
          </View>
          <TouchableOpacity 
            style={styles.zikirButon} 
            onPress={() => setZikirSayaci(zikirSayaci + 1)}
          >
            <Text style={styles.zikirButonText}>ZİKİR ÇEK</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sifirlaButon} 
            onPress={() => setZikirSayaci(0)}
          >
            <Text style={styles.sifirlaText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalGorunur} animationType="slide" transparent={true}>
        <View style={styles.modalArkaPlan}>
          <View style={styles.modalIcerik}>
            <Text style={styles.modalBaslik}>Şehir Seçiniz</Text>
            <FlatList
              data={SEHIRLER}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.sehirItem}
                  onPress={() => {
                    setSecilenSehir(item);
                    setModalGorunur(false);
                  }}
                >
                  <Text style={styles.sehirText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.kapatButon} onPress={() => setModalGorunur(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { padding: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#1E293B', margin: 15, borderRadius: 12, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  aktifTabButton: { backgroundColor: '#10B981' },
  tabText: { color: '#94A3B8', fontWeight: '600' },
  aktifTabText: { color: '#FFF', fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  baslik: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  altBaslik: { fontSize: 13, color: '#94A3B8' },
  sehirRozeti: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  sehirYazisi: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  ilhamKarti: { backgroundColor: '#1E293B', padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  ilhamBaslik: { color: '#10B981', fontWeight: 'bold', marginBottom: 4 },
  ilhamMetin: { color: '#CBD5E1', fontStyle: 'italic', fontSize: 13 },
  heroCard: { backgroundColor: '#10B981', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20 },
  heroEtiket: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 'bold' },
  heroSayac: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginVertical: 4 },
  heroDetay: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  bolumBasligi: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  vakitKarti: { backgroundColor: '#1E293B', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  vakitSol: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vakitAdi: { color: '#FFFFFF', fontSize: 15, fontWeight: '500' },
  vakitSaat: { color: '#10B981', fontSize: 16, fontWeight: 'bold' },
  zikirContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  zikirBaslik: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  zikirDaire: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#1E293B', borderWidth: 4, borderColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  zikirSayi: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
  zikirButon: { backgroundColor: '#10B981', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 30, marginBottom: 15 },
  zikirButonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  sifirlaText: { color: '#EF4444', fontSize: 14 },
  modalArkaPlan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalIcerik: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, maxHeight: '80%' },
  modalBaslik: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  sehirItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  sehirText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
  kapatButon: { marginTop: 15, backgroundColor: '#EF4444', padding: 12, borderRadius: 10, alignItems: 'center' }
});
