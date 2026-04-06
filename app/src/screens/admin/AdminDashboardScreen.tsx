import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { BarbOrLogo } from '../../components/common/BarbOrLogo';
import { BARBERS, MOCK_APPOINTMENTS } from '../../services/mockData';

const { width } = Dimensions.get('window');

type Period = 'day' | 'week' | 'month';

const MOCK_STATS = {
  day: { revenue: 340, appointments: 12, fillRate: 85, products: 4 },
  week: { revenue: 1820, appointments: 67, fillRate: 78, products: 23 },
  month: { revenue: 8450, appointments: 284, fillRate: 82, products: 98 },
};

const RECENT_APTS = MOCK_APPOINTMENTS;

export const AdminDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const [period, setPeriod] = useState<Period>('week');
  const stats = MOCK_STATS[period];

  const kpis = [
    { icon: 'trending-up', label: "Chiffre d'affaires", value: `${stats.revenue}€`, color: colors.gold, bg: 'rgba(212,175,55,0.12)' },
    { icon: 'calendar', label: 'Rendez-vous', value: stats.appointments, color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
    { icon: 'people', label: 'Taux remplissage', value: `${stats.fillRate}%`, color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
    { icon: 'bag', label: 'Produits vendus', value: stats.products, color: '#F472B6', bg: 'rgba(244,114,182,0.12)' },
  ];

  const menuItems = [
    { icon: 'calendar-outline', label: 'Planning & RDV', nav: 'AdminAppointments', color: colors.gold },
    { icon: 'people-outline', label: 'Employés', nav: 'AdminEmployees', color: '#60A5FA' },
    { icon: 'bag-outline', label: 'Produits & Stock', nav: 'AdminProducts', color: '#34D399' },
    { icon: 'person-outline', label: 'Clients', nav: 'AdminClients', color: '#F472B6' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Admin Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BarbOrLogo size={36} variant="gold" />
          <View>
            <Text style={styles.headerTitle}>ADMIN</Text>
            <Text style={styles.headerSub}>BARB'OR GUYANE</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Welcome */}
        <LinearGradient colors={['#0D1B2A', '#1A2332']} style={styles.welcomeCard}>
          <View>
            <Text style={styles.welcomeText}>Bonjour, {user?.firstName}</Text>
            <Text style={styles.welcomeSub}>Tableau de bord gérant</Text>
          </View>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </LinearGradient>

        {/* Period Selector */}
        <View style={styles.periodRow}>
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodLabel, period === p && styles.periodLabelActive]}>
                {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <View key={kpi.label} style={[styles.kpiCard, { backgroundColor: kpi.bg, borderColor: kpi.color + '30' }]}>
              <View style={[styles.kpiIconBg, { backgroundColor: kpi.color + '20' }]}>
                <Ionicons name={kpi.icon as any} size={22} color={kpi.color} />
              </View>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Gestion</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.nav}
              style={styles.menuCard}
              onPress={() => navigation.navigate(item.nav)}
              activeOpacity={0.85}
            >
              <View style={[styles.menuIconBg, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: item.color }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={item.color + '80'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Appointments */}
        <Text style={styles.sectionTitle}>Rendez-vous récents</Text>
        {RECENT_APTS.map((apt) => (
          <View key={apt.id} style={styles.aptCard}>
            <View style={styles.aptTime}>
              <Text style={styles.aptTimeText}>{apt.time}</Text>
              <Text style={styles.aptDateSmall}>{new Date(apt.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</Text>
            </View>
            <View style={styles.aptInfo}>
              <Text style={styles.aptClient}>Client #{apt.clientId}</Text>
              <Text style={styles.aptService}>{apt.service.name}</Text>
              <Text style={styles.aptBarber}>Barber : {apt.barber.firstName}</Text>
            </View>
            <View style={styles.aptRight}>
              <Text style={styles.aptAmount}>{apt.totalAmount}€</Text>
              <View style={[styles.aptStatus, {
                backgroundColor: apt.status === 'confirmed' ? 'rgba(16,185,129,0.15)' :
                  apt.status === 'completed' ? 'rgba(107,114,128,0.15)' : 'rgba(245,158,11,0.15)'
              }]}>
                <Text style={{
                  fontSize: 9, fontWeight: '700',
                  color: apt.status === 'confirmed' ? colors.success :
                    apt.status === 'completed' ? colors.textMuted : colors.warning
                }}>
                  {apt.status === 'confirmed' ? 'CONFIRMÉ' : apt.status === 'completed' ? 'TERMINÉ' : 'EN ATTENTE'}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Barber Performance */}
        <Text style={styles.sectionTitle}>Performance Barbers</Text>
        {BARBERS.map((barber) => (
          <View key={barber.id} style={styles.barberPerfCard}>
            <View style={styles.barberPerfLeft}>
              <View style={styles.barberInitials}>
                <Text style={styles.barberInitialsText}>{barber.firstName[0]}{barber.lastName[0]}</Text>
              </View>
              <View>
                <Text style={styles.barberPerfName}>{barber.firstName} {barber.lastName}</Text>
                <Text style={styles.barberPerfSpecialty}>{barber.specialty}</Text>
              </View>
            </View>
            <View style={styles.barberPerfStats}>
              <View style={styles.barberStat}>
                <Text style={styles.barberStatValue}>{barber.reviewCount}</Text>
                <Text style={styles.barberStatLabel}>clients</Text>
              </View>
              <View style={styles.barberStat}>
                <Text style={[styles.barberStatValue, { color: colors.gold }]}>{barber.rating}</Text>
                <Text style={styles.barberStatLabel}>note</Text>
              </View>
              <View style={[styles.availDot, { backgroundColor: barber.available ? colors.success : colors.error }]} />
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const CARD_W = (width - spacing.lg * 2 - spacing.sm) / 2;

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
    backgroundColor: colors.surface,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerTitle: { fontSize: 16, fontWeight: '900', color: colors.gold, letterSpacing: 3 },
  headerSub: { fontSize: 10, color: colors.textMuted, letterSpacing: 1 },
  logoutBtn: { padding: spacing.xs },
  scroll: { padding: spacing.lg },

  welcomeCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  welcomeText: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  welcomeSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  dateBadge: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  dateText: { color: colors.gold, fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },

  periodRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodBtn: { flex: 1, paddingVertical: spacing.xs + 2, borderRadius: borderRadius.full, alignItems: 'center' },
  periodBtnActive: { backgroundColor: colors.gold },
  periodLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  periodLabelActive: { color: colors.black },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  kpiCard: {
    width: CARD_W,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
  },
  kpiIconBg: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: 26, fontWeight: '900' },
  kpiLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },

  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },

  menuGrid: { gap: spacing.sm, marginBottom: spacing.xl },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIconBg: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700' },

  aptCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  aptTime: { alignItems: 'center', minWidth: 48 },
  aptTimeText: { fontSize: 16, fontWeight: '800', color: colors.gold },
  aptDateSmall: { fontSize: 10, color: colors.textMuted },
  aptInfo: { flex: 1 },
  aptClient: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  aptService: { color: colors.textSecondary, fontSize: 12 },
  aptBarber: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  aptRight: { alignItems: 'flex-end', gap: 4 },
  aptAmount: { fontSize: 16, fontWeight: '800', color: colors.gold },
  aptStatus: { borderRadius: borderRadius.sm, paddingHorizontal: 6, paddingVertical: 3 },

  barberPerfCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barberPerfLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  barberInitials: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  barberInitialsText: { color: colors.gold, fontWeight: '800', fontSize: 14 },
  barberPerfName: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  barberPerfSpecialty: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  barberPerfStats: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  barberStat: { alignItems: 'center' },
  barberStatValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  barberStatLabel: { fontSize: 10, color: colors.textMuted },
  availDot: { width: 10, height: 10, borderRadius: 5 },
});
