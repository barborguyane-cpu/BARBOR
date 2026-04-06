import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useBookingStore } from '../../store/bookingStore';
import { BARBERS } from '../../services/mockData';
import { Barber } from '../../services/types';
import { ScreenHeader } from '../../components/common/ScreenHeader';

const { width } = Dimensions.get('window');

export const SelectBarberScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { draft, setDraftBarber } = useBookingStore();

  const selectBarber = (barber: Barber) => {
    setDraftBarber(barber);
    navigation.navigate('SelectService');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Réservation"
        subtitle="Choisissez votre barber"
      />

      {/* Steps indicator */}
      <View style={styles.steps}>
        {['Barber', 'Service', 'Date', 'Paiement'].map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
              <Text style={[styles.stepNum, i === 0 && styles.stepNumActive]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>{s}</Text>
            {i < 3 && <View style={[styles.stepLine, i < 0 && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Nos Barbers</Text>
        {BARBERS.map((barber) => (
          <TouchableOpacity
            key={barber.id}
            style={[
              styles.barberCard,
              draft.barber?.id === barber.id && styles.barberCardSelected,
              !barber.available && styles.barberCardUnavailable,
            ]}
            onPress={() => barber.available && selectBarber(barber)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={draft.barber?.id === barber.id ? ['#1A2D1A', '#0D1B2A'] : ['#141E2B', '#0D1B2A']}
              style={styles.cardGradient}
            >
              <Image source={{ uri: barber.avatar }} style={styles.avatar} />
              <View style={styles.barberInfo}>
                <Text style={styles.barberName}>{barber.firstName} {barber.lastName}</Text>
                <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={colors.gold} />
                  <Text style={styles.ratingText}>{barber.rating}</Text>
                  <Text style={styles.reviewCount}>({barber.reviewCount} avis)</Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                {draft.barber?.id === barber.id ? (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color={colors.black} />
                  </View>
                ) : barber.available ? (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Dispo</Text>
                  </View>
                ) : (
                  <View style={styles.unavailableBadge}>
                    <Text style={styles.unavailableText}>Indispo</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },

  // Steps
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepItem: { alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  stepNum: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  stepNumActive: { color: colors.black },
  stepLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.5 },
  stepLabelActive: { color: colors.gold },
  stepLine: {
    position: 'absolute',
    top: 14,
    right: -spacing.xs,
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: colors.gold },

  sectionTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.lg },

  // Barber cards
  barberCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  barberCardSelected: { borderColor: colors.gold },
  barberCardUnavailable: { opacity: 0.5 },
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: colors.gold },
  barberInfo: { flex: 1 },
  barberName: { ...typography.h3, color: colors.textPrimary },
  barberSpecialty: { color: colors.textSecondary, fontSize: 13, marginTop: 2, marginBottom: spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  reviewCount: { color: colors.textMuted, fontSize: 12 },
  cardRight: {},
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
  },
  availableText: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  unavailableBadge: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  unavailableText: { color: colors.error, fontSize: 11, fontWeight: '700' },
});
