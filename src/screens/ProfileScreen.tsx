import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { UserProfile, saveUserProfile, getUserProfile } from '../services/storage';

type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [customLinks, setCustomLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getUserProfile();
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      setPhone(profile.phone);
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setCustomLinks(profile.customLinks || []);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните обязательные поля');
      return;
    }

    const profile: UserProfile = {
      firstName,
      lastName,
      email,
      phone,
      linkedin: linkedin || undefined,
      github: github || undefined,
      customLinks,
    };

    try {
      await saveUserProfile(profile);
      Alert.alert('Успешно', 'Профиль сохранен');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить профиль');
    }
  };

  const addCustomLink = () => {
    if (newLinkLabel && newLinkUrl) {
      setCustomLinks([...customLinks, { label: newLinkLabel, url: newLinkUrl }]);
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_: any, i: number) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Мой Профиль</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Имя *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Введите имя"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Фамилия *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Введите фамилию"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Телефон *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+7 (999) 999-99-99"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>LinkedIn</Text>
        <TextInput
          style={styles.input}
          value={linkedin}
          onChangeText={setLinkedin}
          placeholder="https://linkedin.com/in/username"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>GitHub</Text>
        <TextInput
          style={styles.input}
          value={github}
          onChangeText={setGithub}
          placeholder="https://github.com/username"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.sectionTitle}>Дополнительные ссылки</Text>

      {customLinks.map((link: { label: string; url: string }, index: number) => (
        <View key={index} style={styles.linkItem}>
          <View style={styles.linkInfo}>
            <Text style={styles.linkLabel}>{link.label}</Text>
            <Text style={styles.linkUrl}>{link.url}</Text>
          </View>
          <TouchableOpacity onPress={() => removeCustomLink(index)}>
            <Text style={styles.removeButton}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addLinkContainer}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          value={newLinkLabel}
          onChangeText={setNewLinkLabel}
          placeholder="Название (например, Twitter)"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          value={newLinkUrl}
          onChangeText={setNewLinkUrl}
          placeholder="https://..."
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addCustomLink}>
        <Text style={styles.addButtonText}>+ Добавить ссылку</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Сохранить профиль</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
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
    marginBottom: 30,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  linkItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkInfo: {
    flex: 1,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  linkUrl: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  removeButton: {
    fontSize: 24,
    color: '#ff4444',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  addLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInput: {
    width: '48%',
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    marginBottom: 30,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
