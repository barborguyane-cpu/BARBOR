import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useBookingStore } from '../../store/bookingStore';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

export const BookingConfirmScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { draft, confirmBooking } = useBookingStore();
  const [loading, setLoading] = useState(false);

  const deposit = draft.service ? Math.round(draft.service.price * 0.3) : 0;
  const remaining = (draft.service?.price || 0) - deposit;

  const confirm = async () => {
    setLoading(true);
    try {
      await confirmBooking();
      navigation.navigate('BookingSuccess');
    } catch {
      Alert.alert('Erreur', 'Impossible de confirmer la réservation.');
    } finally {
      setLoading(false);
    }
  };

  if (!draft.barber || !draft.service || !draft.date || !draft.time) return null;

  const rows = [
    { label: 'Barber', value: `${draft.barber.firstName} ${draft.barber.lastName}`, icon: 'person' },
    { label: 'Prestation', value: draft.service.name, icon: 'cut' },
    {
      label: 'Date',
      value: new Date(draft.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      icon: 'calendar',
    },
    { label: 'Heure', value: draft.time, icon: 'time' },
    { label: 'Durée', value: `${draft.service.duration} min`, icon: 'timer-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Confirmation"
        subtitle="Récapitulatif de votre réservation"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Barber card */}
        <View style={styles.barberCard}>
          <Image source={{ uri: draft.barber.avatar }} style={styles.barberAvatar} />
          <View>
            <Text style={styles.barberName}>{draft.barber.firstName} {draft.barber.lastName}</Text>
            <Text style={styles.barberSpecialty}>{draft.barber.specialty}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color={colors.gold} />
              <Text style={styles.rating}>{draft.barber.rating}</Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Détails</Text>
          {rows.map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name={row.icon as any} size={16} color={colors.gold} />
                <Text style={styles.detailLabel}>{row.label}</Text>
              </View>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Payment */}
        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>Paiement</Text>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Prix total</Text>
            <Text style={styles.payValue}>{draft.service.price}€</Text>
          </View>
          <View style={[styles.payRow, styles.payRowHighlight]}>
            <View>
              <Text style={[styles.payLabel, { color: colors.gold }]}>Acompte à payer maintenant</Text>
              <Text style={styles.payNote}>(30% du montant total)</Text>
            </View>
            <Text style={styles.payDeposit}>{deposit}€</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Reste à payer en salon</Text>
            <Text style={styles.payRemaining}>{remaining}€</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.info} />
          <Text style={styles.infoText}>
            L'acompte est obligatoire pour confirmer votre rendez-vous. Il sera déduit du montant final.
            Annulation gratuite jusqu'à 24h avant.
          </Text>
        </View>

        <GoldButton
          title={`Payer l'acompte — ${deposit}€`}
          onPress={confirm}
          loading={loading}
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

  barberCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  barberAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: colors.gold },
  barberName: { ...typography.h3, color: colors.textPrimary },
  barberSpecialty: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { color: colors.gold, fontWeight: '700', fontSize: 13 },

  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardTitle: { ...typography.labelLarge, color: colors.gold, marginBottom: spacing.xs },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailLabel: { color: colors.textSecondary, fontSize: 14 },
  detailValue: { color: colors.textPrimary, fontWeight: '600', fontSize: 14, textTransform: 'capitalize' },

  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  payRowHighlight: {
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: -spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  payLabel: { color: colors.textSecondary, fontSize: 14 },
  payNote: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  payValue: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 },
  payDeposit: { fontSize: 24, fontWeight: '900', color: colors.gold },
  payRemaining: { color: colors.textSecondary, fontWeight: '600', fontSize: 16 },

  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  infoText: { flex: 1, color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
});
