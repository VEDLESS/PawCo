import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { mobileApi } from '../lib/api';
import { Booking, ServiceRequest } from '@petco/shared';

export const HelperHomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.helperProfile?.isAvailable ?? true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [nearbyCount, setNearbyCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const [bookRes, reqRes] = await Promise.all([
      mobileApi.get<Booking[]>('/bookings'),
      mobileApi.get<ServiceRequest[]>('/requests/nearby'),
    ]);

    if (bookRes.success && bookRes.data) setBookings(bookRes.data);
    if (reqRes.success && reqRes.data) setNearbyCount(reqRes.data.length);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (val: boolean) => {
    setIsAvailable(val);
    await mobileApi.put('/helpers/profile', { isAvailable: val });
  };

  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const active = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const earnings = completed.reduce((sum, b) => sum + (b.agreedPrice || 0), 0);

  const ratingDisplay = user?.helperProfile?.totalReviews && user.helperProfile.totalReviews > 0
    ? `${user.helperProfile.rating.toFixed(1)} ★`
    : 'New';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
    >
      {/* Helper Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.badgeText}>🐾 Care Provider</Text>
            <Text style={styles.welcomeText}>Hi, {user?.name || 'Helper'}!</Text>
            <Text style={styles.subWelcomeText}>{user?.location || 'Neighborhood Helper'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Availability Switch */}
        <View style={styles.availabilityRow}>
          <Text style={styles.availabilityLabel}>
            {isAvailable ? '🟢 Accepting Jobs' : '⏸️ Currently Off-Duty'}
          </Text>
          <Switch
            value={isAvailable}
            onValueChange={handleToggle}
            trackColor={{ false: '#cbd5e1', true: '#5eead4' }}
            thumbColor={isAvailable ? '#0f766e' : '#94a3b8'}
          />
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Total Earnings</Text>
          <Text style={styles.metricValue}>${earnings.toFixed(2)}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Jobs Done</Text>
          <Text style={styles.metricValue}>{completed.length}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Rating</Text>
          <Text style={styles.metricValue}>{ratingDisplay}</Text>
        </View>
      </View>

      {/* Nearby Jobs CTA */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.jobsBanner}
          onPress={() => navigation.navigate('NearbyJobs')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.jobsBannerTitle}>Nearby Job Requests ({nearbyCount})</Text>
            <Text style={styles.jobsBannerSub}>Tap to view open pet care requests</Text>
          </View>
          <Text style={styles.jobsBannerArrow}>➔</Text>
        </TouchableOpacity>
      </View>

      {/* Active Jobs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Bookings ({active.length})</Text>
        {active.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyTitle}>No active bookings right now</Text>
            <Text style={styles.emptyText}>When a pet owner accepts your offer or books your care, active details appear here.</Text>
          </View>
        ) : (
          active.map((b) => (
            <View key={b.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>
                  {b.request?.serviceType?.replace('_', ' ')} for {b.request?.pet?.name}
                </Text>
                <Text style={styles.jobPrice}>${b.agreedPrice.toFixed(2)}</Text>
              </View>
              <Text style={styles.jobTime}>
                📅 {new Date(b.request?.scheduledDate || '').toLocaleDateString()} @ {b.request?.startTime}
              </Text>
              <Text style={styles.jobLocation}>📍 {b.request?.location}</Text>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('Chat', { bookingId: b.id })}
                activeOpacity={0.8}
              >
                <Text style={styles.chatButtonText}>💬 Message {b.owner?.name}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
    backgroundColor: '#0f766e',
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
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 18,
  },
  availabilityLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  metricsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  jobsBanner: {
    backgroundColor: '#0f766e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
  },
  jobsBannerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  jobsBannerSub: {
    color: '#ccfbf1',
    fontSize: 12,
    marginTop: 2,
  },
  jobsBannerArrow: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  jobPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f766e',
  },
  jobTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  jobLocation: {
    fontSize: 12,
    color: '#64748b',
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
    color: '#0f766e',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
