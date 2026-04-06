import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';

const MOCK_CLIENTS = [
  { id: 'u1', name: 'Jean MARTIN', phone: '+594 694 12 34 56', visits: 12, spend: 340, lastVisit: '2024-04-10', loyal: true },
  { id: 'u2', name: 'Marc DUPONT', phone: '+594 694 23 45 67', visits: 8, spend: 220, lastVisit: '2024-04-05', loyal: false },
  { id: 'u3', name: 'Kevin LOUIS', phone: '+594 694 34 56 78', visits: 23, spend: 680, lastVisit: '2024-04-08', loyal: true },
  { id: 'u4', name: 'Thomas CESAR', phone: '+594 694 45 67 89', visits: 5, spend: 130, lastVisit: '2024-03-28', loyal: false },
  { id: 'u5', name: 'Alexis MOREAU', phone: '+594 694 56 78 90', visits: 18, spend: 520, lastVisit: '2024-04-09', loyal: true },
];

export const AdminClientsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Clients" subtitle={`${MOCK_CLIENTS.length} clients`} onBack={() => navigation.goBack()} />
      <View style={styles.summaryRow}>
        {[
          { label: 'Total', value: MOCK_CLIENTS.length, color: colors.gold },
          { label: 'Gold', value: MOCK_CLIENTS.filter(c => c.loyal).length, color: '#F472B6' },
          { label: 'Dépense moy.', value: `${Math.round(MOCK_CLIENTS.reduce((s, c) => s + c.spend, 0) / MOCK_CLIENTS.length)}€`, color: colors.success },
        ].map((s) => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={MOCK_CLIENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.clientCard}>
            <View style={styles.clientAvatar}>
              <Text style={styles.clientAvatarText}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View style={styles.clientInfo}>
              <View style={styles.clientNameRow}>
                <Text style={styles.clientName}>{item.name}</Text>
                {item.loyal && (
                  <View style={styles.goldTag}>
                    <Ionicons name="star" size={10} color={colors.black} />
                    <Text style={styles.goldTagText}>GOLD</Text>
                  </View>
                )}
              </View>
              <Text style={styles.clientPhone}>{item.phone}</Text>
              <Text style={styles.clientLastVisit}>Dernière visite : {new Date(item.lastVisit).toLocaleDateString('fr-FR')}</Text>
            </View>
            <View style={styles.clientStats}>
              <Text style={styles.clientVisits}>{item.visits} visites</Text>
              <Text style={styles.clientSpend}>{item.spend}€</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryCard: { flex: 1, alignItems: 'center', padding: spacing.sm },
  summaryValue: { fontSize: 22, fontWeight: '900' },
  summaryLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  list: { padding: spacing.lg, paddingBottom: 40 },
  clientCard: {
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
  clientAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  clientAvatarText: { color: colors.gold, fontWeight: '800', fontSize: 14 },
  clientInfo: { flex: 1 },
  clientNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  clientName: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  goldTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.gold,
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  goldTagText: { fontSize: 8, fontWeight: '800', color: colors.black, letterSpacing: 0.5 },
  clientPhone: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  clientLastVisit: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  clientStats: { alignItems: 'flex-end' },
  clientVisits: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  clientSpend: { fontSize: 18, fontWeight: '800', color: colors.gold },
});
