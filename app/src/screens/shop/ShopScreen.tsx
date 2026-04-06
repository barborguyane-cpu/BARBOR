import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { PRODUCTS } from '../../services/mockData';
import { Product, ProductCategory } from '../../services/types';
import { useShopStore } from '../../store/shopStore';
import { ScreenHeader } from '../../components/common/ScreenHeader';

const { width } = Dimensions.get('window');
const CARD_W = (width - spacing.lg * 2 - spacing.sm) / 2;

const CATEGORIES: Array<{ key: ProductCategory | 'all'; label: string; icon: string }> = [
  { key: 'all', label: 'Tout', icon: 'grid-outline' },
  { key: 'soins', label: 'Soins', icon: 'leaf-outline' },
  { key: 'styling', label: 'Styling', icon: 'sparkles-outline' },
  { key: 'accessoires', label: 'Accessoires', icon: 'bag-outline' },
];

export const ShopScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { addToCart, cartCount } = useShopStore();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.productImageWrap}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        {item.stock <= 5 && item.stock > 0 && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>+{item.stock} restants</Text>
          </View>
        )}
        {item.stock === 0 && (
          <View style={[styles.stockBadge, styles.outOfStock]}>
            <Text style={styles.stockText}>Rupture</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.gold} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        <View style={styles.productBottom}>
          <Text style={styles.productPrice}>{item.price}€</Text>
          <TouchableOpacity
            style={[styles.addBtn, item.stock === 0 && styles.addBtnDisabled]}
            onPress={() => item.stock > 0 && addToCart(item)}
            disabled={item.stock === 0}
          >
            <Ionicons name="add" size={18} color={item.stock === 0 ? colors.textMuted : colors.black} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Boutique"
        subtitle="Produits premium"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
            <Ionicons name="bag-outline" size={22} color={colors.gold} />
            {cartCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          selectionColor={colors.gold}
        />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.catBtn, activeCategory === cat.key && styles.catBtnActive]}
            onPress={() => setActiveCategory(cat.key as any)}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={activeCategory === cat.key ? colors.black : colors.textMuted}
            />
            <Text style={[styles.catLabel, activeCategory === cat.key && styles.catLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },

  // Categories
  categories: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catBtnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  catLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  catLabelActive: { color: colors.black },

  // Products grid
  list: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: spacing.md },
  productCard: {
    width: CARD_W,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImageWrap: { position: 'relative' },
  productImage: { width: '100%', height: CARD_W * 0.9, backgroundColor: colors.card },
  stockBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(245,158,11,0.85)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  outOfStock: { backgroundColor: 'rgba(239,68,68,0.85)' },
  stockText: { color: colors.black, fontSize: 9, fontWeight: '700' },
  productInfo: { padding: spacing.sm, gap: 4 },
  productBrand: { fontSize: 10, color: colors.gold, fontWeight: '700', letterSpacing: 1 },
  productName: { fontSize: 13, color: colors.textPrimary, fontWeight: '600', lineHeight: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: colors.gold, fontSize: 11, fontWeight: '700' },
  reviewCount: { color: colors.textMuted, fontSize: 10 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  productPrice: { fontSize: 16, fontWeight: '800', color: colors.gold },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: colors.border },

  // Cart
  cartBtn: { position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 9, fontWeight: '700', color: colors.black },

  empty: { alignItems: 'center', padding: spacing.xxl, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});
