import { Tabs } from 'expo-router';
import { Home, ScanLine, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingTop: 12,
          paddingBottom: 12,
          height: 85,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: '#5B67CA',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(91, 103, 202, 0.1)' : 'transparent',
              borderRadius: 16,
              padding: 8,
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}>
              <Home size={size} color={color} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(91, 103, 202, 0.1)' : 'transparent',
              borderRadius: 16,
              padding: 8,
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}>
              <ScanLine size={size} color={color} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(91, 103, 202, 0.1)' : 'transparent',
              borderRadius: 16,
              padding: 8,
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}>
              <User size={size} color={color} strokeWidth={focused ? 2.2 : 1.8} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}