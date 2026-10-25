/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/navigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

function App() {
 // const isDarkMode = useColorScheme() === 'dark';

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <RootNavigator/>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}

export default App;
