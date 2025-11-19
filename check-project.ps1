# Проверка проекта NFC Contact Share

Write-Host "🔍 Проверка структуры проекта NFC Contact Share..." -ForegroundColor Cyan
Write-Host ""

# Счетчики
$totalFiles = 0
$missingFiles = 0

# Функция проверки файла
function Test-ProjectFile {
    param([string]$path, [string]$description)
    
    $global:totalFiles++
    
    if (Test-Path $path) {
        Write-Host "✅ $description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $description - ОТСУТСТВУЕТ" -ForegroundColor Red
        $global:missingFiles++
        return $false
    }
}

Write-Host "📱 ИСХОДНЫЙ КОД" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray
Test-ProjectFile "App.tsx" "App.tsx (главный компонент)"
Test-ProjectFile "src\screens\HomeScreen.tsx" "HomeScreen.tsx"
Test-ProjectFile "src\screens\ProfileScreen.tsx" "ProfileScreen.tsx"
Test-ProjectFile "src\screens\ReceivedContactScreen.tsx" "ReceivedContactScreen.tsx"
Test-ProjectFile "src\screens\ContactsListScreen.tsx" "ContactsListScreen.tsx"
Test-ProjectFile "src\services\storage.ts" "storage.ts (AsyncStorage)"
Test-ProjectFile "src\services\nfc.ts" "nfc.ts (NFC функционал)"
Write-Host ""

Write-Host "⚙️ КОНФИГУРАЦИЯ" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray
Test-ProjectFile "package.json" "package.json"
Test-ProjectFile "app.json" "app.json"
Test-ProjectFile "tsconfig.json" "tsconfig.json"
Test-ProjectFile "babel.config.js" "babel.config.js"
Test-ProjectFile ".gitignore" ".gitignore"
Write-Host ""

Write-Host "📚 ДОКУМЕНТАЦИЯ" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray
Test-ProjectFile "README.md" "README.md (главная документация)"
Test-ProjectFile "QUICKSTART.md" "QUICKSTART.md (быстрый старт)"
Test-ProjectFile "FAQ.md" "FAQ.md (вопросы-ответы)"
Test-ProjectFile "TROUBLESHOOTING.md" "TROUBLESHOOTING.md (решение проблем)"
Test-ProjectFile "CODE_EXAMPLES.md" "CODE_EXAMPLES.md (примеры кода)"
Test-ProjectFile "PROJECT_STRUCTURE.md" "PROJECT_STRUCTURE.md (архитектура)"
Test-ProjectFile "PROJECT_OVERVIEW.md" "PROJECT_OVERVIEW.md (обзор)"
Test-ProjectFile "CONTRIBUTING.md" "CONTRIBUTING.md (для контрибьюторов)"
Test-ProjectFile "ANDROID_SETUP.md" "ANDROID_SETUP.md (настройка Android)"
Test-ProjectFile "IOS_SETUP.md" "IOS_SETUP.md (настройка iOS)"
Test-ProjectFile "BUILD_GUIDE.md" "BUILD_GUIDE.md (сборка)"
Test-ProjectFile "CHANGELOG.md" "CHANGELOG.md (история версий)"
Test-ProjectFile "PROJECT_COMPLETE.md" "PROJECT_COMPLETE.md (итоги)"
Test-ProjectFile "LICENSE" "LICENSE (MIT лицензия)"
Write-Host ""

# Итоги
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Всего файлов проверено: $totalFiles" -ForegroundColor White

if ($missingFiles -eq 0) {
    Write-Host "Отсутствующих файлов: $missingFiles" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 ВСЕ ФАЙЛЫ НА МЕСТЕ!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✨ Проект готов к использованию!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Yellow
    Write-Host "  1. npm install          - установить зависимости" -ForegroundColor White
    Write-Host "  2. npm start            - запустить dev server" -ForegroundColor White
    Write-Host "  3. Прочитайте README.md - полная документация" -ForegroundColor White
} else {
    Write-Host "Отсутствующих файлов: $missingFiles" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  НЕКОТОРЫЕ ФАЙЛЫ ОТСУТСТВУЮТ!" -ForegroundColor Red
    Write-Host "Проверьте структуру проекта" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Дополнительная информация
Write-Host "📖 ПОЛЕЗНЫЕ ССЫЛКИ:" -ForegroundColor Yellow
Write-Host "  • Быстрый старт:    QUICKSTART.md" -ForegroundColor Cyan
Write-Host "  • Документация:     README.md" -ForegroundColor Cyan
Write-Host "  • Примеры кода:     CODE_EXAMPLES.md" -ForegroundColor Cyan
Write-Host "  • Решение проблем:  TROUBLESHOOTING.md" -ForegroundColor Cyan
Write-Host ""
