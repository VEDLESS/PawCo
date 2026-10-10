import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { mobileApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const NearbyJobsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchNearby = async () => {
    const res = await mobileApi.get<any[]>('/requests/nearby');
    if (res.success && res.data) setRequests(res.data);
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNearby();
  }, []);

  const handleAccept = async (req: any) => {
    if (!user) return;
    setAcceptingId(req.id);
    const res = await mobileApi.post('/bookings', {
      requestId: req.id,
      helperId: user.id,
      agreedPrice: req.budget,
    });
    setAcceptingId(null);

    if (res.success) {
      Alert.alert('Booking Confirmed', 'You have accepted this care request. You can now coordinate with the pet owner!', [
        { text: 'View Bookings', onPress: () => navigation.navigate('HelperHome') },
      ]);
    } else {
      Alert.alert('Unable to Accept', res.error || 'Failed to accept job. It may have already been booked.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNearby(); }} />}
    >
      <Text style={styles.header}>Nearby Pet Care Jobs</Text>
      <Text style={styles.subHeader}>Open requests within your active service radius</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0f766e" style={{ marginTop: 40 }} />
      ) : requests.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={styles.emptyTitle}>No nearby requests right now</Text>
          <Text style={styles.emptyText}>
            When pet parents in your neighborhood post care requests, they will show up here in real time.
          </Text>
        </View>
      ) : (
        requests.map((req) => (
          <View key={req.id} style={styles.card}>
            <View style={styles.topRow}>
              <Image
                source={{ uri: req.pet?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop' }}
                style={styles.petImage}
              />
              <View style={styles.info}>
                <Text style={styles.title}>{req.title}</Text>
                <Text style={styles.subtitle}>
                  {req.pet?.name} • {req.serviceType?.replace(/_/g, ' ')}
                </Text>
                <Text style={styles.owner}>Owner: {req.owner?.name}</Text>
              </View>
              <Text style={styles.price}>${req.budget}</Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.detailText}>
                📅 {new Date(req.scheduledDate).toLocaleDateString()} @ {req.startTime}
              </Text>
              <Text style={styles.detailText}>📍 {req.location}</Text>
              {req.distanceKm !== undefined && (
                <Text style={styles.distanceText}>🚗 {req.distanceKm.toFixed(1)} km away</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.acceptBtn, acceptingId === req.id && styles.acceptBtnDisabled]}
              onPress={() => handleAccept(req)}
              disabled={acceptingId === req.id}
              activeOpacity={0.85}
            >
              {acceptingId === req.id ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.acceptText}>✓ Accept Job (${req.budget})</Text>
              )}
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 16,
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#0f766e',
    fontWeight: '700',
    marginTop: 1,
  },
  owner: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f766e',
  },
  details: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f766e',
    marginTop: 4,
  },
  acceptBtn: {
    backgroundColor: '#0f766e',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptBtnDisabled: {
    opacity: 0.6,
  },
  acceptText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
