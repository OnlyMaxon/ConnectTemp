import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { UserProfile, saveContact } from '../services/storage';

interface ReceivedContactScreenProps {
  route: {
    params: {
      contact: UserProfile;
    };
  };
  navigation: any;
}

export default function ReceivedContactScreen({
  route,
  navigation,
}: ReceivedContactScreenProps) {
  const { contact } = route.params;

  const handleSaveContact = async () => {
    try {
      await saveContact(contact);
      Alert.alert('Успешно', 'Контакт сохранен', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить контакт');
    }
  };

  const handleClose = () => {
    navigation.navigate('Home');
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть ссылку');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Получен контакт</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>
          {contact.firstName} {contact.lastName}
        </Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Email</Text>
          <TouchableOpacity onPress={() => openLink(`mailto:${contact.email}`)}>
            <Text style={styles.value}>{contact.email}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Телефон</Text>
          <TouchableOpacity onPress={() => openLink(`tel:${contact.phone}`)}>
            <Text style={styles.value}>{contact.phone}</Text>
          </TouchableOpacity>
        </View>

        {contact.linkedin && (
          <View style={styles.infoSection}>
            <Text style={styles.label}>LinkedIn</Text>
            <TouchableOpacity onPress={() => openLink(contact.linkedin!)}>
              <Text style={styles.linkValue}>{contact.linkedin}</Text>
            </TouchableOpacity>
          </View>
        )}

        {contact.github && (
          <View style={styles.infoSection}>
            <Text style={styles.label}>GitHub</Text>
            <TouchableOpacity onPress={() => openLink(contact.github!)}>
              <Text style={styles.linkValue}>{contact.github}</Text>
            </TouchableOpacity>
          </View>
        )}

        {contact.customLinks && contact.customLinks.length > 0 && (
          <View style={styles.linksSection}>
            <Text style={styles.sectionTitle}>Дополнительные ссылки</Text>
            {contact.customLinks.map((link, index) => (
              <View key={index} style={styles.customLink}>
                <Text style={styles.linkLabel}>{link.label}</Text>
                <TouchableOpacity onPress={() => openLink(link.url)}>
                  <Text style={styles.linkValue}>{link.url}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveContact}>
          <Text style={styles.saveButtonText}>Сохранить контакт</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  linkValue: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  linksSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  customLink: {
    marginBottom: 15,
  },
  linkLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
});
