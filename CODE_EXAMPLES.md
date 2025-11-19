# Примеры кода и API использования

## 📚 Содержание

1. [Работа с профилем](#работа-с-профилем)
2. [NFC операции](#nfc-операции)
3. [Управление контактами](#управление-контактами)
4. [Навигация](#навигация)
5. [Кастомизация UI](#кастомизация-ui)

---

## 🧑 Работа с профилем

### Создание профиля

```typescript
import { saveUserProfile, UserProfile } from '../services/storage';

const createProfile = async () => {
  const profile: UserProfile = {
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    linkedin: 'https://linkedin.com/in/ivanovivan',
    github: 'https://github.com/ivanovivan',
    customLinks: [
      { label: 'Twitter', url: 'https://twitter.com/ivanovivan' },
      { label: 'Telegram', url: 'https://t.me/ivanovivan' }
    ]
  };

  try {
    await saveUserProfile(profile);
    console.log('Профиль сохранен!');
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  }
};
```

### Загрузка профиля

```typescript
import { getUserProfile } from '../services/storage';

const loadProfile = async () => {
  const profile = await getUserProfile();
  
  if (profile) {
    console.log('Профиль найден:', profile);
    console.log(`${profile.firstName} ${profile.lastName}`);
  } else {
    console.log('Профиль не создан');
  }
};
```

### Обновление профиля

```typescript
const updateProfile = async () => {
  // Получаем текущий профиль
  const currentProfile = await getUserProfile();
  
  if (currentProfile) {
    // Обновляем поля
    const updatedProfile: UserProfile = {
      ...currentProfile,
      phone: '+7 (999) 999-99-99', // Новый телефон
      customLinks: [
        ...currentProfile.customLinks,
        { label: 'Website', url: 'https://mysite.com' } // Добавили ссылку
      ]
    };
    
    await saveUserProfile(updatedProfile);
    console.log('Профиль обновлен!');
  }
};
```

---

## 📡 NFC операции

### Инициализация NFC

```typescript
import { initNFC, isNFCEnabled } from '../services/nfc';
import { Alert } from 'react-native';

const setupNFC = async () => {
  // Проверяем поддержку
  const supported = await initNFC();
  
  if (!supported) {
    Alert.alert('Ошибка', 'Ваше устройство не поддерживает NFC');
    return false;
  }
  
  // Проверяем включен ли NFC
  const enabled = await isNFCEnabled();
  
  if (!enabled) {
    Alert.alert(
      'NFC выключен',
      'Пожалуйста, включите NFC в настройках устройства'
    );
    return false;
  }
  
  console.log('NFC готов к работе!');
  return true;
};
```

### Прослушивание NFC

```typescript
import { startNFCListener, stopNFCListener } from '../services/nfc';
import { UserProfile } from '../services/storage';

const startListening = async () => {
  try {
    // Callback при получении контакта
    const onContactReceived = (profile: UserProfile) => {
      console.log('Получен контакт:', profile);
      Alert.alert(
        'Контакт получен!',
        `${profile.firstName} ${profile.lastName}`
      );
      
      // Можно автоматически перейти на экран
      navigation.navigate('ReceivedContact', { contact: profile });
    };
    
    // Начинаем прослушивание
    await startNFCListener(onContactReceived);
    
    Alert.alert(
      'Готов к обмену',
      'Поднесите телефоны друг к другу'
    );
  } catch (error) {
    console.error('Ошибка NFC:', error);
    Alert.alert('Ошибка', 'Не удалось запустить NFC');
  }
};

const stopListening = async () => {
  await stopNFCListener();
  console.log('Прослушивание остановлено');
};
```

### Запись в NFC (для продвинутых случаев)

```typescript
import { writeNFC } from '../services/nfc';
import { getUserProfile } from '../services/storage';

const writeContactToTag = async () => {
  const profile = await getUserProfile();
  
  if (!profile) {
    Alert.alert('Ошибка', 'Сначала создайте профиль');
    return;
  }
  
  Alert.alert(
    'Запись в NFC метку',
    'Поднесите NFC метку к телефону'
  );
  
  const success = await writeNFC(profile);
  
  if (success) {
    Alert.alert('Успешно', 'Данные записаны в NFC метку');
  } else {
    Alert.alert('Ошибка', 'Не удалось записать данные');
  }
};
```

### Чтение из NFC метки

```typescript
import { readNFC } from '../services/nfc';

const readFromTag = async () => {
  Alert.alert(
    'Чтение NFC метки',
    'Поднесите NFC метку к телефону'
  );
  
  const profile = await readNFC();
  
  if (profile) {
    console.log('Прочитан контакт:', profile);
    navigation.navigate('ReceivedContact', { contact: profile });
  } else {
    Alert.alert('Ошибка', 'Не удалось прочитать метку');
  }
};
```

---

## 💾 Управление контактами

### Сохранение контакта

```typescript
import { saveContact, UserProfile } from '../services/storage';

const saveReceivedContact = async (contact: UserProfile) => {
  try {
    await saveContact(contact);
    
    Alert.alert(
      'Успешно',
      'Контакт сохранен в ваш список'
    );
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    Alert.alert('Ошибка', 'Не удалось сохранить контакт');
  }
};
```

### Получение всех контактов

```typescript
import { getSavedContacts } from '../services/storage';

const loadAllContacts = async () => {
  const contacts = await getSavedContacts();
  
  console.log(`Всего контактов: ${contacts.length}`);
  
  contacts.forEach((contact, index) => {
    console.log(`${index + 1}. ${contact.firstName} ${contact.lastName}`);
    console.log(`   Email: ${contact.email}`);
    console.log(`   Сохранен: ${new Date(contact.savedAt).toLocaleString()}`);
  });
  
  return contacts;
};
```

### Удаление контакта

```typescript
import { deleteContact } from '../services/storage';

const removeContact = async (contactId: string) => {
  Alert.alert(
    'Удалить контакт?',
    'Это действие нельзя отменить',
    [
      {
        text: 'Отмена',
        style: 'cancel'
      },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteContact(contactId);
            Alert.alert('Успешно', 'Контакт удален');
            // Обновите список
            loadAllContacts();
          } catch (error) {
            Alert.alert('Ошибка', 'Не удалось удалить контакт');
          }
        }
      }
    ]
  );
};
```

### Поиск контакта

```typescript
const searchContacts = async (query: string) => {
  const allContacts = await getSavedContacts();
  
  const results = allContacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = contact.email.toLowerCase();
    const searchQuery = query.toLowerCase();
    
    return fullName.includes(searchQuery) || email.includes(searchQuery);
  });
  
  console.log(`Найдено: ${results.length} контактов`);
  return results;
};
```

---

## 🧭 Навигация

### Базовая навигация

```typescript
import { useNavigation } from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();
  
  // Переход на другой экран
  const goToProfile = () => {
    navigation.navigate('Profile');
  };
  
  // Возврат назад
  const goBack = () => {
    navigation.goBack();
  };
  
  // Переход с параметрами
  const showContact = (contact: UserProfile) => {
    navigation.navigate('ReceivedContact', {
      contact: contact
    });
  };
  
  return (
    <View>
      <Button title="Открыть профиль" onPress={goToProfile} />
      <Button title="Назад" onPress={goBack} />
    </View>
  );
};
```

### Получение параметров

```typescript
import { useRoute } from '@react-navigation/native';

const ReceivedContactScreen = () => {
  const route = useRoute();
  const { contact } = route.params as { contact: UserProfile };
  
  return (
    <View>
      <Text>{contact.firstName} {contact.lastName}</Text>
      <Text>{contact.email}</Text>
    </View>
  );
};
```

### Реакция на фокус экрана

```typescript
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const HomeScreen = () => {
  // Выполняется каждый раз при возврате на экран
  useFocusEffect(
    useCallback(() => {
      console.log('Экран получил фокус');
      loadContacts(); // Обновляем данные
      
      return () => {
        console.log('Экран потерял фокус');
        // Cleanup
      };
    }, [])
  );
  
  return <View>...</View>;
};
```

---

## 🎨 Кастомизация UI

### Создание кастомной кнопки

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary'
}) => {
  const backgroundColor = {
    primary: '#007AFF',
    secondary: '#34C759',
    danger: '#FF3B30'
  }[variant];
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.5
  }
});

// Использование
<CustomButton
  title="Сохранить"
  onPress={handleSave}
  loading={isSaving}
/>
```

### Карточка контакта

```typescript
interface ContactCardProps {
  contact: SavedContact;
  onPress: () => void;
  onDelete: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onPress,
  onDelete
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {contact.firstName[0]}{contact.lastName[0]}
        </Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={styles.email}>{contact.email}</Text>
        <Text style={styles.date}>
          {new Date(contact.savedAt).toLocaleDateString('ru-RU')}
        </Text>
      </View>
      
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  initials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  date: {
    fontSize: 12,
    color: '#999'
  },
  deleteBtn: {
    padding: 10
  },
  deleteIcon: {
    fontSize: 20
  }
});
```

### Форма ввода с валидацией

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

interface ValidatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  validator?: (text: string) => string | null;
  required?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  validator,
  required = false
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleBlur = () => {
    if (required && !value) {
      setError('Это поле обязательно');
      return;
    }
    
    if (validator) {
      const validationError = validator(value);
      setError(validationError);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Валидаторы
const emailValidator = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Неверный формат email';
};

const phoneValidator = (phone: string) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) ? null : 'Неверный формат телефона';
};

// Использование
<ValidatedInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="example@mail.com"
  validator={emailValidator}
  required
/>
```

---

## 🔗 Открытие ссылок

```typescript
import { Linking, Alert } from 'react-native';

// Открыть email
const openEmail = (email: string) => {
  Linking.openURL(`mailto:${email}`).catch(() => {
    Alert.alert('Ошибка', 'Не удалось открыть email');
  });
};

// Позвонить
const makeCall = (phone: string) => {
  Linking.openURL(`tel:${phone}`).catch(() => {
    Alert.alert('Ошибка', 'Не удалось совершить звонок');
  });
};

// Открыть URL
const openURL = (url: string) => {
  Linking.openURL(url).catch(() => {
    Alert.alert('Ошибка', 'Не удалось открыть ссылку');
  });
};

// Универсальная функция
const openLink = async (type: 'email' | 'phone' | 'url', value: string) => {
  const schemes = {
    email: `mailto:${value}`,
    phone: `tel:${value}`,
    url: value
  };
  
  const url = schemes[type];
  const canOpen = await Linking.canOpenURL(url);
  
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Ошибка', 'Не удалось открыть ссылку');
  }
};
```

---

## 🎯 Полный пример: Экран обмена

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { getUserProfile } from '../services/storage';
import { initNFC, isNFCEnabled, startNFCListener, stopNFCListener } from '../services/nfc';

const ShareScreen = ({ navigation }) => {
  const [nfcReady, setNfcReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    // Проверяем профиль
    const profile = await getUserProfile();
    setHasProfile(profile !== null);
    
    // Проверяем NFC
    const supported = await initNFC();
    const enabled = await isNFCEnabled();
    setNfcReady(supported && enabled);
  };

  const handleStartSharing = async () => {
    if (!hasProfile) {
      Alert.alert(
        'Профиль не создан',
        'Сначала создайте свой профиль',
        [{ text: 'Создать', onPress: () => navigation.navigate('Profile') }]
      );
      return;
    }

    if (!nfcReady) {
      Alert.alert('NFC не готов', 'Проверьте настройки NFC');
      return;
    }

    setIsListening(true);
    
    await startNFCListener((profile) => {
      setIsListening(false);
      navigation.navigate('ReceivedContact', { contact: profile });
    });

    Alert.alert('Готов к обмену', 'Поднесите телефоны друг к другу');
  };

  const handleStopSharing = async () => {
    await stopNFCListener();
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Обмен контактами</Text>

      {!hasProfile && (
        <TouchableOpacity 
          style={styles.warningCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.warningText}>
            ⚠️ Создайте профиль для обмена
          </Text>
        </TouchableOpacity>
      )}

      {!nfcReady && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            ⚠️ NFC не готов
          </Text>
        </View>
      )}

      {isListening ? (
        <View style={styles.listeningCard}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.listeningText}>
            Ожидание контакта...
          </Text>
          <TouchableOpacity 
            style={styles.stopButton}
            onPress={handleStopSharing}
          >
            <Text style={styles.stopButtonText}>Остановить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.shareButton,
            (!hasProfile || !nfcReady) && styles.disabled
          ]}
          onPress={handleStartSharing}
          disabled={!hasProfile || !nfcReady}
        >
          <Text style={styles.shareButtonText}>
            📱 Начать обмен
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  warningText: {
    color: '#856404',
    fontSize: 16
  },
  shareButton: {
    backgroundColor: '#34C759',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center'
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  disabled: {
    backgroundColor: '#ccc'
  },
  listeningCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center'
  },
  listeningText: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 20
  },
  stopButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 10
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ShareScreen;
```

---

**Версия:** 1.0.0  
**Последнее обновление:** 19 ноября 2025
