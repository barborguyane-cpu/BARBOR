import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useBookingStore } from '../../store/bookingStore';
import { GoldButton } from '../../components/common/GoldButton';

export const BookingSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { appointments } = useBookingStore();
  const latest = appointments[0];

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B2A']} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <LinearGradient colors={['#F0D060', '#D4AF37', '#A08828']} style={styles.iconGrad}>
            <Ionicons name="checkmark" size={48} color={colors.black} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity, alignItems: 'center', gap: spacing.sm }}>
          <Text style={styles.title}>Réservation confirmée !</Text>
          <Text style={styles.subtitle}>Votre rendez-vous est enregistré</Text>

          {latest && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Ionicons name="person-outline" size={16} color={colors.gold} />
                <Text style={styles.summaryText}>
                  {latest.barber.firstName} {latest.barber.lastName}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="cut-outline" size={16} color={colors.gold} />
                <Text style={styles.summaryText}>{latest.service.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.gold} />
                <Text style={styles.summaryText}>
                  {new Date(latest.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })} à {latest.time}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.depositRow]}>
                <Ionicons name="card-outline" size={16} color={colors.success} />
                <Text style={[styles.summaryText, { color: colors.success }]}>
                  Acompte payé : {latest.depositAmount}€
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.notifNote}>
            Vous recevrez un rappel 24h avant votre rendez-vous.
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <GoldButton
          title="Retour à l'accueil"
          onPress={() => navigation.navigate('Home')}
          size="lg"
          style={{ marginBottom: spacing.md }}
        />
        <GoldButton
          title="Voir mes RDV"
          onPress={() => navigation.navigate('Profile')}
          variant="outline"
          size="lg"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  iconCircle: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden' },
  iconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, letterSpacing: 1, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderGold,
    marginTop: spacing.md,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryText: { color: colors.textPrimary, fontSize: 14, flex: 1, textTransform: 'capitalize' },
  depositRow: {
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  notifNote: { color: colors.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: spacing.sm },
  footer: { padding: spacing.lg, gap: spacing.md },
});
