import { getApiKey } from '../settings';

export async function analyzeWithLLM({ prompt, imageBase64, model, provider }) {
  const apiKey = await getApiKey(provider);
  if (!apiKey) {
    throw new Error(`API ключ не настроен для ${provider}`);
  }

  switch (provider) {
    case 'groq':
      return callGroq(prompt, imageBase64, model, apiKey);
    case 'gemini':
      return callGemini(prompt, imageBase64, model, apiKey);
    case 'openrouter':
      return callOpenRouter(prompt, imageBase64, model, apiKey);
    case 'deepseek':
      return callDeepSeek(prompt, imageBase64, model, apiKey);
    case 'yandexgpt':
      return callYandexGPT(prompt, imageBase64, model, apiKey);
    case 'gigachat':
      return callGigaChat(prompt, imageBase64, model, apiKey);
    default:
      throw new Error(`Неизвестный провайдер: ${provider}`);
  }
}

async function callGroq(prompt, imageBase64, model, apiKey) {
  if (imageBase64) {
    throw new Error('Groq не поддерживает анализ изображений. Используй Gemini или DeepSeek.');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Groq error');
  return data.choices[0].message.content;
}

async function callGemini(prompt, imageBase64, model, apiKey) {
  const contents = [{ parts: [{ text: prompt }] }];

  if (imageBase64) {
    contents[0].parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    });
  }

  const modelName = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gemini error');
  return data.candidates[0].content.parts[0].text;
}

async function callOpenRouter(prompt, imageBase64, model, apiKey) {
  const messages = buildMessages(prompt, imageBase64);

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: model || 'deepseek/deepseek-chat', messages }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenRouter error');
  return data.choices[0].message.content;
}

async function callDeepSeek(prompt, imageBase64, model, apiKey) {
  const messages = buildMessages(prompt, imageBase64);

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: model || 'deepseek-chat', messages }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'DeepSeek error');
  return data.choices[0].message.content;
}

async function callYandexGPT(prompt, imageBase64, model, apiKey) {
  if (imageBase64) {
    throw new Error('YandexGPT не поддерживает анализ изображений');
  }
  const messages = [{ role: 'user', text: prompt }];

  const res = await fetch(
    `https://llm.api.cloud.yandex.net/foundationModels/v1/completion`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        modelUri: model || 'gpt://default/yandexgpt-lite',
        messages,
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'YandexGPT error');
  return data.result.message.text;
}

async function callGigaChat(prompt, imageBase64, model, apiKey) {
  const messages = buildMessages(prompt, imageBase64);

  const res = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: model || 'GigaChat', messages }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'GigaChat error');
  return data.choices[0].message.content;
}

function buildMessages(prompt, imageBase64) {
  if (imageBase64) {
    return [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ];
  }
  return [{ role: 'user', content: prompt }];
}
