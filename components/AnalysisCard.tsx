import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Clock, Sparkles } from 'lucide-react-native';

interface AnalysisCardProps {
  imageUri: string;
  analysis: string;
  timestamp: string;
  onPress?: () => void;
}

export default function AnalysisCard({
  imageUri,
  analysis,
  timestamp,
  onPress,
}: AnalysisCardProps) {
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.imageOverlay}>
          <View style={styles.aiTag}>
            <Sparkles size={12} color="#ffffff" />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.analysis} numberOfLines={3}>
          {analysis}
        </Text>
        <View style={styles.footer}>
          <Clock size={14} color="#6b7280" />
          <Text style={styles.timestamp}>{formatTimeAgo(timestamp)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  aiTag: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  analysis: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e5e7eb',
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 6,
  },
});