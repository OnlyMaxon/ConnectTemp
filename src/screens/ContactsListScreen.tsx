import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getSavedContacts, deleteContact, SavedContact } from '../services/storage';

type ContactsListScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export default function ContactsListScreen({ navigation }: ContactsListScreenProps) {
  const [contacts, setContacts] = useState<SavedContact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadContacts();
    });
    return unsubscribe;
  }, [navigation]);

  const loadContacts = async () => {
    const savedContacts = await getSavedContacts();
    setContacts(savedContacts);
  };

  const handleDeleteContact = (contactId: string, name: string) => {
    Alert.alert(
      'Удалить контакт?',
      `Вы уверены, что хотите удалить контакт ${name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact(contactId);
              loadContacts();
              Alert.alert('Успешно', 'Контакт удален');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить контакт');
            }
          },
        },
      ]
    );
  };

  const renderContact = ({ item }: { item: SavedContact }) => (
    <View style={styles.contactCard}>
      <TouchableOpacity
        style={styles.contactInfo}
        onPress={() => navigation.navigate('ReceivedContact', { contact: item })}
      >
        <Text style={styles.contactName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactDate}>
          Сохранен: {new Date(item.savedAt).toLocaleDateString('ru-RU')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          handleDeleteContact(item.id, `${item.firstName} ${item.lastName}`)
        }
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сохраненные контакты</Text>
      <Text style={styles.subtitle}>Всего: {contacts.length}</Text>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Нет сохраненных контактов</Text>
          <Text style={styles.emptyHint}>
            Обменяйтесь контактами через NFC на главном экране
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item: SavedContact) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
  },
  emptyHint: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
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
    marginBottom: 3,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  contactDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    fontSize: 24,
  },
});
