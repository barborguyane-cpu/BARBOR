import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { SERVICES, BARB_DRIVER_ZONE } from '../../services/mockData';
import { Service } from '../../services/types';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

const AVAILABLE_SERVICES = SERVICES.filter((s) => ['coupe', 'pack', 'barbe'].includes(s.category));

const calculateTravelFee = (distanceKm: number) =>
  BARB_DRIVER_ZONE.baseFee + distanceKm * BARB_DRIVER_ZONE.perKmFee;

export const DriverFormScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [estimatedDistance] = useState(4.2); // simulated

  const travelFee = calculateTravelFee(estimatedDistance);
  const total = selectedService ? selectedService.price + travelFee : travelFee;
  const deposit = Math.round(total * 0.3);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="BARB'DRIVER"
        subtitle="Formulaire de commande"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Votre adresse</Text>
          </View>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Numéro, rue, ville, code postal..."
            placeholderTextColor={colors.textMuted}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            selectionColor={colors.gold}
          />
          {address.length > 0 && (
            <View style={styles.distanceInfo}>
              <Ionicons name="navigate-outline" size={14} color={colors.success} />
              <Text style={styles.distanceText}>
                Distance estimée : ~{estimatedDistance} km
              </Text>
              <Text style={styles.distanceFee}>Frais : {travelFee.toFixed(2)}€</Text>
            </View>
          )}
        </View>

        {/* Service */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cut-outline" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Prestation</Text>
          </View>
          {AVAILABLE_SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceBtn, selectedService?.id === service.id && styles.serviceBtnActive]}
              onPress={() => setSelectedService(service)}
            >
              <View style={styles.serviceBtnLeft}>
                <Text style={[styles.serviceName, selectedService?.id === service.id && { color: colors.gold }]}>
                  {service.name}
                </Text>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
              </View>
              <View style={styles.serviceBtnRight}>
                <Text style={styles.servicePrice}>{service.price}€</Text>
                {selectedService?.id === service.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-outline" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Instructions spéciales (optionnel)</Text>
          </View>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Digicode, étage, instructions particulières..."
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            selectionColor={colors.gold}
          />
        </View>

        {/* Recap */}
        {selectedService && (
          <View style={styles.recapCard}>
            <Text style={styles.recapTitle}>Récapitulatif</Text>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Prestation</Text>
              <Text style={styles.recapValue}>{selectedService.price}€</Text>
            </View>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Déplacement ({estimatedDistance} km)</Text>
              <Text style={styles.recapValue}>{travelFee.toFixed(2)}€</Text>
            </View>
            <View style={[styles.recapRow, styles.recapTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)}€</Text>
            </View>
            <View style={styles.depositRow}>
              <Ionicons name="card-outline" size={16} color={colors.gold} />
              <Text style={styles.depositText}>Acompte requis : {deposit}€ (30%)</Text>
            </View>
          </View>
        )}

        <GoldButton
          title="Confirmer la demande"
          onPress={() => navigation.navigate('DriverConfirm')}
          disabled={!address || !selectedService}
          size="lg"
          style={{ marginTop: spacing.lg }}
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
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
  },
  inputMultiline: { paddingVertical: spacing.md, textAlignVertical: 'top' },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  distanceText: { flex: 1, color: colors.success, fontSize: 12, fontWeight: '600' },
  distanceFee: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  serviceBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  serviceBtnActive: { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.08)' },
  serviceBtnLeft: {},
  serviceBtnRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  serviceName: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  serviceDuration: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  servicePrice: { fontSize: 18, fontWeight: '800', color: colors.gold },
  recapCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  recapTitle: { ...typography.labelLarge, color: colors.gold },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recapLabel: { color: colors.textSecondary, fontSize: 14 },
  recapValue: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  recapTotal: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
    marginTop: spacing.xs,
  },
  totalLabel: { ...typography.h3, color: colors.textPrimary },
  totalValue: { fontSize: 24, fontWeight: '900', color: colors.gold },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  depositText: { color: colors.gold, fontWeight: '600', fontSize: 13 },
});
