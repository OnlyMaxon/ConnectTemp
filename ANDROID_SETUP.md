# Настройка NFC для Android

## AndroidManifest.xml

Добавьте следующие разрешения и фильтры в файл `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- NFC Разрешения -->
    <uses-permission android:name="android.permission.NFC" />
    <uses-feature 
        android:name="android.hardware.nfc" 
        android:required="false" />

    <application>
        <activity
            android:name=".MainActivity"
            android:launchMode="singleTask">
            
            <!-- NFC Intent Filters -->
            <intent-filter>
                <action android:name="android.nfc.action.NDEF_DISCOVERED"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:mimeType="text/plain" />
            </intent-filter>
            
            <intent-filter>
                <action android:name="android.nfc.action.TAG_DISCOVERED"/>
                <category android:name="android.intent.category.DEFAULT"/>
            </intent-filter>
            
        </activity>
    </application>
</manifest>
```

## build.gradle

В файле `android/app/build.gradle` убедитесь, что minSdkVersion >= 21:

```gradle
android {
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
    }
}
```

## Тестирование NFC

1. **Включите NFC** на обоих устройствах (Настройки → Подключения → NFC)
2. **Запустите приложение** на обоих телефонах
3. **Создайте профиль** на каждом устройстве
4. **Нажмите кнопку "Обменяться контактами"**
5. **Приложите телефоны** задними сторонами друг к другу
6. Дождитесь вибрации/звука и автоматического открытия экрана с полученным контактом

## Требования

- Android 4.4 (API 19) или выше
- Устройство с NFC модулем
- NFC должен быть включен в настройках

## Примечания

- NFC не работает на эмуляторах, только на реальных устройствах
- Расстояние между устройствами должно быть менее 4 см
- Убедитесь, что телефоны не в чехлах, которые блокируют NFC
