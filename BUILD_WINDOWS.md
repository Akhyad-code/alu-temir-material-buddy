# Сборка ALU-TEMIR для Windows

## Требования
- Node.js 18+ (https://nodejs.org/)
- Git (https://git-scm.com/)

## Быстрая сборка (5 минут)

### 1. Экспорт проекта в GitHub
В Lovable нажмите **Settings** → **GitHub** → **Export to GitHub**

### 2. Клонируйте и соберите
```bash
# Клонировать репозиторий
git clone https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
cd ВАШ_РЕПОЗИТОРИЙ

# Установить зависимости
npm install

# Собрать веб-приложение
npm run build

# Собрать Windows установщик
npm run electron:build
```

### 3. Готово!
Установщик находится в папке `release/`:
```
ALU-TEMIR Калькулятор-Setup-1.0.0.exe
```

## Режим разработки
```bash
# Запустить веб-версию
npm run dev

# В другом терминале - запустить Electron
npm run electron:dev
```

## Структура проекта
```
├── dist/                 # Собранное веб-приложение
├── electron/
│   └── main.js          # Главный файл Electron
├── release/             # Установщики Windows
├── src/                 # Исходный код React
├── electron-builder.json # Настройки сборки
└── vite.config.ts       # Настройки Vite
```

## Команды package.json
Убедитесь что в package.json есть эти скрипты:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "electron electron/main.js",
    "electron:build": "electron-builder --config electron-builder.json"
  },
  "main": "electron/main.js"
}
```

## Особенности
- ✅ Данные хранятся локально (localStorage)
- ✅ Работает офлайн
- ✅ Создаёт ярлыки на рабочем столе и в меню Пуск
- ✅ Поддержка Windows x64

## Решение проблем

### Ошибка "electron is not recognized"
```bash
npm install electron electron-builder --save-dev
```

### Ошибка при сборке
```bash
# Удалить node_modules и переустановить
rm -rf node_modules
npm install
```

### Белый экран после запуска
Проверьте что `npm run build` выполнен успешно и папка `dist/` содержит файлы.
