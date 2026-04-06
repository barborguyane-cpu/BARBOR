import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useShopStore } from '../../store/shopStore';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

export const CheckoutScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { cart, cartTotal, checkout } = useShopStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'Guyane française',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.postalCode) {
      Alert.alert('Adresse requise', 'Veuillez remplir votre adresse de livraison.');
      return;
    }
    setLoading(true);
    try {
      await checkout({ ...address, country: 'Guyane française' });
      navigation.navigate('OrderSuccess');
    } catch {
      Alert.alert('Erreur', 'Impossible de finaliser la commande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Commande" subtitle="Finalisation" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          </View>
          {[
            { key: 'street', label: 'Rue et numéro', placeholder: '12 rue de la Liberté' },
            { key: 'city', label: 'Ville', placeholder: 'Cayenne' },
            { key: 'postalCode', label: 'Code postal', placeholder: '97300' },
          ].map((f) => (
            <View key={f.key} style={styles.inputWrap}>
              <Text style={styles.inputLabel}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textMuted}
                value={address[f.key as keyof typeof address]}
                onChangeText={(v) => setAddress((a) => ({ ...a, [f.key]: v }))}
                selectionColor={colors.gold}
              />
            </View>
          ))}
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Mode de paiement</Text>
          </View>
          {[
            { key: 'card', label: 'Carte bancaire', icon: 'card-outline', note: 'Visa, Mastercard, CB' },
            { key: 'mobile', label: 'Paiement mobile', icon: 'phone-portrait-outline', note: 'Orange Money, etc.' },
          ].map((pm) => (
            <TouchableOpacity
              key={pm.key}
              style={[styles.pmBtn, paymentMethod === pm.key && styles.pmBtnActive]}
              onPress={() => setPaymentMethod(pm.key as any)}
            >
              <Ionicons name={pm.icon as any} size={22} color={paymentMethod === pm.key ? colors.gold : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.pmLabel, paymentMethod === pm.key && styles.pmLabelActive]}>{pm.label}</Text>
                <Text style={styles.pmNote}>{pm.note}</Text>
              </View>
              {paymentMethod === pm.key && (
                <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Récapitulatif ({cart.length} articles)</Text>
          </View>
          {cart.map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.orderItemName} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.orderItemQty}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>{(item.product.price * item.quantity).toFixed(2)}€</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{cartTotal().toFixed(2)}€</Text>
          </View>
        </View>

        <GoldButton
          title={`Payer ${cartTotal().toFixed(2)}€`}
          onPress={handleCheckout}
          loading={loading}
          size="lg"
          style={{ marginTop: spacing.md }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    color: colors.textPrimary,
    fontSize: 14,
  },
  pmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pmBtnActive: { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.08)' },
  pmLabel: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  pmLabelActive: { color: colors.textPrimary },
  pmNote: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  orderItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  orderItemName: { flex: 1, color: colors.textSecondary, fontSize: 13 },
  orderItemQty: { color: colors.textMuted, fontSize: 13 },
  orderItemPrice: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
    marginTop: spacing.xs,
  },
  totalLabel: { ...typography.h3, color: colors.textPrimary },
  totalValue: { fontSize: 22, fontWeight: '900', color: colors.gold },
});
