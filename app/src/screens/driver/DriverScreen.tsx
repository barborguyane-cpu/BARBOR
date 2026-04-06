import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { SERVICES, BARB_DRIVER_ZONE } from '../../services/mockData';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

const { width } = Dimensions.get('window');

const HOW_IT_WORKS = [
  { step: '01', icon: 'location-outline', title: 'Votre adresse', desc: 'Indiquez où vous voulez être servi' },
  { step: '02', icon: 'cut-outline', title: 'Choisissez', desc: 'Sélectionnez la prestation souhaitée' },
  { step: '03', icon: 'card-outline', title: 'Acompte', desc: 'Payez un acompte pour confirmer' },
  { step: '04', icon: 'car-outline', title: 'On arrive !', desc: 'Votre barber vient chez vous' },
];

export const DriverScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const driverServices = SERVICES.filter((s) => ['coupe', 'pack', 'barbe'].includes(s.category));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="BARB'DRIVER" subtitle="Service à domicile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <LinearGradient colors={['#0D1B2A', '#0A0A0A']} style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="car" size={16} color={colors.black} />
            <Text style={styles.heroBadgeText}>SERVICE PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>Votre barber{'\n'}se déplace chez vous</Text>
          <Text style={styles.heroSubtitle}>
            Dans un rayon de {BARB_DRIVER_ZONE.radiusKm} km autour de Cayenne.
            Frais de déplacement calculés automatiquement.
          </Text>
          <View style={styles.heroStats}>
            {[
              { icon: 'navigate-outline', label: 'Zone', value: `${BARB_DRIVER_ZONE.radiusKm} km` },
              { icon: 'car-outline', label: 'Départ', value: `${BARB_DRIVER_ZONE.baseFee}€` },
              { icon: 'time-outline', label: 'Arrivée', value: '~30 min' },
            ].map((s) => (
              <View key={s.label} style={styles.heroStat}>
                <Ionicons name={s.icon as any} size={20} color={colors.gold} />
                <Text style={styles.heroStatValue}>{s.value}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
          <View style={styles.stepsGrid}>
            {HOW_IT_WORKS.map((h) => (
              <View key={h.step} style={styles.stepCard}>
                <Text style={styles.stepNum}>{h.step}</Text>
                <Ionicons name={h.icon as any} size={24} color={colors.gold} />
                <Text style={styles.stepTitle}>{h.title}</Text>
                <Text style={styles.stepDesc}>{h.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prestations disponibles</Text>
          {driverServices.map((service) => (
            <View key={service.id} style={styles.serviceRow}>
              <View style={styles.serviceLeft}>
                <Ionicons name="cut-outline" size={18} color={colors.gold} />
                <View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>{service.duration} min</Text>
                </View>
              </View>
              <View style={styles.serviceRight}>
                <Text style={styles.servicePrice}>{service.price}€</Text>
                <Text style={styles.serviceFee}>+ déplacement</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.sectionTitle}>Tarification déplacement</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Forfait de base</Text>
            <Text style={styles.pricingValue}>{BARB_DRIVER_ZONE.baseFee}€</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Par km supplémentaire</Text>
            <Text style={styles.pricingValue}>{BARB_DRIVER_ZONE.perKmFee}€/km</Text>
          </View>
          <View style={[styles.pricingRow, styles.pricingExample]}>
            <Text style={styles.pricingExampleText}>Exemple : 5 km → {BARB_DRIVER_ZONE.baseFee + 5 * BARB_DRIVER_ZONE.perKmFee}€ de déplacement</Text>
          </View>
        </View>

        {/* Zone info */}
        <View style={styles.zoneCard}>
          <Ionicons name="map-outline" size={24} color={colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.zoneTitle}>Zone de couverture</Text>
            <Text style={styles.zoneDesc}>
              Cayenne, Matoury, Rémire-Montjoly, Montsinéry et environs dans un rayon de {BARB_DRIVER_ZONE.radiusKm} km.
            </Text>
          </View>
        </View>

        <GoldButton
          title="Réserver BARB'DRIVER"
          onPress={() => navigation.navigate('DriverForm')}
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

  hero: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
    overflow: 'hidden',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  heroBadgeText: { fontSize: 10, fontWeight: '800', color: colors.black, letterSpacing: 1.5 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, lineHeight: 36 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
    marginTop: spacing.sm,
  },
  heroStat: { alignItems: 'center', gap: 4 },
  heroStatValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  heroStatLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },

  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },

  stepsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stepCard: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepNum: { fontSize: 10, fontWeight: '800', color: colors.gold, letterSpacing: 1 },
  stepTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  stepDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  serviceName: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  serviceDuration: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  serviceRight: { alignItems: 'flex-end' },
  servicePrice: { fontSize: 18, fontWeight: '800', color: colors.gold },
  serviceFee: { fontSize: 10, color: colors.textMuted },

  pricingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
    marginBottom: spacing.xl,
  },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pricingLabel: { color: colors.textSecondary, fontSize: 14 },
  pricingValue: { color: colors.gold, fontWeight: '700', fontSize: 16 },
  pricingExample: {
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  pricingExampleText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },

  zoneCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  zoneTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  zoneDesc: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
});
