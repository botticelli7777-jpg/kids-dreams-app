# Моя мечта

PWA-приложение на React для детей до 18 лет: помогаем копить на одну финансовую цель (мечту) — загрузить фото, указать стоимость и плановые пополнения, видеть прогресс.

## Стек

- **Vite + React** (TypeScript)
- **React Router** — маршрутизация
- **vite-plugin-pwa** — PWA (manifest, service worker, offline)
- Данные в **LocalStorage** (без бэкенда)

## Структура проекта

```
src/
  components/     # GoalForm, GoalProgress, GoalsList, WallpaperPreview, ProModal, ParentTip
  hooks/          # useGoals (LocalStorage)
  pages/          # HomePage, GoalFormPage, GoalDetailPage, WallpaperPage
  utils/          # calculations (расчёт периодов и даты цели)
  types.ts        # Goal, PeriodType
  constants.ts    # IS_PRO, STORAGE_KEY
  App.tsx
  main.tsx
  index.css
public/
  favicon.svg
  (иконки PWA: используется favicon.svg)
```

## Запуск

```bash
# Установка зависимостей
npm install

# Режим разработки
npm run dev
```

Открой в браузере адрес из вывода (обычно `http://localhost:5173`).

## Сборка и предпросмотр PWA

```bash
npm run build
npm run preview
```

После `preview` можно проверить «Добавить на экран» в мобильном браузере (или в Chrome DevTools — Application → Manifest).

## PRO-режим

В `src/constants.ts` установи `IS_PRO = true`, чтобы разрешить несколько целей и кнопку «Сделать обложку для телефона». Оплата не подключается — только флаг в коде.

## Иконки PWA

По умолчанию в манифесте используется `favicon.svg`. Для лучшей поддержки на всех устройствах можно добавить PNG в `public/icons/`:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

и обновить `vite.config.ts` (массив `manifest.icons`).
