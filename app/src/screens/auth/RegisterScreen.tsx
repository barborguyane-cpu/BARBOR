import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { GoldButton } from '../../components/common/GoldButton';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const update = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.firstName || !form.email || !form.password || !form.phone) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      await register(form);
    } catch {
      Alert.alert('Erreur', "Impossible de créer le compte.");
    }
  };

  const fields: Array<{
    key: keyof typeof form;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    keyboardType?: any;
    secure?: boolean;
  }> = [
    { key: 'firstName', label: 'Prénom', icon: 'person-outline' },
    { key: 'lastName', label: 'Nom', icon: 'person-outline' },
    { key: 'phone', label: 'Téléphone', icon: 'call-outline', keyboardType: 'phone-pad' },
    { key: 'email', label: 'Email', icon: 'mail-outline', keyboardType: 'email-address' },
    { key: 'password', label: 'Mot de passe', icon: 'lock-closed-outline', secure: true },
  ];

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B2A']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.gold} />
          </TouchableOpacity>

          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez le club BARB'OR premium</Text>

          <View style={styles.form}>
            {fields.map((f) => (
              <View key={f.key} style={styles.inputWrap}>
                <Ionicons name={f.icon} size={18} color={colors.gold} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={f.label}
                  placeholderTextColor={colors.textMuted}
                  value={form[f.key]}
                  onChangeText={update(f.key)}
                  keyboardType={f.keyboardType || 'default'}
                  secureTextEntry={f.secure}
                  autoCapitalize={f.key === 'email' || f.key === 'password' ? 'none' : 'words'}
                  selectionColor={colors.gold}
                />
              </View>
            ))}

            <GoldButton
              title="Créer mon compte"
              onPress={handleRegister}
              loading={isLoading}
              size="lg"
              style={{ marginTop: spacing.md }}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
              <Text style={styles.loginText}>
                Déjà membre ?{' '}
                <Text style={{ color: colors.gold }}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
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
  backBtn: { marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.bodyMedium, color: colors.textMuted, marginBottom: spacing.xl },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderGold,
    gap: spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  loginLink: { alignItems: 'center', marginTop: spacing.md },
  loginText: { color: colors.textSecondary, fontSize: 14 },
});
