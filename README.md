# Домашнее задание к блоку «Redux Saga» — Задача «Лента новостей»

Полностековое клиент-серверное приложение ленты новостей по образцу ВКонтакте с пошаговой дозагрузкой записей, автоповторами при сетевых ошибках и бесконечным скроллом, разработанное на React 19, TypeScript 5, Redux Toolkit, Redux-Saga и Express.

[![Build Status](https://github.com/ivantr033/ra16-homeworks-saga-newsfeed/actions/workflows/deploy.yml/badge.svg)](https://github.com/ivantr033/ra16-homeworks-saga-newsfeed/actions/workflows/deploy.yml)

## 🌐 Ссылка на развертывание (GitHub Pages)

* **News Feed App (Frontend):** [Открыть приложение](https://ivantr033.github.io/ra16-homeworks-saga-newsfeed/)

*(Примечание: для загрузки записей требуется запущенный локально backend-сервер на порту `7070`).*

## ⚙️ Реализованные требования и технические характеристики

1. **Пошаговая загрузка (`lastSeenId`) и `takeLeading`:** При открытии страницы запрашиваются первые 5 записей (`GET /api/news`). При нажатии на кнопку «К предыдущим записям» сага вычисляет `lastSeenId` из последней загруженной карточки и запрашивает следующую порцию с эффектом `takeLeading`, предотвращая дублирующие запросы.
2. **Тихие автоповторы каждые 3 секунды (`delay`):** При сбоях сервера (`500`) или сети сага не выводит пользователю сообщений об ошибке, а выполняет цикл повторных запросов с задержкой `delay(3000)` до получения успешного ответа.
3. **Завершение ленты (`hasMore`):** При получении менее 5 записей (включая пустой массив) кнопка дозагрузки и индикатор автоматически скрываются.
4. **Парсинг и форматирование данных:** Реализовано форматирование Unix-меток времени через `Intl.DateTimeFormat`, сокращение крупных счетчиков просмотров (`15K`), декодирование HTML-сущностей, преобразование ссылок в тексте и отображение вложений (`photo`, `link`, `video`), а также опциональный режим бесконечного скролла (`IntersectionObserver`).

## 🛠️ Технологический стек

* **Фронтенд:** React 19, TypeScript 5, Redux Toolkit, Redux-Saga (`call`, `put`, `select`, `delay`, `takeLeading`), IntersectionObserver
* **Бэкенд:** Node.js, Express, CORS, Body-Parser (порт `7070`)
* **Сборщик и CI/CD:** Vite, GitHub Actions (`gh-pages`)

## 🔧 Инструкция по локальному запуску

### 1. Запуск Backend (порт 7070)

```bash
cd backend
npm install
npm start
```

### 2. Запуск Frontend (порт 5173)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
