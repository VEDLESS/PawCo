import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Role } from '@petco/shared';

export const RegisterScreen = ({ navigation }: any) => {
  const [role, setRole] = useState<Role>(Role.OWNER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    const res = await register({
      name,
      email,
      password,
      phone: phone || undefined,
      role,
      location,
      latitude: 37.7749,
      longitude: -122.4194,
    });

    if (!res.success) {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Create PetCo Account</Text>
      <Text style={styles.subtitle}>Connect with neighborhood pet care</Text>

      {/* Role Toggle */}
      <View style={styles.roleToggle}>
        <TouchableOpacity
          style={[styles.roleBtn, role === Role.OWNER && styles.roleBtnActive]}
          onPress={() => setRole(Role.OWNER)}
        >
          <Text style={[styles.roleText, role === Role.OWNER && styles.roleTextActive]}>
            🐕 Pet Owner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === Role.HELPER && styles.roleBtnActive]}
          onPress={() => setRole(Role.HELPER)}
        >
          <Text style={[styles.roleText, role === Role.HELPER && styles.roleTextActive]}>
            🐾 Pet Helper
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Sarah Jenkins"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="sarah@example.com"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password (Min 6 chars) *</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (555) 000-0000"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Location / City *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mission District, San Francisco"
          placeholderTextColor="#94a3b8"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              Register as {role === Role.OWNER ? 'Pet Owner' : 'Pet Helper'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.footerLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.linkText}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    padding: 4,
    borderRadius: 14,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  roleTextActive: {
    color: '#0d9488',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#0d9488',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footerLink: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  linkText: {
    color: '#0d9488',
    fontWeight: '700',
  },
});
