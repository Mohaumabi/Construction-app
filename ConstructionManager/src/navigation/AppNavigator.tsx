import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '@/store';
import { UserRole } from '@/types';

// Auth Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import ProjectListScreen from '@/screens/project/ProjectListScreen';
import ProjectDetailScreen from '@/screens/project/ProjectDetailScreen';
import TeamListScreen from '@/screens/team/TeamListScreen';
import TeamDetailScreen from '@/screens/team/TeamDetailScreen';
import PayrollScreen from '@/screens/payroll/PayrollScreen';
import ReportsScreen from '@/screens/reports/ReportsScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function ProjectStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProjectList" 
        component={ProjectListScreen}
        options={{ title: 'Projects' }}
      />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen}
        options={{ title: 'Project Details' }}
      />
    </Stack.Navigator>
  );
}

function TeamStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TeamList" 
        component={TeamListScreen}
        options={{ title: 'Teams' }}
      />
      <Stack.Screen 
        name="TeamDetail" 
        component={TeamDetailScreen}
        options={{ title: 'Team Details' }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.auth);

  const getTabScreens = () => {
    const screens = [
      {
        name: 'Dashboard',
        component: DashboardScreen,
        icon: 'home-outline',
        roles: Object.values(UserRole),
      },
      {
        name: 'Projects',
        component: ProjectStackNavigator,
        icon: 'folder-outline',
        roles: [
          UserRole.OWNER,
          UserRole.PROJECT_MANAGER,
          UserRole.SITE_FOREMAN,
          UserRole.SUPERVISOR,
          UserRole.CLIENT_INVESTOR,
        ],
      },
      {
        name: 'Teams',
        component: TeamStackNavigator,
        icon: 'people-outline',
        roles: [
          UserRole.OWNER,
          UserRole.PROJECT_MANAGER,
          UserRole.SITE_FOREMAN,
          UserRole.HR_MANAGER,
        ],
      },
      {
        name: 'Payroll',
        component: PayrollScreen,
        icon: 'card-outline',
        roles: [
          UserRole.OWNER,
          UserRole.ACCOUNTANT,
          UserRole.HR_MANAGER,
          UserRole.SITE_WORKER,
          UserRole.SUPERVISOR,
          UserRole.SITE_FOREMAN,
        ],
      },
      {
        name: 'Reports',
        component: ReportsScreen,
        icon: 'document-text-outline',
        roles: [
          UserRole.OWNER,
          UserRole.PROJECT_MANAGER,
          UserRole.ACCOUNTANT,
          UserRole.CLIENT_INVESTOR,
        ],
      },
    ];

    return screens.filter(screen => 
      user?.role && screen.roles.includes(user.role)
    );
  };

  const tabScreens = getTabScreens();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const screen = tabScreens.find(s => s.name === route.name);
          const iconName = screen?.icon || 'help-outline';
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  const { theme } = useSelector((state: RootState) => state.theme);

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.colors.surface,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ 
          title: 'Construction Manager',
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);

  if (!isInitialized) {
    // Return loading screen or splash screen
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.alert,
        },
      }}
    >
      {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}