import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { usePortfolio } from '../store/PortfolioContext';

const ASSET_TYPES = ['stock', 'bond', 'etf', 'fund', 'crypto', 'cash', 'other'];
const TYPE_LABELS = { stock: 'Акции', bond: 'Облигации', etf: 'ETF', fund: 'ПИФ', crypto: 'Крипта', cash: 'Кэш', other: 'Другое' };

export default function AddAssetScreen() {
  const { addNewAsset } = usePortfolio();
  const [type, setType] = useState('stock');
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [notes, setNotes] = useState('');

  const pickScreenshot = () => {
    Alert.alert('Скриншот', 'Функция будет доступна после настройки API ключа');
  };

  const handleManualAdd = async () => {
    if (!name || !quantity || !avgPrice) {
      Alert.alert('Ошибка', 'Заполните название, количество и цену');
      return;
    }
    try {
      await addNewAsset({
        type,
        ticker: ticker || '',
        name,
        quantity: parseFloat(quantity),
        avg_price: parseFloat(avgPrice),
        currency: 'RUB',
        notes,
      });
      setTicker('');
      setName('');
      setQuantity('');
      setAvgPrice('');
      setNotes('');
      Alert.alert('Готово', 'Актив добавлен');
    } catch (e) {
      Alert.alert('Ошибка', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.screenshotBtn} onPress={pickScreenshot}>
        <Text style={styles.screenshotBtnText}>Загрузить скриншот</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Или добавить вручную</Text>
      <Text style={styles.label}>Тип актива</Text>
      <View style={styles.typeRow}>
        {ASSET_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeChip, type === t && styles.typeChipActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>
              {TYPE_LABELS[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={styles.input} placeholder="Тикер" value={ticker} onChangeText={setTicker} />
      <TextInput style={styles.input} placeholder="Название" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Количество" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Средняя цена" value={avgPrice} onChangeText={setAvgPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Заметки" value={notes} onChangeText={setNotes} />

      <TouchableOpacity style={styles.addBtn} onPress={handleManualAdd}>
        <Text style={styles.addBtnText}>Добавить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, flexGrow: 1 },
  screenshotBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  screenshotBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#333' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, marginHorizontal: -4 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', margin: 4 },
  typeChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  typeChipText: { fontSize: 13, color: '#333' },
  typeChipTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12 },
  addBtn: { backgroundColor: '#34C759', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
