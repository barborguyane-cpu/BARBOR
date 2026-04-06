import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { MOCK_APPOINTMENTS, BARBERS } from '../../services/mockData';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Appointment } from '../../services/types';

const STATUS_COLOR: Record<string, string> = {
  confirmed: colors.success,
  pending: colors.warning,
  completed: colors.textMuted,
  cancelled: colors.error,
};

export const AdminAppointmentsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedBarber, setSelectedBarber] = useState<string>('all');

  const filtered = MOCK_APPOINTMENTS.filter(
    (a) => selectedBarber === 'all' || a.barberId === selectedBarber
  );

  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.card}>
      <View style={[styles.statusIndicator, { backgroundColor: STATUS_COLOR[item.status] }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTime}>{item.time}</Text>
          <Text style={styles.cardDate}>
            {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '20' }]}>
            <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.clientName}>Client #{item.clientId}</Text>
        <Text style={styles.serviceInfo}>{item.service.name} — {item.barber.firstName}</Text>
        <View style={styles.cardBottom}>
          <Text style={styles.amount}>{item.totalAmount}€</Text>
          {item.depositPaid && (
            <View style={styles.depositBadge}>
              <Ionicons name="card-outline" size={12} color={colors.success} />
              <Text style={styles.depositText}>Acompte payé</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Planning & RDV" onBack={() => navigation.goBack()} />

      {/* Barber filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, selectedBarber === 'all' && styles.filterBtnActive]}
          onPress={() => setSelectedBarber('all')}
        >
          <Text style={[styles.filterLabel, selectedBarber === 'all' && styles.filterLabelActive]}>Tous</Text>
        </TouchableOpacity>
        {BARBERS.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[styles.filterBtn, selectedBarber === b.id && styles.filterBtnActive]}
            onPress={() => setSelectedBarber(b.id)}
          >
            <Text style={[styles.filterLabel, selectedBarber === b.id && styles.filterLabelActive]}>
              {b.firstName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aucun rendez-vous</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, padding: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  filterLabelActive: { color: colors.black },
  list: { padding: spacing.lg, paddingBottom: 40 },
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  statusIndicator: { width: 4 },
  cardContent: { flex: 1, padding: spacing.md, gap: spacing.xs },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardTime: { fontSize: 16, fontWeight: '800', color: colors.gold, flex: 1 },
  cardDate: { color: colors.textMuted, fontSize: 12 },
  statusBadge: { borderRadius: borderRadius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  clientName: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  serviceInfo: { color: colors.textSecondary, fontSize: 13 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  amount: { fontSize: 18, fontWeight: '900', color: colors.gold },
  depositBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: borderRadius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  depositText: { color: colors.success, fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', padding: spacing.xxl, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});
