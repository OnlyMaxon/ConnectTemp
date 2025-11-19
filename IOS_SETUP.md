# Настройка NFC для iOS

## Info.plist

Приложение уже настроено через `app.json`, но если вы используете bare React Native, добавьте в `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>Это приложение использует NFC для обмена контактной информацией между устройствами</string>

<key>com.apple.developer.nfc.readersession.formats</key>
<array>
    <string>NDEF</string>
</array>
```

## Возможности (Capabilities)

В Xcode:
1. Откройте проект в Xcode
2. Выберите target приложения
3. Перейдите на вкладку "Signing & Capabilities"
4. Нажмите "+ Capability"
5. Добавьте "Near Field Communication Tag Reading"

## Entitlements

Создайте или обновите файл `<YourApp>.entitlements`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.nfc.readersession.formats</key>
    <array>
        <string>NDEF</string>
    </array>
</dict>
</plist>
```

## Требования

- iOS 13.0 или выше
- iPhone 7 или новее (iPhone 6 и ниже не поддерживают запись NFC)
- Физическое устройство (NFC не работает на симуляторе)

## Тестирование NFC на iOS

1. **NFC автоматически включен** на поддерживаемых устройствах
2. **Запустите приложение** на обоих iPhone
3. **Создайте профиль** на каждом устройстве
4. **Нажмите кнопку "Обменяться контактами"**
5. **Приложите iPhone** верхними частями друг к другу (антенна NFC находится в верхней части iPhone)
6. Появится уведомление и откроется экран с полученным контактом

## Примечания

- На iOS NFC работает только при активной сессии (после нажатия кнопки)
- Антенна NFC расположена в верхней части iPhone (рядом с камерой)
- Расстояние между устройствами должно быть менее 3-4 см
- Для записи NFC требуется iPhone 7 или новее
- Для чтения NFC с фонового режима требуются дополнительные настройки

## Apple Developer Account

Для тестирования на реальном устройстве необходим:
- Apple Developer Account (бесплатный или платный)
- Настроенный Signing в Xcode

## Ограничения

iOS имеет более строгие ограничения NFC по сравнению с Android:
- Сессия NFC активна только когда приложение на переднем плане
- Требуется явное разрешение пользователя
- Время сессии ограничено (60 секунд)
