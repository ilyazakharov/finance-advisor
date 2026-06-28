# FinanceAdvisor

Мобильное приложение для управления и AI-анализа инвестиционного портфеля.
React Native (Expo SDK 54), iOS + Android.

## Возможности

- **Портфель** — добавление активов, список с общей стоимостью
- **AI-анализ** — анализ портфеля через LLM с учётом профиля инвестора
- **Поиск новостей** — DuckDuckGo, MOEX или Tavily
- **Котировки** — MOEX (бесплатно, российские бумаги)
- **6 LLM-провайдеров** — Groq (бесплатно), Gemini, DeepSeek, OpenRouter, YandexGPT, GigaChat
- **Профиль инвестора** — цель, горизонт, риск, взнос, капитал
- **Настройки** — всё конфигурируется в UI, API ключи в SecureStore

## Начало работы

```bash
npm install
npm start          # Expo dev server
npm run web        # Веб-версия
npm run android    # Android (Expo Go)
npm run ios        # iOS (требуется macOS)
```

Требуется Expo Go v54 на телефоне.

## Настройка LLM

Выберите провайдера в Настройках → LLM. Рекомендуемые:

- **Groq** — бесплатно, без карты, работает из РФ
- **Gemini** — бесплатно, есть Vision (анализ скриншотов)

## Поиск данных

| Источник | Цена | Данные |
|---|---|---|
| MOEX | бесплатно | Котировки РФ акций + новости эмитентов |
| DuckDuckGo | бесплатно | Поиск новостей |
| Tavily | 1000 запросов/мес | AI-оптимизированный поиск |

## Технологии

- Expo SDK 54, React Native 0.81
- SQLite (expo-sqlite) + AsyncStorage fallback
- @react-navigation/bottom-tabs
- Expo SecureStore (API ключи)
- @expo/vector-icons (Ionicons)
