import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { useShopStore } from '../../store/shopStore';
import { BarbOrLogo } from '../../components/common/BarbOrLogo';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Appointment, Order } from '../../services/types';

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#10B981',
  pending: '#F59E0B',
  completed: '#6B7280',
  cancelled: '#EF4444',
  processing: '#3B82F6',
  delivered: '#10B981',
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmé',
  pending: 'En attente',
  completed: 'Terminé',
  cancelled: 'Annulé',
  processing: 'En cours',
  delivered: 'Livré',
};

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { appointments } = useBookingStore();
  const { orders } = useShopStore();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Modifier mon profil', action: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', action: () => {} },
    { icon: 'heart-outline', label: 'Mes favoris', action: () => {} },
    { icon: 'shield-outline', label: 'Confidentialité', action: () => {} },
    { icon: 'help-circle-outline', label: 'Aide & Support', action: () => {} },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Mon Profil" subtitle="Espace client premium" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Header */}
        <LinearGradient colors={['#0D1B2A', '#141E2B']} style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
            </View>
            <View style={styles.goldBadge}>
              <Ionicons name="star" size={10} color={colors.black} />
              <Text style={styles.goldBadgeText}>GOLD</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profilePhone}>{user?.phone}</Text>
          <View style={styles.loyaltyBar}>
            <Text style={styles.loyaltyLabel}>Fidélité Gold : 240 pts</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '62%' }]} />
            </View>
            <Text style={styles.loyaltyHint}>138 pts pour la prochaine récompense</Text>
          </View>
        </LinearGradient>

        {/* Appointments History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Rendez-vous ({appointments.length})</Text>
          {appointments.slice(0, 3).map((apt) => (
            <View key={apt.id} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.aptDateBox}>
                  <Text style={styles.aptDay}>{new Date(apt.date).getDate()}</Text>
                  <Text style={styles.aptMonth}>
                    {new Date(apt.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{apt.service.name}</Text>
                <Text style={styles.historySubtitle}>avec {apt.barber.firstName} — {apt.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[apt.status] + '20' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[apt.status] }]}>
                  {STATUS_LABELS[apt.status]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Orders History */}
        {orders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes Commandes ({orders.length})</Text>
            {orders.map((order) => (
              <View key={order.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <Ionicons name="bag-outline" size={28} color={colors.gold} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{order.items.length} article(s)</Text>
                  <Text style={styles.historySubtitle}>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.orderAmount}>{order.totalAmount.toFixed(2)}€</Text>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] + '20' }]}>
                    <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>
                      {STATUS_LABELS[order.status]}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <BarbOrLogo size={40} variant="dark" />
          <Text style={styles.footerText}>BARB'OR GUYANE © 2024</Text>
          <Text style={styles.footerVersion}>v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },

  profileCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  avatarWrap: { position: 'relative', marginBottom: spacing.sm },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.goldLight,
  },
  avatarText: { fontSize: 28, fontWeight: '900', color: colors.black },
  goldBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.gold,
    borderRadius: borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  goldBadgeText: { fontSize: 8, fontWeight: '800', color: colors.black, letterSpacing: 1 },
  profileName: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: 0.5 },
  profileEmail: { color: colors.textSecondary, fontSize: 13 },
  profilePhone: { color: colors.textMuted, fontSize: 13 },
  loyaltyBar: { width: '100%', gap: spacing.xs, marginTop: spacing.md },
  loyaltyLabel: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  progressBar: { height: 8, backgroundColor: colors.card, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 4 },
  loyaltyHint: { color: colors.textMuted, fontSize: 11 },

  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyLeft: {},
  aptDateBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  aptDay: { fontSize: 16, fontWeight: '900', color: colors.gold },
  aptMonth: { fontSize: 9, fontWeight: '700', color: colors.gold, letterSpacing: 0.5 },
  historyInfo: { flex: 1 },
  historyTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  historySubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  orderAmount: { color: colors.gold, fontWeight: '800', fontSize: 16, textAlign: 'right', marginBottom: 4 },
  statusBadge: { borderRadius: borderRadius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: 14 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: spacing.xl,
  },
  logoutText: { color: colors.error, fontWeight: '700', fontSize: 15 },

  footer: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 12, letterSpacing: 1 },
  footerVersion: { color: colors.textMuted, fontSize: 11 },
});
