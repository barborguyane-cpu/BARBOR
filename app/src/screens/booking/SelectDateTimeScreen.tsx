import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useBookingStore } from '../../store/bookingStore';
import { TIME_SLOTS } from '../../services/mockData';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GoldButton } from '../../components/common/GoldButton';

const DAYS_AHEAD = 14;

const generateDates = () => {
  return Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
};

const UNAVAILABLE_SLOTS = ['10:00', '11:00', '14:30'];

export const SelectDateTimeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { draft, setDraftDate, setDraftTime } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dates = generateDates();

  const selectDate = (d: Date) => {
    setSelectedDate(d);
    setDraftDate(d.toISOString().split('T')[0]);
    setDraftTime('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Date & Heure"
        subtitle="Choisissez votre créneau"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Date picker */}
        <Text style={styles.sectionLabel}>Choisissez une date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
          {dates.map((d, i) => {
            const isSelected = selectedDate?.toDateString() === d.toDateString();
            const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3).toUpperCase();
            const dayNum = d.getDate();
            const month = d.toLocaleDateString('fr-FR', { month: 'short' }).slice(0, 3).toUpperCase();
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => selectDate(d)}
              >
                <Text style={[styles.dateDayName, isSelected && styles.dateTextActive]}>{dayName}</Text>
                <Text style={[styles.dateDayNum, isSelected && styles.dateNumActive]}>{dayNum}</Text>
                <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>{month}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time slots */}
        {selectedDate && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Créneaux disponibles</Text>
            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot) => {
                const isUnavailable = UNAVAILABLE_SLOTS.includes(slot);
                const isSelected = draft.time === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotBtn,
                      isSelected && styles.slotSelected,
                      isUnavailable && styles.slotUnavailable,
                    ]}
                    onPress={() => !isUnavailable && setDraftTime(slot)}
                    disabled={isUnavailable}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.slotTextSelected,
                        isUnavailable && styles.slotTextUnavailable,
                      ]}
                    >
                      {slot}
                    </Text>
                    {isUnavailable && <Text style={styles.slotBusy}>Occupé</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {draft.date && draft.time && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerDate}>
              {new Date(draft.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <Text style={styles.footerTime}>{draft.time}</Text>
          </View>
          <GoldButton
            title="Confirmer"
            onPress={() => navigation.navigate('BookingConfirm')}
            size="md"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  sectionLabel: { ...typography.labelMedium, color: colors.textSecondary, marginBottom: spacing.md },

  // Date
  datesScroll: { marginLeft: -spacing.lg, paddingLeft: spacing.lg },
  dateCard: {
    width: 60,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 2,
  },
  dateCardSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  dateDayName: { fontSize: 10, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.5 },
  dateDayNum: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  dateMonth: { fontSize: 10, fontWeight: '600', color: colors.textMuted },
  dateTextActive: { color: colors.black },
  dateNumActive: { color: colors.black },

  // Time slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slotBtn: {
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  slotSelected: { backgroundColor: 'rgba(212,175,55,0.15)', borderColor: colors.gold },
  slotUnavailable: { backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)', opacity: 0.6 },
  slotText: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  slotTextSelected: { color: colors.gold },
  slotTextUnavailable: { color: colors.textMuted },
  slotBusy: { fontSize: 9, color: colors.error, marginTop: 2 },

  // Footer
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
  footerDate: { color: colors.textSecondary, fontSize: 13, textTransform: 'capitalize' },
  footerTime: { color: colors.gold, fontWeight: '800', fontSize: 20 },
});
