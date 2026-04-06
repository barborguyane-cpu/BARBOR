import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { GoldButton } from '../../components/common/GoldButton';
import { BarbOrLogo } from '../../components/common/BarbOrLogo';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      await login(email, password);
    } catch {
      Alert.alert('Erreur', 'Identifiants incorrects.');
    }
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B2A']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <BarbOrLogo size={100} variant="gold" />
            <Text style={styles.brand}>BARB'OR</Text>
            <Text style={styles.sub}>GUYANE</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.hint}>Accédez à votre espace premium</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.gold} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={colors.gold}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.gold} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Mot de passe"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                selectionColor={colors.gold}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <GoldButton
              title="Se connecter"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              style={{ marginTop: spacing.md }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <GoldButton
              title="Créer un compte"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg },
  logoArea: { alignItems: 'center', marginBottom: spacing.xl, gap: spacing.xs },
  brand: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.gold,
    letterSpacing: 6,
    marginTop: spacing.sm,
  },
  sub: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 8,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  hint: { ...typography.bodyMedium, color: colors.textMuted, marginBottom: spacing.xl },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 52,
  },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  forgotText: { color: colors.gold, fontSize: 13 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 13 },
});
