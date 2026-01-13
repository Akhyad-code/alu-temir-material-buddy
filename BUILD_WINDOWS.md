# Сборка ALU-TEMIR для Windows

## Требования
- Node.js 18+ (https://nodejs.org/)
- Git (https://git-scm.com/)

## Шаги сборки

### 1. Экспорт проекта в GitHub
В Lovable нажмите кнопку **"Export to GitHub"** в настройках проекта.

### 2. Клонируйте репозиторий
```bash
git clone https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
cd ВАШ_РЕПОЗИТОРИЙ
```

### 3. Установите зависимости
```bash
npm install
```

### 4. Соберите веб-приложение
```bash
npm run build
```

### 5. Соберите установщик Windows
```bash
npm run electron:build
```

### 6. Готово!
Установщик будет в папке `release/`:
- `ALU-TEMIR Калькулятор-Setup-1.0.0.exe`

## Разработка
Для запуска в режиме разработки:
```bash
npm run electron:dev
```

## Примечания
- Данные хранятся локально в браузерном хранилище Electron
- Установщик создаёт ярлыки на рабочем столе и в меню Пуск
- Поддерживается только Windows x64
