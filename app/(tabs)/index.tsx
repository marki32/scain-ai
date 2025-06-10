import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import { Search, Clock, Sparkles, TrendingUp, Eye, ArrowRight } from 'lucide-react-native';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import AnimatedButton from '@/components/AnimatedButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { history, isLoading } = useAnalysisHistory();

  const recentItems = history.slice(0, 6);
  const filteredItems = recentItems.filter(item =>
    item.analysis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#5B67CA" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.decorationBlob1} />
        <View style={styles.decorationBlob2} />
        <View style={styles.decorationBlob3} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Discover & Identify</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <TrendingUp size={16} color="#5B67CA" />
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Scanned</Text>
            </View>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your scans..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Pressable style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#EEF0FF' }]}>
                <Sparkles size={24} color="#5B67CA" />
              </View>
              <Text style={styles.actionTitle}>Scan Object</Text>
              <Text style={styles.actionSubtitle}>Take a photo</Text>
              <View style={styles.actionArrow}>
                <ArrowRight size={16} color="#5B67CA" />
              </View>
            </Pressable>
            <Pressable style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF2DD' }]}>
                <Eye size={24} color="#F8A978" />
              </View>
              <Text style={styles.actionTitle}>Upload Image</Text>
              <Text style={styles.actionSubtitle}>From gallery</Text>
              <View style={styles.actionArrow}>
                <ArrowRight size={16} color="#F8A978" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Recent Items */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <View style={styles.countBadge}>
              <Text style={styles.sectionCount}>{filteredItems.length}</Text>
            </View>
          </View>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Clock size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No matching scans' : 'No recent scans'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start scanning objects to see them here'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.itemsGrid}>
              {filteredItems.map((item) => (
                <Pressable key={item.id} style={styles.itemCard}>
                  <View style={styles.itemImageContainer}>
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    <View style={styles.itemOverlay}>
                      <View style={styles.timeTag}>
                        <Clock size={12} color="#FFFFFF" />
                        <Text style={styles.timeText}>{formatTimeAgo(item.timestamp)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.analysis}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorationBlob1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(91, 103, 202, 0.15)',
    top: '5%',
    right: '10%',
    zIndex: -1,
  },
  decorationBlob2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(248, 169, 120, 0.15)',
    bottom: '35%',
    left: '5%',
    zIndex: -1,
  },
  decorationBlob3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(130, 200, 190, 0.15)',
    top: '30%',
    left: '15%',
    zIndex: -1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    lineHeight: 34,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  actionArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  recentSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countBadge: {
    backgroundColor: '#EEF0FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#5B67CA',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F0EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImageContainer: {
    position: 'relative',
    height: 120,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});