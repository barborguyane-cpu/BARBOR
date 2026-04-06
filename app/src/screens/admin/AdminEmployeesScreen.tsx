import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { BARBERS } from '../../services/mockData';
import { ScreenHeader } from '../../components/common/ScreenHeader';

const MOCK_REVENUE = { b1: 1640, b2: 1220, b3: 980, b4: 1890 };
const MOCK_CLIENTS = { b1: 67, b2: 48, b3: 39, b4: 74 };

export const AdminEmployeesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Employés" subtitle="Performance barbers" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Team overview */}
        <View style={styles.overviewRow}>
          {[
            { icon: 'people', label: 'Barbers', value: BARBERS.length, color: colors.gold },
            { icon: 'checkmark-circle', label: 'Disponibles', value: BARBERS.filter(b => b.available).length, color: colors.success },
            { icon: 'star', label: 'Note moy.', value: (BARBERS.reduce((s, b) => s + b.rating, 0) / BARBERS.length).toFixed(1), color: '#F472B6' },
          ].map((s) => (
            <View key={s.label} style={styles.overviewCard}>
              <Ionicons name={s.icon as any} size={22} color={s.color} />
              <Text style={[styles.overviewValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.overviewLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Barbers */}
        {BARBERS.map((barber) => {
          const revenue = MOCK_REVENUE[barber.id as keyof typeof MOCK_REVENUE] || 0;
          const clients = MOCK_CLIENTS[barber.id as keyof typeof MOCK_CLIENTS] || 0;
          return (
            <View key={barber.id} style={styles.barberCard}>
              <LinearGradient colors={['#141E2B', '#0D1B2A']} style={styles.barberGradient}>
                <View style={styles.barberTop}>
                  <Image source={{ uri: barber.avatar }} style={styles.barberAvatar} />
                  <View style={styles.barberInfo}>
                    <Text style={styles.barberName}>{barber.firstName} {barber.lastName}</Text>
                    <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={13} color={colors.gold} />
                      <Text style={styles.ratingText}>{barber.rating}</Text>
                      <Text style={styles.reviewCount}>({barber.reviewCount} avis)</Text>
                    </View>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: barber.available ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }]}>
                    <View style={[styles.statusDot, { backgroundColor: barber.available ? colors.success : colors.error }]} />
                    <Text style={[styles.statusText, { color: barber.available ? colors.success : colors.error }]}>
                      {barber.available ? 'Actif' : 'Absent'}
                    </Text>
                  </View>
                </View>

                {/* Performance stats */}
                <View style={styles.perfRow}>
                  {[
                    { label: 'Clients ce mois', value: clients, icon: 'people-outline', color: '#60A5FA' },
                    { label: 'Revenus générés', value: `${revenue}€`, icon: 'trending-up-outline', color: colors.gold },
                    { label: 'Satisfaction', value: `${barber.rating * 20}%`, icon: 'heart-outline', color: '#F472B6' },
                  ].map((stat) => (
                    <View key={stat.label} style={styles.perfStat}>
                      <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                      <Text style={[styles.perfValue, { color: stat.color }]}>{stat.value}</Text>
                      <Text style={styles.perfLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Rating bar */}
                <View style={styles.ratingBarWrap}>
                  <View style={styles.ratingBarRow}>
                    <Text style={styles.ratingBarLabel}>Performance globale</Text>
                    <Text style={styles.ratingBarValue}>{barber.rating}/5</Text>
                  </View>
                  <View style={styles.ratingBarBg}>
                    <View style={[styles.ratingBarFill, { width: `${(barber.rating / 5) * 100}%` }]} />
                  </View>
                </View>
              </LinearGradient>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  overviewRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewValue: { fontSize: 22, fontWeight: '900' },
  overviewLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },
  barberCard: { borderRadius: borderRadius.xl, overflow: 'hidden', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderGold },
  barberGradient: { padding: spacing.lg, gap: spacing.lg },
  barberTop: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  barberAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: colors.gold },
  barberInfo: { flex: 1 },
  barberName: { ...typography.h3, color: colors.textPrimary },
  barberSpecialty: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  reviewCount: { color: colors.textMuted, fontSize: 11 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  perfRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: borderRadius.lg, padding: spacing.md },
  perfStat: { alignItems: 'center', gap: 4 },
  perfValue: { fontSize: 16, fontWeight: '800' },
  perfLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
  ratingBarWrap: { gap: spacing.xs },
  ratingBarRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ratingBarLabel: { color: colors.textMuted, fontSize: 12 },
  ratingBarValue: { color: colors.gold, fontWeight: '700', fontSize: 12 },
  ratingBarBg: { height: 6, backgroundColor: colors.card, borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
});
