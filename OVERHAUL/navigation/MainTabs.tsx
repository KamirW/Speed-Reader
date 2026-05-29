import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library } from 'lucide-react-native';
import { HomeScreen } from '../pages/Home';
import { LibraryScreen } from '../pages/BookList';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home color={color} size={size} />;
          return <Library color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
    </Tab.Navigator>
  );
}
