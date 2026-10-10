import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { mobileApi } from '../lib/api';
import { Pet, Booking } from '@petco/shared';

export const OwnerHomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const [petsRes, bookRes] = await Promise.all([
      mobileApi.get<Pet[]>('/pets'),
      mobileApi.get<Booking[]>('/bookings'),
    ]);

    if (petsRes.success && petsRes.data) setPets(petsRes.data);
    if (bookRes.success && bookRes.data) setBookings(bookRes.data);
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
    >
      {/* Top Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.badgeText}>🐾 Pet Parent</Text>
            <Text style={styles.welcomeText}>Hi, {user?.name}!</Text>
            <Text style={styles.subWelcomeText}>{pets.length} pets registered</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Request Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('CreateRequest')}
        >
          <Text style={styles.ctaButtonText}>+ Request Pet Care</Text>
        </TouchableOpacity>
      </View>

      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Bookings</Text>
          {activeBookings.map((b) => (
            <View key={b.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingService}>
                  {b.request?.serviceType?.replace('_', ' ')} for {b.request?.pet?.name}
                </Text>
                <Text style={styles.bookingStatus}>{b.status}</Text>
              </View>
              <Text style={styles.bookingTime}>
                📅 {new Date(b.request?.scheduledDate || '').toLocaleDateString()} @ {b.request?.startTime}
              </Text>
              <Text style={styles.bookingHelper}>Helper: {b.helper?.name}</Text>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('Chat', { bookingId: b.id })}
              >
                <Text style={styles.chatButtonText}>💬 Message Helper</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Pets List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Pets ({pets.length})</Text>
        {pets.map((p) => (
          <View key={p.id} style={styles.petCard}>
            <Image
              source={{ uri: p.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop' }}
              style={styles.petImage}
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{p.name}</Text>
              <Text style={styles.petBreed}>{p.breed || p.species} • {p.age || 2} yrs</Text>
              {p.medicalNotes ? (
                <Text style={styles.petNotes} numberOfLines={1}>⚠️ {p.medicalNotes}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerCard: {
    backgroundColor: '#0d9488',
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#99f6e4',
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  subWelcomeText: {
    fontSize: 12,
    color: '#ccfbf1',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  ctaButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  ctaButtonText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingService: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  bookingStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d9488',
    backgroundColor: '#ccfbf1',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  bookingTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  bookingHelper: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  chatButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d9488',
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginBottom: 10,
  },
  petImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#cbd5e1',
  },
  petInfo: {
    marginLeft: 14,
    flex: 1,
  },
  petName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  petBreed: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  petNotes: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
  },
});
