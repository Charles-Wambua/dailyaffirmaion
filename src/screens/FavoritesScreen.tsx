import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Affirmation } from '../types';
import { storage } from '../utils/storage'; 
import { AFFIRMATIONS } from '../constants/affirmations';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

interface Props {
  navigation: FavoritesScreenNavigationProp;
}

export default function FavoritesScreen({ navigation }: Props) {
  const [favorites, setFavorites] = useState<Affirmation[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const savedFavorites = await storage.getFavorites();
    setFavoriteIds(savedFavorites);
    
    const favoriteAffirmations = AFFIRMATIONS.filter(affirmation =>
      savedFavorites.includes(affirmation.id)
    ).map(affirmation => ({
      ...affirmation,
      isFavorite: true,
      createdAt: new Date()
    }));
    
    setFavorites(favoriteAffirmations);
  };

  const removeFromFavorites = async (affirmationId: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this affirmation from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const newFavorites = favoriteIds.filter(id => id !== affirmationId);
            setFavoriteIds(newFavorites);
            setFavorites(favorites.filter(item => item.id !== affirmationId));
            await storage.saveFavorites(newFavorites);
          },
        },
      ]
    );
  };

  const renderAffirmationItem = ({ item }: { item: Affirmation }) => (
    <View style={styles.affirmationItem}>
      <View style={styles.affirmationContent}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>
            {item.category.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.affirmationText}>"{item.text}"</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Ionicons name="heart" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateText}>
        Start adding affirmations to your favorites by tapping the heart icon on the home screen.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Affirmations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length} saved affirmation{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderAffirmationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  affirmationItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  affirmationContent: {
    flex: 1,
    marginRight: 15,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EAF2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B78E6',
  },
  affirmationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#8B78E6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});