# Доска Позора

Доска позора с загрузкой фото и описания в реальном времени.

## Настройка Firebase (5 минут)

1. Перейди на [Firebase Console](https://console.firebase.google.com)
2. Нажми **"Create a project"** — придумай имя, нажми Continue → Create project
3. В левом меню выбери **Firestore Database** → Create database → Start in test mode → Next → Enable
4. В левом меню выбери **Storage** → Get started → Start in test mode → Next → Enable
5. В левом меню выбери **Authentication** → Get started → Вкладка "Sign-in method" → **Anonymous** → Enable → Save
6. Нажми шестерёнку (Project Settings) → вкладка "General" → внизу нажми значок Web (</>) → Register app → Скопируй конфиг
7. Открой `app.js` и замени содержимое `firebaseConfig` на свой конфиг

## Запуск

Просто открой `index.html` в браузере.

Или через GitHub Pages:
1. Залей на GitHub
2. Settings → Pages → Source: main branch
3. Сайт будет доступен по `https://твой-юзернейм.github.io/репозиторий/`
