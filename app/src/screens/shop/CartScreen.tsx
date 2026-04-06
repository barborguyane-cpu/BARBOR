import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useShopStore } from '../../store/shopStore';
import { CartItem } from '../../services/types';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

export const CartScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShopStore();

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>{item.product.price}€ / unité</Text>
      </View>
      <View style={styles.itemControls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader title="Panier" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>Découvrez nos produits premium</Text>
          <GoldButton
            title="Voir la boutique"
            onPress={() => navigation.navigate('ShopMain')}
            size="md"
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Panier"
        subtitle={`${cart.length} article${cart.length > 1 ? 's' : ''}`}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{cartTotal().toFixed(2)}€</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>Gratuite</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{cartTotal().toFixed(2)}€</Text>
            </View>
          </View>
        }
      />
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <GoldButton
          title={`Commander — ${cartTotal().toFixed(2)}€`}
          onPress={() => navigation.navigate('Checkout')}
          size="lg"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: 120 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImage: { width: 70, height: 70, borderRadius: borderRadius.md, backgroundColor: colors.card },
  itemInfo: { flex: 1 },
  itemBrand: { fontSize: 10, color: colors.gold, fontWeight: '700', letterSpacing: 1 },
  itemName: { fontSize: 13, color: colors.textPrimary, fontWeight: '600', marginTop: 2 },
  itemPrice: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  itemControls: { alignItems: 'center', gap: spacing.xs },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qty: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
  deleteBtn: { marginTop: spacing.xs },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyTitle: { ...typography.h2, color: colors.textPrimary },
  emptySubtitle: { color: colors.textMuted, fontSize: 14 },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: 14 },
  summaryValue: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  totalRow: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
    marginTop: spacing.xs,
  },
  totalLabel: { ...typography.h3, color: colors.textPrimary },
  totalValue: { fontSize: 24, fontWeight: '900', color: colors.gold },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.borderGold },
});
