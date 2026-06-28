import { analyzeWithLLM } from './llm';

const EXTRACT_PROMPT = `Извлеки данные об активах из скриншота портфеля.
Верни ТОЛЬКО JSON-массив без пояснений:
[
  {
    "type": "stock|bond|etf|fund|crypto|cash|other",
    "ticker": "тикер если виден",
    "name": "название актива",
    "quantity": число,
    "avg_price": число,
    "current_price": число,
    "currency": "RUB"
  }
]
Если тикер не виден — поставь пустую строку.
Если цена не видна — поставь null.`;

export async function extractAssetsFromScreenshot(imageBase64, provider, model) {
  const raw = await analyzeWithLLM({
    prompt: EXTRACT_PROMPT,
    imageBase64,
    provider,
    model,
  });

  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Не удалось извлечь данные из скриншота');
  }

  return JSON.parse(jsonMatch[0]);
}
