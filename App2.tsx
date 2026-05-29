import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './OVERHAUL/navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Onboarding } from './OVERHAUL/pages/Onboarding';
import { MainTabs } from './OVERHAUL/navigation/MainTabs';
import { ChapterListScreen } from './OVERHAUL/pages/ChapterList';
import { ReaderScreen } from './OVERHAUL/pages/Reader';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator<RootStackParamList>();
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
      setIsOnboardingComplete(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingComplete(false);
    }
  };

  if (isOnboardingComplete === null) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{ headerShown: false }}
              initialRouteName={isOnboardingComplete ? 'MainTabs' : 'Onboarding'}
            >
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="ChapterList" component={ChapterListScreen} />
                <Stack.Screen name="Reader" component={ReaderScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App