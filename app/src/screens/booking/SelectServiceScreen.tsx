import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useBookingStore } from '../../store/bookingStore';
import { SERVICES } from '../../services/mockData';
import { Service } from '../../services/types';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

export const SelectServiceScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { draft, setDraftService } = useBookingStore();

  const categories = [
    { key: 'coupe', label: 'Coupe', icon: 'cut-outline' },
    { key: 'pack', label: 'Packs', icon: 'layers-outline' },
    { key: 'barbe', label: 'Barbe', icon: 'man-outline' },
    { key: 'soin', label: 'Soins', icon: 'leaf-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Prestation"
        subtitle="Choisissez votre service"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {categories.map((cat) => {
          const catServices = SERVICES.filter((s) => s.category === cat.key);
          if (!catServices.length) return null;
          return (
            <View key={cat.key} style={styles.categorySection}>
              <View style={styles.catHeader}>
                <Ionicons name={cat.icon as any} size={16} color={colors.gold} />
                <Text style={styles.catTitle}>{cat.label}</Text>
              </View>
              {catServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    draft.service?.id === service.id && styles.serviceCardSelected,
                  ]}
                  onPress={() => setDraftService(service)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={draft.service?.id === service.id ? ['#1A2D1A', '#0D1B2A'] : ['#141E2B', '#0D1B2A']}
                    style={styles.serviceGradient}
                  >
                    <View style={styles.serviceLeft}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceDesc}>{service.description}</Text>
                      <View style={styles.serviceMeta}>
                        <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                        <Text style={styles.serviceMetaText}>{service.duration} min</Text>
                      </View>
                    </View>
                    <View style={styles.serviceRight}>
                      <Text style={styles.servicePrice}>{service.price}€</Text>
                      <Text style={styles.serviceDeposit}>Acompte : {Math.round(service.price * 0.3)}€</Text>
                      {draft.service?.id === service.id && (
                        <View style={styles.serviceCheck}>
                          <Ionicons name="checkmark-circle" size={22} color={colors.gold} />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {draft.service && (
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerService}>{draft.service.name}</Text>
            <Text style={styles.footerPrice}>{draft.service.price}€</Text>
          </View>
          <GoldButton
            title="Continuer"
            onPress={() => navigation.navigate('SelectDateTime')}
            size="md"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  categorySection: { marginBottom: spacing.xl },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGold,
  },
  catTitle: { ...typography.labelLarge, color: colors.gold },
  serviceCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  serviceCardSelected: { borderColor: colors.gold },
  serviceGradient: { flexDirection: 'row', padding: spacing.md, gap: spacing.md },
  serviceLeft: { flex: 1 },
  serviceName: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  serviceDesc: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginBottom: spacing.xs },
  serviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceMetaText: { color: colors.textMuted, fontSize: 12 },
  serviceRight: { alignItems: 'flex-end', gap: 4 },
  servicePrice: { fontSize: 22, fontWeight: '800', color: colors.gold },
  serviceDeposit: { fontSize: 11, color: colors.textMuted },
  serviceCheck: { marginTop: spacing.sm },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {},
  footerService: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  footerPrice: { color: colors.gold, fontWeight: '800', fontSize: 18 },
});
