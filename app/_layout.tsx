import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LeaveOneProvider } from '@/state/LeaveOneProvider';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <LeaveOneProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvas },
          animation: 'fade_from_bottom',
          animationDuration: 260,
        }}
      />
    </LeaveOneProvider>
  );
}
