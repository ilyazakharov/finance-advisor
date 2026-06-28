import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { usePortfolio } from '../store/PortfolioContext';

export default function PortfolioScreen() {
  const { assets, totalValue, loading } = usePortfolio();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (assets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Портфель пуст</Text>
        <Text style={styles.subtitle}>Добавьте актив через скриншот или вручную</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.total}>Общая стоимость: {totalValue.toLocaleString()} ₽</Text>
      <FlatList
        data={assets}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.asset}>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetTicker}>{item.ticker}</Text>
            <Text style={styles.assetQty}>{item.quantity} шт.</Text>
            <Text style={styles.assetPrice}>
              {((item.current_price || item.avg_price) * item.quantity).toLocaleString()} ₽
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 40 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  total: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  asset: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  assetName: { flex: 2, fontSize: 14 },
  assetTicker: { flex: 1, fontSize: 12, color: '#666' },
  assetQty: { flex: 1, fontSize: 14, textAlign: 'right' },
  assetPrice: { flex: 1, fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
});
