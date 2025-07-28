import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const SafetyRatingTab = ({ country }) => {
  // Mock safety ratings data
  const safetyRatings = {
    'Canada': {
      rating: 'Safe',
      color: '#008000',
      description: 'Generally safe for LGBTQIA+ travelers with strong legal protections and inclusive communities.',
      details: [
        'Same-sex marriage legal since 2005',
        'Anti-discrimination laws in place',
        'Major cities have vibrant LGBTQIA+ communities',
        'High level of social acceptance'
      ]
    },
    'Uganda': {
      rating: 'Dangerous',
      color: '#CC0000',
      description: 'Extremely dangerous for LGBTQIA+ travelers due to harsh anti-LGBTQIA+ laws and social stigma.',
      details: [
        'Same-sex relationships criminalized',
        'Severe penalties including life imprisonment',
        'High risk of violence and discrimination',
        'Avoid travel if possible'
      ]
    },
    'Brazil': {
      rating: 'Varies By Location',
      color: '#FFFF00',
      description: 'Safety varies significantly by region - major cities are generally safer than rural areas.',
      details: [
        'Legal protections exist but enforcement varies',
        'Major cities like São Paulo and Rio are relatively safe',
        'Rural areas may be more conservative',
        'Exercise caution and research specific destinations'
      ]
    },
    'Russia': {
      rating: 'Avoid',
      color: '#FFA500',
      description: 'Significant risks for LGBTQIA+ travelers due to restrictive laws and social hostility.',
      details: [
        'Anti-LGBTQIA+ propaganda laws in effect',
        'High risk of harassment and violence',
        'Limited legal protections',
        'Consider alternative destinations'
      ]
    },
    'Australia': {
      rating: 'Safe',
      color: '#008000',
      description: 'Very safe for LGBTQIA+ travelers with comprehensive legal protections and inclusive society.',
      details: [
        'Same-sex marriage legal since 2017',
        'Strong anti-discrimination laws',
        'Major cities have active LGBTQIA+ communities',
        'High level of social acceptance'
      ]
    },
    'Japan': {
      rating: 'Safe',
      color: '#008000',
      description: 'Generally safe for LGBTQIA+ travelers, though social acceptance varies by region.',
      details: [
        'No criminalization of same-sex relationships',
        'Growing acceptance in major cities',
        'Some legal protections in place',
        'More conservative in rural areas'
      ]
    },
    'Germany': {
      rating: 'Safe',
      color: '#008000',
      description: 'Very safe for LGBTQIA+ travelers with strong legal protections and progressive society.',
      details: [
        'Same-sex marriage legal since 2017',
        'Comprehensive anti-discrimination laws',
        'Major cities have vibrant LGBTQIA+ scenes',
        'High level of social acceptance'
      ]
    },
    'South Africa': {
      rating: 'Varies By Location',
      color: '#FFFF00',
      description: 'Safety varies by location - urban areas are generally safer than rural regions.',
      details: [
        'Constitutional protections for LGBTQIA+ rights',
        'Major cities like Cape Town are relatively safe',
        'Rural areas may be more conservative',
        'Exercise caution and research specific areas'
      ]
    }
  };

  const countryData = safetyRatings[country.name] || {
    rating: 'Unknown',
    color: '#999999',
    description: 'Safety information not available for this country.',
    details: ['Please research current conditions before traveling.']
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Safety Rating Display */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Safety Rating</Text>
        <View style={[styles.ratingBadge, { borderColor: countryData.color }]}>
          <Text style={[styles.ratingText, { color: countryData.color }]}>
            {countryData.rating}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{countryData.description}</Text>
      </View>

      {/* Details List */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Key Points:</Text>
        {countryData.details.map((detail, index) => (
          <View key={index} style={styles.detailItem}>
            <View style={[styles.bulletPoint, { backgroundColor: countryData.color }]} />
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          ⚠️ This information is for general guidance only. Conditions can change rapidly. Always research current local laws and social attitudes before traveling.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    fontWeight: '500',
  },
  ratingBadge: {
    borderWidth: 3,
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 25,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  disclaimerContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default SafetyRatingTab; 