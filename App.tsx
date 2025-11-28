import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const AFFIRMATIONS = [
  "I am worthy of love and all good things in life",
  "Every day I grow stronger and more confident",
  "I attract positivity and abundance naturally",
  "My potential is limitless, my future is bright",
  "I am enough exactly as I am in this moment",
  "Challenges help me grow into my best self",
  "I radiate confidence, peace, and positivity",
  "My mind is calm, my heart is open, my soul is radiant"
];

const CATEGORIES = ['Self-Love', 'Confidence', 'Abundance', 'Peace', 'Growth'];

export default function App() {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  const nextAffirmation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentAffirmation((prev) => (prev + 1) % AFFIRMATIONS.length);
      animateIn();
    });
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentAffirmation)) {
      setFavorites(favorites.filter(fav => fav !== currentAffirmation));
    } else {
      setFavorites([...favorites, currentAffirmation]);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  React.useEffect(() => {
    animateIn();
  }, []);

  const isFavorite = favorites.includes(currentAffirmation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Affirmation Card */}
        <Animated.View 
          style={[
            styles.affirmationCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {CATEGORIES[currentAffirmation % CATEGORIES.length]}
            </Text>
          </View>
          
          <Text style={styles.affirmationText}>
            "{AFFIRMATIONS[currentAffirmation]}"
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={toggleFavorite}
            >
              <View style={[
                styles.favoriteIcon,
                isFavorite && styles.favoriteIconActive
              ]}>
                <Text style={styles.iconText}>{isFavorite ? '♥' : '♡'}</Text>
              </View>
              <Text style={styles.buttonLabel}>
                {isFavorite ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconButton}
              onPress={nextAffirmation}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>↻</Text>
              </View>
              <Text style={styles.buttonLabel}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{AFFIRMATIONS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Favorites Preview */}
        {favorites.length > 0 && (
          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>Your Favorites</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favorites.slice(0, 3).map((favIndex, index) => (
                <View key={index} style={styles.favoritePreview}>
                  <Text style={styles.favoriteText} numberOfLines={2}>
                    {AFFIRMATIONS[favIndex]}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Daily Inspiration */}
        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationIcon}>✨</Text>
          <Text style={styles.inspirationText}>
            Your words shape your reality. Speak with intention.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  affirmationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  affirmationText: {
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 36,
    color: '#F1F5F9',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 24,
  },
  iconButton: {
    alignItems: 'center',
  },
  favoriteIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteIconActive: {
    backgroundColor: '#EF4444',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  favoritesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  favoritePreview: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: width * 0.6,
  },
  favoriteText: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  inspirationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 20,
    padding: 20,
  },
  inspirationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  inspirationText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 20,
  },
});