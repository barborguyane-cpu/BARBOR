import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { PRODUCTS } from '../../services/mockData';
import { useShopStore } from '../../store/shopStore';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addToCart } = useShopStore();

  const product = PRODUCTS.find((p) => p.id === route.params?.productId);
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title={product.category.toUpperCase()}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="bag-outline" size={22} color={colors.gold} />
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map((s) => (
              <Ionicons key={s} name={s <= Math.floor(product.rating) ? 'star' : 'star-outline'} size={16} color={colors.gold} />
            ))}
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} avis)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}€</Text>
            <View style={[styles.stockBadge, { backgroundColor: product.stock > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }]}>
              <Text style={[styles.stockText, { color: product.stock > 0 ? colors.success : colors.error }]}>
                {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          {/* Features */}
          <Text style={styles.descTitle}>Informations</Text>
          {[
            { label: 'Catégorie', value: product.category },
            { label: 'Marque', value: product.brand },
            { label: 'Stock', value: `${product.stock} unités` },
          ].map((f) => (
            <View key={f.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{f.label}</Text>
              <Text style={styles.infoValue}>{f.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.footerLabel}>Prix</Text>
          <Text style={styles.footerPrice}>{product.price}€</Text>
        </View>
        <GoldButton
          title="Ajouter au panier"
          onPress={handleAddToCart}
          disabled={product.stock === 0}
          size="lg"
          style={{ flex: 1, marginLeft: spacing.lg }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width, height: width * 0.85, backgroundColor: colors.card },
  content: { padding: spacing.lg, gap: spacing.md },
  brand: { fontSize: 11, color: colors.gold, fontWeight: '700', letterSpacing: 2 },
  name: { ...typography.h1, color: colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.gold, fontWeight: '700', marginLeft: 4 },
  reviewCount: { color: colors.textMuted, fontSize: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 32, fontWeight: '900', color: colors.gold },
  stockBadge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  stockText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  descTitle: { ...typography.labelMedium, color: colors.gold, marginBottom: spacing.xs },
  description: { color: colors.textSecondary, fontSize: 14, lineHeight: 22 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { color: colors.textMuted, fontSize: 13 },
  infoValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
  },
  footerLabel: { color: colors.textMuted, fontSize: 11 },
  footerPrice: { fontSize: 24, fontWeight: '900', color: colors.gold },
});
