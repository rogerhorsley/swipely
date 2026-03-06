import { Tabs } from 'expo-router';
import { Grid3x3, Heart, Folder } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8E8E8',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0A0A0A',
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          letterSpacing: 0.6,
        },
      }}
    >
      <Tabs.Screen
        name="browse"
        options={{
          title: '浏览',
          tabBarIcon: ({ color, size }) => (
            <Grid3x3 color={color} size={size} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: '喜欢',
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="folders"
        options={{
          title: '文件夹',
          tabBarIcon: ({ color, size }) => (
            <Folder color={color} size={size} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
