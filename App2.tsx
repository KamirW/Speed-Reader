import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './OVERHAUL/navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Splash } from './OVERHAUL/pages/Splash';
import { Onboarding } from './OVERHAUL/pages/Onboarding';
import { MainTabs } from './OVERHAUL/navigation/MainTabs';
import { ChapterListScreen } from './OVERHAUL/pages/ChapterList';
import { ReaderScreen } from './OVERHAUL/pages/Reader';
import { DataProvider } from './OVERHAUL/hooks/useData';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <DataProvider>
      <SafeAreaProvider>
          <NavigationContainer>
              <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Splash"
              >
                  <Stack.Screen name="Splash" component={Splash} />
                  <Stack.Screen name="Onboarding" component={Onboarding} />
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen name="ChapterList" component={ChapterListScreen} />
                  <Stack.Screen name="Reader" component={ReaderScreen} />
              </Stack.Navigator>
          </NavigationContainer>
      </SafeAreaProvider>
    </DataProvider>
  )
}

export default App