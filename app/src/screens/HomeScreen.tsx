import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { BarbOrLogo } from '../components/common/BarbOrLogo';
import { PROMOTIONS, MOCK_APPOINTMENTS } from '../services/mockData';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { appointments } = useBookingStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0.7], extrapolate: 'clamp' });

  const nextAppointment = appointments.find((a) => a.status === 'confirmed');

  const mainActions = [
    {
      icon: 'calendar',
      label: 'Réserver\nun RDV',
      color: colors.gold,
      bgColor: 'rgba(212,175,55,0.12)',
      nav: 'Booking',
    },
    {
      icon: 'bag',
      label: 'Ma\nBoutique',
      color: '#60A5FA',
      bgColor: 'rgba(96,165,250,0.12)',
      nav: 'Shop',
    },
    {
      icon: 'car',
      label: "BARB'\nDRIVER",
      color: '#34D399',
      bgColor: 'rgba(52,211,153,0.12)',
      nav: 'Driver',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.firstName} 👑</Text>
          <Text style={styles.greetingSub}>Votre style, notre expertise</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Logo Area */}
        <LinearGradient
          colors={['#0D1B2A', '#0A0A0A']}
          style={styles.hero}
        >
          <View style={styles.heroDecorTop} />
          <BarbOrLogo size={110} variant="gold" />
          <Text style={styles.heroBrand}>BARB'OR</Text>
          <Text style={styles.heroLocation}>GUYANE</Text>
          <View style={styles.heroLine} />
          <Text style={styles.heroTagline}>✦ L'EXCELLENCE AU SERVICE DE VOTRE STYLE ✦</Text>
        </LinearGradient>

        {/* Main Action Buttons */}
        <View style={styles.actionsGrid}>
          {mainActions.map((action) => (
            <TouchableOpacity
              key={action.nav}
              style={[styles.actionCard, { backgroundColor: action.bgColor, borderColor: action.color + '40' }]}
              onPress={() => navigation.navigate(action.nav)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBg, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={30} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Appointment */}
        {nextAppointment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prochain Rendez-vous</Text>
            <TouchableOpacity
              style={styles.appointmentCard}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#1A2332', '#0D1B2A']}
                style={styles.aptGradient}
              >
                <View style={styles.aptLeft}>
                  <View style={styles.aptDateBox}>
                    <Text style={styles.aptDay}>
                      {new Date(nextAppointment.date).toLocaleDateString('fr-FR', { day: '2-digit' })}
                    </Text>
                    <Text style={styles.aptMonth}>
                      {new Date(nextAppointment.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.aptInfo}>
                  <Text style={styles.aptService}>{nextAppointment.service.name}</Text>
                  <Text style={styles.aptBarber}>avec {nextAppointment.barber.firstName}</Text>
                  <Text style={styles.aptTime}>
                    <Ionicons name="time-outline" size={12} color={colors.gold} /> {nextAppointment.time}
                  </Text>
                </View>
                <View style={styles.aptBadge}>
                  <Text style={styles.aptBadgeText}>CONFIRMÉ</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Promotions */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Offres & Actualités</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
            {PROMOTIONS.map((promo) => (
              <TouchableOpacity key={promo.id} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#D4AF37', '#A08828']}
                  style={styles.promoCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDesc}>{promo.description}</Text>
                  {promo.code && (
                    <View style={styles.promoCodeBadge}>
                      <Text style={styles.promoCode}>CODE : {promo.code}</Text>
                    </View>
                  )}
                  <Text style={styles.promoExpiry}>
                    Jusqu'au {new Date(promo.validUntil).toLocaleDateString('fr-FR')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre Espace</Text>
          <View style={styles.statsRow}>
            {[
              { icon: 'cut', label: 'Coupes', value: '12', color: colors.gold },
              { icon: 'star', label: 'Points Gold', value: '240', color: '#F0D060' },
              { icon: 'bag', label: 'Commandes', value: '3', color: '#60A5FA' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
      </Animated.ScrollView>
    </View>
  );
};

const CARD_WIDTH = (width - spacing.lg * 2 - spacing.sm * 2) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGold,
  },
  greeting: { ...typography.h3, color: colors.textPrimary },
  greetingSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: colors.black },
  scrollContent: { paddingBottom: 20 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  heroDecorTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  heroBrand: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.gold,
    letterSpacing: 8,
    marginTop: spacing.lg,
  },
  heroLocation: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 10,
    marginTop: -2,
  },
  heroLine: { width: 80, height: 1, backgroundColor: colors.gold, marginVertical: spacing.md },
  heroTagline: {
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 2,
  },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Sections
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  seeAll: { color: colors.gold, fontSize: 12, fontWeight: '600' },

  // Appointment
  appointmentCard: { borderRadius: borderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderGold },
  aptGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  aptLeft: {},
  aptDateBox: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aptDay: { fontSize: 20, fontWeight: '900', color: colors.black },
  aptMonth: { fontSize: 10, fontWeight: '700', color: colors.black, letterSpacing: 1 },
  aptInfo: { flex: 1 },
  aptService: { ...typography.h3, color: colors.textPrimary },
  aptBarber: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  aptTime: { color: colors.gold, fontSize: 12, marginTop: 4 },
  aptBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
  },
  aptBadgeText: { color: '#10B981', fontSize: 9, fontWeight: '700', letterSpacing: 1 },

  // Promos
  promoScroll: { marginLeft: -spacing.lg, paddingLeft: spacing.lg },
  promoCard: {
    width: width * 0.75,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    gap: spacing.xs,
  },
  promoTitle: { fontSize: 16, fontWeight: '800', color: colors.black },
  promoDesc: { fontSize: 12, color: 'rgba(0,0,0,0.7)', lineHeight: 18 },
  promoCodeBadge: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  promoCode: { color: colors.black, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  promoExpiry: { color: 'rgba(0,0,0,0.5)', fontSize: 10, marginTop: spacing.xs },

  // Stats
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
});
