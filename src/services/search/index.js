import { getApiKey } from '../settings';

export async function searchNews(query, provider) {
  switch (provider) {
    case 'duckduckgo':
      return searchDuckDuckGo(query);
    case 'tavily':
      return searchTavily(query);
    case 'moex':
      return searchMoexNews(query);
    case 'none':
      return [];
    default:
      return [];
  }
}

export async function searchQuotes(ticker, provider) {
  switch (provider) {
    case 'moex':
      return getMoexQuote(ticker);
    case 'manual':
      return null;
    default:
      return null;
  }
}

async function searchDuckDuckGo(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  const res = await fetch(url);
  const data = await res.json();

  const results = [];
  if (data.AbstractText) {
    results.push({ title: data.Heading, snippet: data.AbstractText, source: data.AbstractSource });
  }
  if (data.RelatedTopics) {
    for (const topic of data.RelatedTopics.slice(0, 5)) {
      results.push({ title: topic.Text?.split(' - ')[0] || '', snippet: topic.Text, source: 'DuckDuckGo' });
    }
  }
  return results;
}

async function searchTavily(query) {
  const apiKey = await getApiKey('tavily');
  if (!apiKey) throw new Error('API ключ Tavily не настроен');

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic', max_results: 5 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Tavily error');
  return (data.results || []).map((r) => ({ title: r.title, snippet: r.content, source: r.url }));
}

async function searchMoexNews(query) {
  const url = 'https://iss.moex.com/iss/sitenews.json?lang=ru&limit=20';
  const res = await fetch(url);
  const data = await res.json();

  if (!data.sitenews?.data) return [];

  const columns = data.sitenews.columns;
  const idx = (name) => columns.indexOf(name);
  const q = query.toLowerCase();

  return data.sitenews.data
    .filter((row) => {
      const title = (row[idx('title')] || '').toLowerCase();
      const body = (row[idx('body')] || '').toLowerCase();
      return title.includes(q) || body.includes(q);
    })
    .map((row) => ({
      title: row[idx('title')],
      snippet: row[idx('body')],
      source: row[idx('link')] || 'MOEX',
      date: row[idx('published_at')],
    }));
}

async function getMoexQuote(ticker) {
  const url = `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.marketdata?.data) return null;

  const columns = data.marketdata.columns;
  const row = data.marketdata.data[0];
  if (!row) return null;

  const idx = (name) => columns.indexOf(name);
  return {
    ticker,
    price: row[idx('LAST')] || row[idx('PREVPRICE')],
    change: row[idx('CHANGE')],
    volume: row[idx('VOLUME')],
    updated: new Date().toISOString(),
  };
}
