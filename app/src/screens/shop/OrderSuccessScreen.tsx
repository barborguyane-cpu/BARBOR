import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { GoldButton } from '../../components/common/GoldButton';

export const OrderSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }).start();
  }, []);

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B2A']} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <LinearGradient colors={['#F0D060', '#D4AF37', '#A08828']} style={styles.iconGrad}>
            <Ionicons name="bag-check-outline" size={48} color={colors.black} />
          </LinearGradient>
        </Animated.View>
        <Text style={styles.title}>Commande passée !</Text>
        <Text style={styles.subtitle}>
          Votre commande a été enregistrée.{'\n'}Vous recevrez une confirmation par email.
        </Text>
        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={20} color={colors.gold} />
          <Text style={styles.infoText}>Livraison estimée : 3-5 jours ouvrés</Text>
        </View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <GoldButton title="Retour à l'accueil" onPress={() => navigation.navigate('Home')} size="lg" style={{ marginBottom: spacing.md }} />
        <GoldButton title="Voir mes commandes" onPress={() => navigation.navigate('Profile')} variant="outline" size="lg" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  iconCircle: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden' },
  iconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, letterSpacing: 1 },
  subtitle: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderGold,
    width: '100%',
  },
  infoText: { color: colors.textPrimary, fontSize: 14, flex: 1 },
  footer: { padding: spacing.lg },
});
