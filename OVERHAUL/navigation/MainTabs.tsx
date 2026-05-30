import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, Upload } from 'lucide-react-native';
import { HomeScreen } from '../pages/Home';
import { LibraryScreen } from '../pages/BookList';
import { FileUpload } from '../pages/FileUpload';
import type { MainTabParamList } from './types';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const tabBarHeight = minDim * (isTablet ? 0.09 : 0.12);
const tabBarPadding = minDim * (isTablet ? 0.015 : 0.02);
const labelFontSize = minDim * (isTablet ? 0.025 : 0.035);

export function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
          paddingBottom: tabBarPadding + insets.bottom,
          paddingTop: tabBarPadding,
          height: tabBarHeight + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: labelFontSize,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home color={color} size={size} />;
          if (route.name === 'Upload') return <Upload color={color} size={size} />;
          return <Library color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Upload" component={FileUpload} />
    </Tab.Navigator>
  );
}
