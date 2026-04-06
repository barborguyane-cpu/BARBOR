import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { GoldButton } from '../../components/common/GoldButton';

export const DriverConfirmScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B2A']} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <LinearGradient colors={['#F0D060', '#D4AF37', '#A08828']} style={styles.iconGrad}>
            <Ionicons name="car" size={48} color={colors.black} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity, alignItems: 'center', gap: spacing.md }}>
          <Text style={styles.title}>BARB'DRIVER confirmé !</Text>
          <Text style={styles.subtitle}>
            Votre demande a été envoyée.{'\n'}Un barber va se déplacer chez vous.
          </Text>

          <View style={styles.etaCard}>
            <View style={styles.etaItem}>
              <Ionicons name="time-outline" size={24} color={colors.gold} />
              <Text style={styles.etaValue}>~35 min</Text>
              <Text style={styles.etaLabel}>Temps d'arrivée estimé</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Ionicons name="person-outline" size={24} color={colors.gold} />
              <Text style={styles.etaValue}>Marcus D.</Text>
              <Text style={styles.etaLabel}>Votre barber</Text>
            </View>
          </View>

          <View style={styles.stepsCard}>
            {[
              { icon: 'checkmark-circle', color: colors.success, text: 'Demande reçue' },
              { icon: 'checkmark-circle', color: colors.success, text: 'Acompte confirmé' },
              { icon: 'ellipse-outline', color: colors.gold, text: 'Barber en route...' },
              { icon: 'ellipse-outline', color: colors.textMuted, text: 'Arrivée chez vous' },
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Ionicons name={step.icon as any} size={18} color={step.color} />
                <Text style={[styles.stepText, { color: step.color }]}>{step.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <GoldButton title="Retour à l'accueil" onPress={() => navigation.navigate('Home')} size="lg" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  iconCircle: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden' },
  iconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: colors.textPrimary, letterSpacing: 1, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  etaCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderGold,
    width: '100%',
    alignItems: 'center',
  },
  etaItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  etaValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  etaLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  etaDivider: { width: 1, height: 50, backgroundColor: colors.border, marginHorizontal: spacing.md },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepText: { fontSize: 14, fontWeight: '600' },
  footer: { padding: spacing.lg },
});
