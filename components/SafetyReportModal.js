/**
 * SafetyReportModal Component
 * 
 * Anonymous safety reporting modal that allows users to submit
 * real-time safety reports from their current location.
 * 
 * Features:
 * - Automatic location capture
 * - Visual safety score selector (1-5)
 * - Tag selection chips
 * - Optional comment input (280 chars max)
 * - Completely anonymous (no user tracking)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { submitSafetyReport, getReportTags } from '../services/api';

const SafetyReportModal = ({ visible, onClose }) => {
  const [safetyScore, setSafetyScore] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Safety score options with visual indicators
  const safetyScores = [
    { value: 1, label: 'Very Unsafe', emoji: '🔴', color: '#F44336' },
    { value: 2, label: 'Unsafe', emoji: '🟠', color: '#FF9800' },
    { value: 3, label: 'Neutral', emoji: '🟡', color: '#FFC107' },
    { value: 4, label: 'Safe', emoji: '🟢', color: '#4CAF50' },
    { value: 5, label: 'Very Safe', emoji: '✅', color: '#8BC34A' },
  ];

  // Load available tags from backend
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await getReportTags();
        if (response.success) {
          setAvailableTags(response.tags || []);
        }
      } catch (error) {
        console.error('Error loading tags:', error);
        // Fallback to default tags if API fails
        setAvailableTags([
          'Harassment',
          'Welcoming',
          'Police Presence',
          'Protest',
          'Crowded',
          'Quiet',
          'Other'
        ]);
      }
    };
    
    if (visible) {
      loadTags();
    }
  }, [visible]);

  // Get user's current location when modal opens
  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    } else {
      // Reset form when modal closes
      resetForm();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'We need your location to submit an anonymous safety report. Please enable location permissions in your device settings.',
          [{ text: 'OK' }]
        );
        setLocationLoading(false);
        return;
      }

      // Get current location
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const resetForm = () => {
    setSafetyScore(null);
    setSelectedTags([]);
    setComment('');
    setLocation(null);
    setLoading(false);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!safetyScore) {
      Alert.alert('Required', 'Please select a safety score.');
      return;
    }

    if (!location) {
      Alert.alert('Location Required', 'Unable to get your location. Please try again.');
      return;
    }

    if (comment.length > 280) {
      Alert.alert('Comment Too Long', 'Comment must be 280 characters or less.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSafetyReport(
        location.latitude,
        location.longitude,
        safetyScore,
        selectedTags,
        comment.trim()
      );

      // Success
      Alert.alert(
        'Report Submitted',
        'Your anonymous safety report has been submitted. Stay safe!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Handle rate limit error specifically (HTTP 429)
      if (error.status === 429 || (error.data && error.data.error === 'Too Many Reports')) {
        Alert.alert(
          'Too Many Reports',
          error.data?.message || 'You have submitted too many reports recently. Please try again later.',
          [{ text: 'OK' }]
        );
      } else if (error.message && error.message.includes('rate limit')) {
        Alert.alert(
          'Rate Limit Exceeded',
          'You have submitted too many reports recently. Please try again later.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Submission Error',
          error.message || 'Unable to submit your report. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Safety</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Location Status */}
            {locationLoading ? (
              <View style={styles.locationStatus}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.locationStatusText}>Getting your location...</Text>
              </View>
            ) : location ? (
              <View style={styles.locationStatus}>
                <Text style={styles.locationStatusText}>📍 Location captured</Text>
              </View>
            ) : (
              <View style={styles.locationStatus}>
                <Text style={styles.locationErrorText}>⚠️ Location unavailable</Text>
              </View>
            )}

            {/* Safety Score Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How safe do you feel? *</Text>
              <View style={styles.scoreContainer}>
                {safetyScores.map((score) => (
                  <TouchableOpacity
                    key={score.value}
                    style={[
                      styles.scoreButton,
                      safetyScore === score.value && styles.scoreButtonSelected,
                      { borderColor: score.color }
                    ]}
                    onPress={() => setSafetyScore(score.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.scoreEmoji}>{score.emoji}</Text>
                    <Text style={[
                      styles.scoreLabel,
                      safetyScore === score.value && styles.scoreLabelSelected
                    ]}>
                      {score.value}
                    </Text>
                    <Text style={styles.scoreDescription}>{score.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's happening? (Optional)</Text>
              <View style={styles.tagsContainer}>
                {availableTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      selectedTags.includes(tag) && styles.tagChipSelected
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional details (Optional)</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Describe the situation (max 280 characters)"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={280}
                value={comment}
                onChangeText={setComment}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {comment.length}/280 characters
              </Text>
            </View>

            {/* Privacy Notice */}
            <View style={styles.privacyNotice}>
              <Text style={styles.privacyText}>
                🔒 Your report is completely anonymous. No personal information is collected or stored.
              </Text>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!safetyScore || !location || submitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!safetyScore || !location || submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Anonymous Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  locationStatusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  locationErrorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  scoreButton: {
    width: '18%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  scoreButtonSelected: {
    backgroundColor: '#f0f8ff',
    borderWidth: 3,
  },
  scoreEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  scoreLabelSelected: {
    color: '#007AFF',
  },
  scoreDescription: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#fff',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  privacyNotice: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SafetyReportModal;
