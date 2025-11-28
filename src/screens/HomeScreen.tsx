import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Affirmation } from '../types';
import { storage } from '../utils/storage';
import { AFFIRMATIONS } from '../constants/affirmations';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [dailyAffirmation, setDailyAffirmation] = useState<Affirmation | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDailyAffirmation();
    loadFavorites();
  }, []);

  const loadDailyAffirmation = () => {
    // For now, get random affirmation. Later we'll make it daily
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    const affirmation = {
      ...AFFIRMATIONS[randomIndex],
      isFavorite: false,
      createdAt: new Date()
    };
    setDailyAffirmation(affirmation);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const loadFavorites = async () => {
    const savedFavorites = await storage.getFavorites();
    setFavorites(savedFavorites);
  };

  const toggleFavorite = async () => {
    if (!dailyAffirmation) return;

    let newFavorites: string[];
    const isCurrentlyFavorite = favorites.includes(dailyAffirmation.id);

    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter(id => id !== dailyAffirmation.id);
    } else {
      newFavorites = [...favorites, dailyAffirmation.id];
      
      // Heart beat animation when adding to favorites
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    setFavorites(newFavorites);
    await storage.saveFavorites(newFavorites);
    
    // Update daily affirmation favorite status
    setDailyAffirmation({
      ...dailyAffirmation,
      isFavorite: !isCurrentlyFavorite
    });
  };

  const shareAffirmation = async () => {
    if (!dailyAffirmation) return;

    try {
      await Share.share({
        message: `🌟 Daily Affirmation: ${dailyAffirmation.text}\n\nShared from Daily Affirmations App`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share affirmation');
    }
  };

  const refreshAffirmation = () => {
    // Scale out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      loadDailyAffirmation();
    });
  };

  if (!dailyAffirmation) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(dailyAffirmation.id);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Daily Affirmation Card */}
      <Animated.View 
        style={[
          styles.affirmationCard,
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {dailyAffirmation.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.dailyLabel}>DAILY AFFIRMATION</Text>
        </View>

        <Text style={styles.affirmationText}>
          "{dailyAffirmation.text}"
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleFavorite}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={28} 
                color={isFavorite ? "#FF6B6B" : "#666"} 
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={shareAffirmation}
          >
            <Ionicons name="share-social-outline" size={28} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={refreshAffirmation}
          >
            <Ionicons name="refresh-outline" size={28} color="#666" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{AFFIRMATIONS.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Favorites')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B' }]}>
            <Ionicons name="heart" size={24} color="#fff" />
          </View>
          <Text style={styles.actionTitle}>Favorites</Text>
          <Text style={styles.actionSubtitle}>View your saved affirmations</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#8B78E6' }]}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.actionTitle}>Settings</Text>
          <Text style={styles.actionSubtitle}>Customize your experience</Text>
        </TouchableOpacity>
      </View>

      {/* Inspiration Quote */}
      <View style={styles.inspirationCard}>
        <Ionicons name="sparkles" size={20} color="#8B78E6" />
        <Text style={styles.inspirationText}>
          Your words have power. Speak kindly to yourself.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#666',
    fontWeight: '300',
  },
  affirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryTag: {
    backgroundColor: '#E8EAF2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B78E6',
  },
  dailyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  affirmationText: {
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 32,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 25,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  iconButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B78E6',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  inspirationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EDFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  inspirationText: {
    fontSize: 14,
    color: '#8B78E6',
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
});