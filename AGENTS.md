# FinanceAdvisor

Expo SDK 54. Читать документацию: https://docs.expo.dev/versions/v54.0.0/

## SOLID

- Каждый сервис в `src/services/` имеет одну ответственность
- Сервисы используют абстрактные интерфейсы (interfaces.js)
- Новый LLM-провайдер = новый файл в `src/services/llm/` + регистрация в `index.js`
- Новый Search-провайдер = новый файл в `src/services/search/` + регистрация в `index.js`

## Команды

- `npm start` — запуск Expo
- `npm run android` — Android
- `npm run ios` — iOS (требуется macOS)
- `npm run web` — веб-версия
