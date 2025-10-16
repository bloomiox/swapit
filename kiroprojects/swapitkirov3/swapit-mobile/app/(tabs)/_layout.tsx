import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthGuard } from '../../src/components/auth';

export default function TabLayout() {
  return (
    <AuthGuard>
      <Tabs>
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="requests"
          options={{
            title: 'Requests',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="swap-horizontal" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-item"
          options={{
            title: 'Add Item',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}