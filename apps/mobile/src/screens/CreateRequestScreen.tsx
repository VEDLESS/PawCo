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
  const [title, setTitle] = useState('Dog Walking & Exercise');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('14:00');
  const [location, setLocation] = useState('Mission District, San Francisco');
  const [budget, setBudget] = useState('35');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPets, setIsFetchingPets] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      setIsFetchingPets(true);
      const res = await mobileApi.get<Pet[]>('/pets');
      if (res.success && res.data && res.data.length > 0) {
        setPets(res.data);
        setSelectedPetId(res.data[0].id);
      }
      setIsFetchingPets(false);
    };
    loadPets();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPetId) {
      Alert.alert('Companion Required', 'Please select a registered pet before creating a request.');
      return;
    }
    if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }

    setIsLoading(true);
    const res = await mobileApi.post('/requests', {
      petId: selectedPetId,
      serviceType,
      title: title.trim(),
      description: description.trim() || 'Neighborhood pet care request via PawCo.',
      location: location.trim(),
      latitude: 37.7596,
      longitude: -122.4269,
      scheduledDate,
      startTime,
      budget: parseFloat(budget),
    });
    setIsLoading(false);

    if (res.success) {
      Alert.alert('Care Request Posted', 'Your request has been broadcasted to verified local helpers!', [
        { text: 'View Requests', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Submission Error', res.error || 'Failed to post request. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Request Pet Care</Text>

      {/* Select Pet */}
      <Text style={styles.label}>Select Companion</Text>
      {isFetchingPets ? (
        <ActivityIndicator color="#0f766e" style={{ marginVertical: 12 }} />
      ) : pets.length === 0 ? (
        <View style={styles.emptyNotice}>
          <Text style={styles.emptyNoticeText}>
            No pets registered yet. Please add a pet profile first before submitting a request.
          </Text>
        </View>
      ) : (
        <View style={styles.petSelector}>
          {pets.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.petOption, selectedPetId === p.id && styles.petOptionSelected]}
              onPress={() => setSelectedPetId(p.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.petText, selectedPetId === p.id && styles.petTextSelected]}>
                🐾 {p.name} ({p.species})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
            activeOpacity={0.8}
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

      <Text style={styles.label}>Instructions & Care Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={3}
        placeholder="Specific instructions, allergies, feeding routine, etc."
        placeholderTextColor="#94a3b8"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[styles.submitBtn, (isLoading || pets.length === 0) && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={isLoading || pets.length === 0}
        activeOpacity={0.85}
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
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 14,
  },
  emptyNotice: {
    padding: 14,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  emptyNoticeText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
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
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  petOptionSelected: {
    borderColor: '#0f766e',
    backgroundColor: '#ccfbf1',
  },
  petText: {
    fontSize: 13,
    color: '#334155',
  },
  petTextSelected: {
    color: '#0f766e',
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
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
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
    backgroundColor: '#0f766e',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
