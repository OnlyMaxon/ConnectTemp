import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@user_profile';
const CONTACTS_KEY = '@saved_contacts';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  customLinks: Array<{ label: string; url: string }>;
}

export interface SavedContact extends UserProfile {
  id: string;
  savedAt: number;
}

// Сохранить профиль пользователя
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Получить профиль пользователя
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
};

// Сохранить новый контакт
export const saveContact = async (contact: UserProfile): Promise<void> => {
  try {
    const existingContacts = await getSavedContacts();
    const newContact: SavedContact = {
      ...contact,
      id: Date.now().toString(),
      savedAt: Date.now(),
    };
    const updatedContacts = [...existingContacts, newContact];
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

// Получить все сохраненные контакты
export const getSavedContacts = async (): Promise<SavedContact[]> => {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};

// Удалить контакт
export const deleteContact = async (contactId: string): Promise<void> => {
  try {
    const contacts = await getSavedContacts();
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
