import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { 
  User, 
  Settings, 
  History, 
  Trash2, 
  Share2, 
  Star,
  Camera,
  TrendingUp,
  Award,
  ChevronRight,
  Moon,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react-native';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import AnimatedButton from '@/components/AnimatedButton';

export default function ProfileScreen() {
  const { history, clearHistory } = useAnalysisHistory();
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: 'January 2024',
    totalScans: history.length,
    streak: 7,
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all analysis history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: History,
      title: 'Scan History',
      subtitle: `${history.length} items`,
      color: '#5B67CA',
      onPress: () => {},
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences',
      color: '#666666',
      onPress: () => {},
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage alerts',
      color: '#82C8BE',
      onPress: () => {},
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      subtitle: 'Always on',
      color: '#8B5CF6',
      onPress: () => {},
    },
    {
      icon: Share2,
      title: 'Share App',
      subtitle: 'Tell friends',
      color: '#F8A978',
      onPress: () => {},
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      color: '#82C8BE',
      onPress: () => {},
    },
  ];

  const dangerItems = [
    {
      icon: Trash2,
      title: 'Clear History',
      subtitle: 'Delete all scans',
      color: '#E76F51',
      onPress: handleClearHistory,
    },
    {
      icon: LogOut,
      title: 'Sign Out',
      subtitle: 'Log out of account',
      color: '#E76F51',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.decorationBlob1} />
        <View style={styles.decorationBlob2} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.statusIndicator} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
          </View>
          <Pressable style={styles.editButton}>
            <Settings size={20} color="#666666" />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EEF0FF' }]}>
              <Camera size={24} color="#5B67CA" />
            </View>
            <Text style={styles.statNumber}>{user.totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <TrendingUp size={24} color="#82C8BE" />
            </View>
            <Text style={styles.statNumber}>{user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF2DD' }]}>
              <Award size={24} color="#F8A978" />
            </View>
            <Text style={styles.statNumber}>Pro</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FFF2DD' }]}>
                <Star size={20} color="#F8A978" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>First Scan</Text>
                <Text style={styles.achievementDescription}>Completed your first AI scan</Text>
              </View>
              <Text style={styles.achievementDate}>2d ago</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#E8F5E9' }]}>
                <TrendingUp size={20} color="#82C8BE" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Week Streak</Text>
                <Text style={styles.achievementDescription}>7 days of consecutive scanning</Text>
              </View>
              <Text style={styles.achievementDate}>Today</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <Pressable key={index} style={styles.menuItem} onPress={item.onPress}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            {dangerItems.map((item, index) => (
              <Pressable key={index} style={styles.menuItem} onPress={item.onPress}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EA',
  },
  decorationBlob1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(91, 103, 202, 0.1)',
    top: '5%',
    right: '-10%',
    zIndex: -1,
  },
  decorationBlob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(248, 169, 120, 0.1)',
    bottom: '20%',
    left: '-5%',
    zIndex: -1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333333',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  statusIndicator: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#82C8BE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    bottom: 0,
    right: 0,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  achievementsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  achievementsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0EA',
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0EA',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  dangerSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  bottomPadding: {
    height: 100,
  },
});