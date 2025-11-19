import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getUserProfile, getSavedContacts, SavedContact } from '../services/storage';
import { initNFC, isNFCEnabled, readNFC, startNFCListener, stopNFCListener } from '../services/nfc';
import { UserProfile } from '../services/storage';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [contacts, setContacts] = useState<SavedContact[]>([]);

  useEffect(() => {
    checkNFC();
    checkProfile();
    loadContacts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkProfile();
      loadContacts();
    });
    return unsubscribe;
  }, [navigation]);

  const checkNFC = async () => {
    const supported = await initNFC();
    setNfcSupported(supported);
    
    if (supported) {
      const enabled = await isNFCEnabled();
      setNfcEnabled(enabled);
    }
  };

  const checkProfile = async () => {
    const profile = await getUserProfile();
    setHasProfile(profile !== null);
  };

  const loadContacts = async () => {
    const savedContacts = await getSavedContacts();
    setContacts(savedContacts);
  };

  const handleContactReceived = (profile: UserProfile) => {
    stopListening();
    navigation.navigate('ReceivedContact', { contact: profile });
  };

  const startListening = async () => {
    if (!hasProfile) {
      Alert.alert(
        'Профиль не создан',
        'Сначала создайте свой профиль',
        [{ text: 'Создать', onPress: () => navigation.navigate('Profile') }]
      );
      return;
    }

    if (!nfcEnabled) {
      Alert.alert('NFC отключен', 'Пожалуйста, включите NFC в настройках');
      return;
    }

    try {
      setIsListening(true);
      await startNFCListener(handleContactReceived);
      Alert.alert('Готов к обмену', 'Поднесите телефоны друг к другу');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось запустить NFC');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    await stopNFCListener();
    setIsListening(false);
  };

  const renderContact = ({ item }: { item: SavedContact }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => navigation.navigate('ReceivedContact', { contact: item })}
    >
      <Text style={styles.contactName}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.contactEmail}>{item.email}</Text>
      <Text style={styles.contactDate}>
        {new Date(item.savedAt).toLocaleDateString('ru-RU')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NFC Contact Share</Text>
        <Text style={styles.subtitle}>Обмен контактами через NFC</Text>
      </View>

      {!nfcSupported && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ NFC не поддерживается на этом устройстве</Text>
        </View>
      )}

      {nfcSupported && !nfcEnabled && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ NFC отключен. Включите в настройках</Text>
        </View>
      )}

      <View style={styles.mainSection}>
        {!hasProfile ? (
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.createProfileText}>Создать профиль</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.editProfileText}>Редактировать профиль</Text>
            </TouchableOpacity>

            {isListening ? (
              <View style={styles.listeningContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.listeningText}>Ожидание NFC...</Text>
                <TouchableOpacity style={styles.stopButton} onPress={stopListening}>
                  <Text style={styles.stopButtonText}>Остановить</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.shareButton,
                  (!nfcEnabled || !nfcSupported) && styles.disabledButton,
                ]}
                onPress={startListening}
                disabled={!nfcEnabled || !nfcSupported}
              >
                <Text style={styles.shareButtonText}>📱 Обменяться контактами</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View style={styles.contactsSection}>
        <Text style={styles.contactsTitle}>Сохраненные контакты ({contacts.length})</Text>
        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Нет сохраненных контактов</Text>
          </View>
        ) : (
          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={(item: SavedContact) => item.id}
            style={styles.contactsList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
  },
  mainSection: {
    padding: 20,
  },
  createProfileButton: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  createProfileText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editProfileButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editProfileText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#34C759',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  listeningContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  listeningText: {
    fontSize: 18,
    color: '#333',
    marginTop: 15,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactsSection: {
    flex: 1,
    padding: 20,
  },
  contactsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  contactsList: {
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  contactDate: {
    fontSize: 12,
    color: '#999',
  },
});
