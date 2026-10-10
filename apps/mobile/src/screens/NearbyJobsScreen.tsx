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
} from 'react-native';
import { mobileApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const NearbyJobsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchNearby = async () => {
    setIsLoading(true);
    const res = await mobileApi.get<any[]>('/requests/nearby');
    if (res.success && res.data) setRequests(res.data);
    setIsLoading(false);
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
      Alert.alert('Success', 'Booking confirmed!', [
        { text: 'OK', onPress: () => navigation.navigate('HelperHome') },
      ]);
    } else {
      Alert.alert('Error', res.error || 'Failed to accept job');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Nearby Pet Care Jobs</Text>
      <Text style={styles.subHeader}>Within your service radius</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0d9488" style={{ marginTop: 40 }} />
      ) : requests.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No open jobs in your area right now</Text>
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
                  {req.pet?.name} ({req.serviceType?.replace('_', ' ')})
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
                <Text style={styles.distanceText}>📍 {req.distanceKm} km away</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => handleAccept(req)}
              disabled={acceptingId === req.id}
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
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subHeader: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petImage: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#0d9488',
    fontWeight: '600',
  },
  owner: {
    fontSize: 11,
    color: '#64748b',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0d9488',
  },
  details: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    marginVertical: 10,
  },
  detailText: {
    fontSize: 11,
    color: '#475569',
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d9488',
    marginTop: 2,
  },
  acceptBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
