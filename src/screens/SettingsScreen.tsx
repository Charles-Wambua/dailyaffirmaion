import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { storage } from '../utils/storage' ;

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export default function SettingsScreen({ navigation }: Props) {
  const clearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all your favorite affirmations? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await storage.saveFavorites([]);
            Alert.alert('Success', 'All favorites have been cleared.');
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy', 
      '🌟 Daily Affirmations Privacy Policy:\n\n• All data is stored locally on your device\n• We do not collect any personal information\n• No data is sent to external servers\n• Your affirmations and favorites remain private and secure'
    );
  };

  const handleComingSoon = (feature: string) => {
    Alert.alert(
      'Coming Soon',
      `${feature} will be available in the next update!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Info Section */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Ionicons name="heart" size={32} color="#8B78E6" />
          </View>
          <View style={styles.appInfoText}>
            <Text style={styles.appName}>Daily Affirmations</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appSubtitle}>Your mindful companion</Text>
          </View>
        </View>
      </View>

      {/* Features Coming Soon */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FEATURES</Text>
        <View style={styles.comingSoonCard}>
          <Ionicons name="rocket-outline" size={24} color="#8B78E6" />
          <View style={styles.comingSoonText}>
            <Text style={styles.comingSoonTitle}>More Features Coming Soon!</Text>
            <Text style={styles.comingSoonDescription}>
              Daily reminders and more features are in development.
            </Text>
          </View>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA</Text>
        <TouchableOpacity style={styles.settingItem} onPress={clearAllFavorites}>
          <View style={styles.settingInfo}>
            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: '#FF6B6B' }]}>
                Clear All Favorites
              </Text>
              <Text style={styles.settingDescription}>
                Remove all saved affirmations
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => handleComingSoon('Rate App')}>
          <View style={styles.settingInfo}>
            <Ionicons name="star-outline" size={22} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Rate the App</Text>
              <Text style={styles.settingDescription}>
                Share your experience with others
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => handleComingSoon('Share App')}>
          <View style={styles.settingInfo}>
            <Ionicons name="share-outline" size={22} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Share with Friends</Text>
              <Text style={styles.settingDescription}>
                Spread positivity with others
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={openPrivacyPolicy}>
          <View style={styles.settingInfo}>
            <Ionicons name="lock-closed-outline" size={22} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Learn how we handle your data
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.aboutCard}>
          <Ionicons name="heart" size={24} color="#8B78E6" />
          <Text style={styles.aboutText}>
            Daily Affirmations is designed to help you cultivate positivity and self-love through daily mindful practices. All data stays securely on your device.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for your wellbeing
        </Text>
        <Text style={styles.footerSubtext}>
          Version 1.0.0 • Built with Expo
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
  section: {
    marginBottom: 20,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  appInfoText: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#8B78E6',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
    marginLeft: 20,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0EDFF',
    marginHorizontal: 20,
    borderRadius: 12,
  },
  comingSoonText: {
    flex: 1,
    marginLeft: 15,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B78E6',
    marginBottom: 5,
  },
  comingSoonDescription: {
    fontSize: 14,
    color: '#8B78E6',
    lineHeight: 18,
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
  },
  aboutText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#999',
  },
});