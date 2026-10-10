import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { OwnerHomeScreen } from './src/screens/OwnerHomeScreen';
import { HelperHomeScreen } from './src/screens/HelperHomeScreen';
import { CreateRequestScreen } from './src/screens/CreateRequestScreen';
import { NearbyJobsScreen } from './src/screens/NearbyJobsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { Role } from '@petco/shared';

const Stack = createNativeStackNavigator();

function NavigationRoot() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === Role.HELPER ? (
          <>
            <Stack.Screen name="HelperHome" component={HelperHomeScreen} />
            <Stack.Screen
              name="NearbyJobs"
              component={NearbyJobsScreen}
              options={{ headerShown: true, title: 'Nearby Jobs' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: true, title: 'Chat' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
            <Stack.Screen
              name="CreateRequest"
              component={CreateRequestScreen}
              options={{ headerShown: true, title: 'New Request' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: true, title: 'Chat' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationRoot />
    </AuthProvider>
  );
}
