import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { PRODUCTS } from '../../services/mockData';
import { Product } from '../../services/types';
import { ScreenHeader } from '../../components/common/ScreenHeader';

export const AdminProductsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState(PRODUCTS);

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productCat}>{item.category}</Text>
        <Text style={styles.productPrice}>{item.price}€</Text>
      </View>
      <View style={styles.stockControls}>
        <TouchableOpacity style={styles.stockBtn} onPress={() => adjustStock(item.id, 1)}>
          <Ionicons name="add" size={16} color={colors.success} />
        </TouchableOpacity>
        <View style={[styles.stockBadge, {
          backgroundColor: item.stock === 0 ? 'rgba(239,68,68,0.15)' :
            item.stock <= 5 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'
        }]}>
          <Text style={[styles.stockNum, {
            color: item.stock === 0 ? colors.error : item.stock <= 5 ? colors.warning : colors.success
          }]}>{item.stock}</Text>
          <Text style={styles.stockLabel}>stock</Text>
        </View>
        <TouchableOpacity style={styles.stockBtn} onPress={() => adjustStock(item.id, -1)}>
          <Ionicons name="remove" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Produits & Stock" onBack={() => navigation.goBack()} />
      <View style={styles.summaryRow}>
        {[
          { label: 'Total stock', value: totalStock, color: colors.gold },
          { label: 'Stock faible', value: lowStock, color: colors.warning },
          { label: 'Rupture', value: outOfStock, color: colors.error },
        ].map((s) => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryCard: { flex: 1, alignItems: 'center', padding: spacing.sm },
  summaryValue: { fontSize: 24, fontWeight: '900' },
  summaryLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  list: { padding: spacing.lg, paddingBottom: 40 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: { width: 60, height: 60, borderRadius: borderRadius.md, backgroundColor: colors.card },
  productInfo: { flex: 1 },
  productBrand: { fontSize: 9, color: colors.gold, fontWeight: '700', letterSpacing: 1 },
  productName: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  productCat: { fontSize: 11, color: colors.textMuted, textTransform: 'capitalize' },
  productPrice: { fontSize: 15, fontWeight: '800', color: colors.gold, marginTop: 2 },
  stockControls: { alignItems: 'center', gap: spacing.xs },
  stockBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stockBadge: { borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4, alignItems: 'center' },
  stockNum: { fontSize: 18, fontWeight: '900' },
  stockLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '600' },
});
