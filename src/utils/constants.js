export const DEFAULT_SETTINGS = {
  llm: {
    provider: 'groq',
    apiKeys: {
      openrouter: '',
      deepseek: '',
      yandexgpt: '',
      gigachat: '',
      groq: '',
      gemini: '',
    },
    modelBasic: 'llama3-8b-8192',
    modelAdvanced: 'llama3-70b-8192',
  },
  search: {
    newsProvider: 'duckduckgo',
    quotesProvider: 'moex',
    tavilyApiKey: '',
  },
  investor: {
    goal: '',
    horizon: '3-7',
    riskLevel: 'moderate',
    monthlyContribution: '',
    currentCapital: '',
  },
  general: {
    currency: 'RUB',
  },
};

export const RISK_LEVELS = [
  { id: 'conservative', label: 'Консервативный' },
  { id: 'moderate', label: 'Умеренный' },
  { id: 'aggressive', label: 'Агрессивный' },
];

export const HORIZONS = [
  { id: '1', label: '< 1 года' },
  { id: '1-3', label: '1–3 года' },
  { id: '3-7', label: '3–7 лет' },
  { id: '7', label: '7+ лет' },
];

export const CURRENCIES = [
  { id: 'RUB', label: '₽ RUB' },
  { id: 'USD', label: '$ USD' },
];

export const LLM_PROVIDERS = [
  { id: 'groq', label: 'Groq (бесплатно)' },
  { id: 'gemini', label: 'Google Gemini (бесплатно)' },
  { id: 'deepseek', label: 'DeepSeek (дёшево)' },
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'yandexgpt', label: 'YandexGPT' },
  { id: 'gigachat', label: 'GigaChat' },
];

export const LLM_PROVIDER_INFO = {
  groq: {
    name: 'Groq',
    pros: [
      'Полностью бесплатно, не нужна банковская карта',
      'Очень быстрый (до 1000 токенов/сек)',
      'Работает из России без VPN',
      'Модели: LLaMA 3, Mixtral, Gemma 2',
    ],
    cons: [
      'Нет Vision (не может анализировать скриншоты)',
      'Лимит 30 запросов в минуту (хватает для анализа портфеля)',
      'Только текстовые модели',
    ],
    steps: [
      'Зайди на https://console.groq.com',
      'Нажми "Register" — нужна только почта и пароль',
      'Подтверди почту',
      'Нажми "Create API Key"',
      'Скопируй ключ и вставь в поле ниже',
    ],
    url: 'https://console.groq.com',
  },
  gemini: {
    name: 'Google Gemini',
    pros: [
      'Бесплатно (если есть Google аккаунт)',
      'Есть Vision — анализирует скриншоты',
      '60 запросов в минуту',
      'Понимает русский язык',
    ],
    cons: [
      'Нужен Google аккаунт',
      'Может потребоваться VPN из России',
      'Бесплатный лимит — 60 запросов/мин',
    ],
    steps: [
      'Зайди на https://aistudio.google.com',
      'Войди в Google аккаунт',
      'Нажми "Get API Key" в левом меню',
      'Нажми "Create API Key"',
      'Выбери или создай проект в Google Cloud',
      'Скопируй ключ и вставь в поле ниже',
    ],
    url: 'https://aistudio.google.com',
  },
  deepseek: {
    name: 'DeepSeek',
    pros: [
      'Очень дёшево (~1₽ на 1000 запросов)',
      'Есть Vision (анализ скриншотов в DeepSeek-VL)',
      'Работает из России',
      'Качественные ответы',
    ],
    cons: [
      'Нет бесплатного тарифа',
      'Нужно пополнить баланс (минимум $2)',
      'Китайский API — возможна задержка',
    ],
    steps: [
      'Зайди на https://platform.deepseek.com',
      'Зарегистрируйся (почта + пароль)',
      'Войди в раздел "API Keys"',
      'Нажми "Create API Key"',
      'Пополни баланс (Settings → Top Up)',
      'Скопируй ключ и вставь в поле ниже',
    ],
    url: 'https://platform.deepseek.com',
  },
  openrouter: {
    name: 'OpenRouter',
    pros: [
      'Единый API для любых моделей (DeepSeek, GPT, Claude, Qwen)',
      'Можно менять модель без смены ключа',
      'Есть Vision модели',
    ],
    cons: [
      'Требует регистрацию',
      'Бесплатный лимит — $1 при первом пополнении',
      'Работает из РФ, но может быть нестабильно',
    ],
    steps: [
      'Зайди на https://openrouter.ai/keys',
      'Зарегистрируйся (почта + пароль)',
      'Подтверди почту',
      'Нажми "Create Key"',
      'Скопируй ключ и вставь в поле ниже',
    ],
    url: 'https://openrouter.ai/keys',
  },
  yandexgpt: {
    name: 'YandexGPT',
    pros: [
      'Российский провайдер',
      'Понимает российский контекст',
      'Работает без VPN',
      'Есть пробный период (1000+ запросов)',
    ],
    cons: [
      'Требуется банковская карта для активации',
      'Сложная настройка (Yandex Cloud)',
      'Дороже аналогов',
      'Нет Vision API',
    ],
    steps: [
      'Зайди на https://console.cloud.yandex.ru',
      'Зарегистрируйся и создай платёжный аккаунт',
      'Создай каталог',
      'Включи YandexGPT API',
      'Создай сервисный аккаунт',
      'Создай API-ключ для сервисного аккаунта',
      'Скопируй ключ и вставь в поле ниже',
    ],
    url: 'https://console.cloud.yandex.ru',
  },
  gigachat: {
    name: 'GigaChat',
    pros: [
      'Российский провайдер (Сбер)',
      'Понимает российский контекст',
      'Есть бесплатный доступ',
    ],
    cons: [
      'Требуется SberID',
      'Сложная авторизация (нужен отдельный токен доступа)',
      'Меньше моделей, чем у конкурентов',
    ],
    steps: [
      'Зайди на https://developers.sber.ru/gigachat',
      'Зарегистрируйся через SberID',
      'Создай приложение',
      'Получи Client ID и Client Secret',
      'Используй Client Secret как API ключ',
      'Вставь ключ в поле ниже',
    ],
    url: 'https://developers.sber.ru/gigachat',
  },
};

export const MODELS_BY_PROVIDER = {
  groq: {
    basic: [
      { id: 'llama3-8b-8192', label: 'LLaMA 3 8B (быстрая, базовая)' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
    ],
    advanced: [
      { id: 'llama3-70b-8192', label: 'LLaMA 3 70B (мощная, для рекомендаций)' },
      { id: 'llama3-8b-8192', label: 'LLaMA 3 8B' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    ],
  },
  gemini: {
    basic: [
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (быстрая, базовая)' },
      { id: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' },
    ],
    advanced: [
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (макс. качество)' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    ],
  },
  deepseek: {
    basic: [
      { id: 'deepseek-chat', label: 'DeepSeek Chat (базовая)' },
    ],
    advanced: [
      { id: 'deepseek-chat', label: 'DeepSeek Chat' },
    ],
  },
  openrouter: {
    basic: [
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (дёшево)' },
      { id: 'meta-llama/llama-3.1-8b-instruct', label: 'LLaMA 3.1 8B' },
    ],
    advanced: [
      { id: 'openai/gpt-4o', label: 'GPT-4o (мощная)' },
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    ],
  },
  yandexgpt: {
    basic: [
      { id: 'gpt://default/yandexgpt-lite', label: 'YandexGPT Lite (базовая)' },
    ],
    advanced: [
      { id: 'gpt://default/yandexgpt', label: 'YandexGPT Полная' },
    ],
  },
  gigachat: {
    basic: [
      { id: 'GigaChat', label: 'GigaChat (базовая)' },
    ],
    advanced: [
      { id: 'GigaChat-Max', label: 'GigaChat Max' },
      { id: 'GigaChat', label: 'GigaChat' },
    ],
  },
};

export const NEWS_PROVIDERS = [
  { id: 'duckduckgo', label: 'DuckDuckGo (бесплатно)' },
  { id: 'moex', label: 'MOEX (бесплатно, новости эмитентов)' },
  { id: 'tavily', label: 'Tavily AI Search' },
  { id: 'none', label: 'Отключён' },
];

export const QUOTES_PROVIDERS = [
  { id: 'moex', label: 'MOEX (РФ бумаги)' },
];

export const SEARCH_PROVIDER_INFO = {
  duckduckgo: {
    name: 'DuckDuckGo',
    pros: [
      'Полностью бесплатно, без API ключа',
      'Неограниченное количество запросов',
      'Работает из России',
      'Не требует регистрации',
    ],
    cons: [
      'Менее точные результаты, чем у Google',
      'Только текстовый поиск новостей',
    ],
    steps: [
      'Ничего настраивать не нужно — работает сразу после выбора',
    ],
    url: 'https://duckduckgo.com',
  },
  tavily: {
    name: 'Tavily AI Search',
    pros: [
      'Оптимизирован для AI (готовые сниппеты)',
      'Поддерживает русский язык',
      'Быстрый',
    ],
    cons: [
      'Требуется API ключ',
      'Бесплатно 1000 запросов/мес',
    ],
    steps: [
      'Зайди на https://tavily.com',
      'Зарегистрируйся',
      'Получи API ключ в дашборде',
      'Вставь ключ в поле "API ключ Tavily"',
    ],
    url: 'https://tavily.com',
  },
  moex: {
    name: 'Московская Биржа (MOEX)',
    pros: [
      'Официальный API Московской Биржи',
      'Бесплатно, без ключа',
      'Точные котировки российских акций и облигаций',
      'Новости российских эмитентов (официальные)',
    ],
    cons: [
      'Только российские бумаги',
      'Ограничения по частоте запросов',
      'Новостей меньше, чем в агрегаторах',
    ],
    steps: [
      'Ничего настраивать не нужно — работает сразу после выбора',
    ],
    url: 'https://iss.moex.com',
  },
  none: {
    name: 'Поиск отключён',
    pros: [
      'Экономит интернет-трафик',
      'Не расходует лимиты API',
    ],
    cons: [
      'AI не будет получать свежие новости',
      'Анализ только по сохранённым данным',
    ],
    steps: [
      'Поиск новостей будет пропущен при анализе портфеля',
    ],
    url: null,
  },
};
