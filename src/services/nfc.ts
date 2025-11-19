import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { UserProfile } from './storage';

const APP_IDENTIFIER = 'com.nfccontactshare.app';

// Инициализация NFC
export const initNFC = async (): Promise<boolean> => {
  try {
    const supported = await NfcManager.isSupported();
    if (supported) {
      await NfcManager.start();
      return true;
    }
    return false;
  } catch (error) {
    console.error('NFC init error:', error);
    return false;
  }
};

// Проверка доступности NFC
export const isNFCEnabled = async (): Promise<boolean> => {
  try {
    return await NfcManager.isEnabled();
  } catch (error) {
    console.error('NFC check error:', error);
    return false;
  }
};

// Запись данных профиля в NFC
export const writeNFC = async (profile: UserProfile): Promise<boolean> => {
  try {
    // Запрос технологии NFC для записи
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const data = {
      app: APP_IDENTIFIER,
      profile: profile,
    };

    const bytes = Ndef.encodeMessage([
      Ndef.textRecord(JSON.stringify(data)),
    ]);

    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      return true;
    }
    return false;
  } catch (error) {
    console.error('NFC write error:', error);
    return false;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};

// Чтение данных из NFC
export const readNFC = async (): Promise<UserProfile | null> => {
  try {
    // Запрос технологии NFC для чтения
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const tag = await NfcManager.getTag();
    
    if (tag && tag.ndefMessage) {
      const ndefRecords = tag.ndefMessage;
      
      for (const record of ndefRecords) {
        if (record.payload) {
          // Декодируем payload
          const text = Ndef.text.decodePayload(record.payload);
          
          try {
            const data = JSON.parse(text);
            
            // Проверяем, что это наше приложение
            if (data.app === APP_IDENTIFIER && data.profile) {
              return data.profile as UserProfile;
            }
          } catch (parseError) {
            console.error('Parse error:', parseError);
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('NFC read error:', error);
    return null;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};

// Начать прослушивание NFC тегов
export const startNFCListener = async (
  onContactReceived: (profile: UserProfile) => void
): Promise<void> => {
  try {
    await NfcManager.registerTagEvent();
    
    // Устанавливаем обработчик события
    NfcManager.setEventListener(NfcTech.Ndef, async () => {
      const profile = await readNFC();
      if (profile) {
        onContactReceived(profile);
      }
    });
  } catch (error) {
    console.error('NFC listener error:', error);
  }
};

// Остановить прослушивание NFC
export const stopNFCListener = async (): Promise<void> => {
  try {
    await NfcManager.unregisterTagEvent();
  } catch (error) {
    console.error('Stop NFC listener error:', error);
  }
};

// Очистить NFC
export const cleanupNFC = async (): Promise<void> => {
  try {
    await NfcManager.cancelTechnologyRequest();
  } catch (error) {
    console.error('NFC cleanup error:', error);
  }
};
