import { Stack } from 'expo-router';
import { GuestGuard } from '../../src/components/auth';

export default function AuthLayout() {
  return (
    <GuestGuard>
      <Stack>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Welcome' }} />
      </Stack>
    </GuestGuard>
  );
}