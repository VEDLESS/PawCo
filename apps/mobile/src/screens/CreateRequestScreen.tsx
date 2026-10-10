import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { mobileApi } from '../lib/api';
import { Pet, ServiceType } from '@petco/shared';

export const CreateRequestScreen = ({ navigation }: any) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.DOG_WALKING);
  const [title, setTitle] = useState('Dog Walking & Fetch');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('14:00');
  const [location, setLocation] = useState('Dolores Park, San Francisco');
  const [budget, setBudget] = useState('35');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      const res = await mobileApi.get<Pet[]>('/pets');
      if (res.success && res.data && res.data.length > 0) {
        setPets(res.data);
        setSelectedPetId(res.data[0].id);
      }
    };
    loadPets();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    setIsLoading(true);
    const res = await mobileApi.post('/requests', {
      petId: selectedPetId,
      serviceType,
      title,
      description: description || 'Pet care request via mobile app.',
      location,
      latitude: 37.7596,
      longitude: -122.4269,
      scheduledDate,
      startTime,
      budget: parseFloat(budget),
    });
    setIsLoading(false);

    if (res.success) {
      Alert.alert('Success', 'Service request posted to nearby helpers!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', res.error || 'Failed to post request');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Request Pet Care</Text>

      {/* Select Pet */}
      <Text style={styles.label}>Select Pet</Text>
      <View style={styles.petSelector}>
        {pets.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.petOption, selectedPetId === p.id && styles.petOptionSelected]}
            onPress={() => setSelectedPetId(p.id)}
          >
            <Text style={[styles.petText, selectedPetId === p.id && styles.petTextSelected]}>
              🐾 {p.name} ({p.species})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Service Selection */}
      <Text style={styles.label}>Service Type</Text>
      <View style={styles.serviceGrid}>
        {[
          { type: ServiceType.DOG_WALKING, label: 'Walking' },
          { type: ServiceType.PET_SITTING, label: 'Sitting' },
          { type: ServiceType.FEEDING, label: 'Feeding' },
          { type: ServiceType.MEDICINE_ADMINISTRATION, label: 'Medication' },
          { type: ServiceType.PET_BOARDING, label: 'Boarding' },
          { type: ServiceType.GROOMING, label: 'Grooming' },
        ].map((s) => (
          <TouchableOpacity
            key={s.type}
            style={[styles.serviceBtn, serviceType === s.type && styles.serviceBtnActive]}
            onPress={() => setServiceType(s.type)}
          >
            <Text style={[styles.serviceText, serviceType === s.type && styles.serviceTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs */}
      <Text style={styles.label}>Request Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={scheduledDate} onChangeText={setScheduledDate} />

      <Text style={styles.label}>Start Time (HH:mm)</Text>
      <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} />

      <Text style={styles.label}>Location / Address</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Budget ($ USD)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={budget} onChangeText={setBudget} />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={3}
        placeholder="Specific instructions for the helper..."
        placeholderTextColor="#94a3b8"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitText}>Submit Request to Helpers</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 14,
  },
  petSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  petOption: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  petOptionSelected: {
    borderColor: '#0d9488',
    backgroundColor: '#ccfbf1',
  },
  petText: {
    fontSize: 13,
    color: '#334155',
  },
  petTextSelected: {
    color: '#0d9488',
    fontWeight: '700',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceBtn: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  serviceBtnActive: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  serviceTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#0d9488',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
