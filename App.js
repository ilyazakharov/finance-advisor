import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { SettingsProvider, useSettings } from './src/store/SettingsContext';
import { PortfolioProvider } from './src/store/PortfolioContext';

import DashboardScreen from './src/screens/DashboardScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import AddAssetScreen from './src/screens/AddAssetScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import SettingsScreen from './src/screens/SettingsScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        detachInactiveScreens: false,
        headerStyle: { backgroundColor: '#f5f5f5' },
        headerTitleStyle: { fontWeight: '600' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: insets.bottom || 8, height: 56 + (insets.bottom || 8) },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Главная',
          tabBarLabel: 'Главная',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          title: 'Портфель',
          tabBarLabel: 'Портфель',
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddAsset"
        component={AddAssetScreen}
        options={{
          title: 'Добавить',
          tabBarLabel: 'Добавить',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          title: 'Анализ',
          tabBarLabel: 'Анализ',
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Настройки',
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { loaded } = useSettings();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setReady(true);
    }
  }, [loaded]);

  if (!ready) return null;

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <PortfolioProvider>
          <AppContent />
        </PortfolioProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
