import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { BarbOrLogo } from '../../components/common/BarbOrLogo';

const { width, height } = Dimensions.get('window');

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'> };

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(lineWidth, { toValue: 140, duration: 400, useNativeDriver: false }),
      Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Login'), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B2A', '#0A0A0A']} style={styles.container}>
      {/* Gold particles decoration */}
      <View style={styles.topDecor} />
      <View style={styles.bottomDecor} />

      <View style={styles.center}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <BarbOrLogo size={160} variant="gold" />
        </Animated.View>

        <Animated.View style={[styles.line, { width: lineWidth }]} />

        <Animated.View style={{ opacity: titleOpacity, alignItems: 'center' }}>
          <Text style={styles.brand}>BARB'OR</Text>
          <Text style={styles.location}>GUYANE</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
          L'EXCELLENCE AU SERVICE DE VOTRE STYLE
        </Animated.Text>
      </View>

      <Animated.Text style={[styles.footer, { opacity: subtitleOpacity }]}>
        ✦ PREMIUM BARBERSHOP ✦
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDecor: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  bottomDecor: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212,175,55,0.04)',
  },
  center: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  line: {
    height: 1.5,
    backgroundColor: colors.gold,
    marginVertical: spacing.sm,
  },
  brand: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.gold,
    letterSpacing: 8,
  },
  location: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 10,
    marginTop: -4,
  },
  tagline: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 4,
  },
});
