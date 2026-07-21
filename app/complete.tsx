import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandArt } from '@/components/BrandArt';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { UnfinishedMark } from '@/components/UnfinishedMark';
import { planForCompulsion } from '@/services/erpCoach';
import { useLeaveOne } from '@/state/LeaveOneProvider';
import { colors } from '@/theme';

export default function CompleteScreen() {
  const router = useRouter();
  const { history, isHydrated } = useLeaveOne();
  const latest = history[0];

  useEffect(() => {
    if (isHydrated && !latest) router.replace('/');
  }, [isHydrated, latest, router]);

  if (!latest) return <SafeAreaView className="flex-1 bg-canvas" />;

  const capability = latest.capability ?? planForCompulsion(latest.compulsion).capability;

  return (
    <SafeAreaView className="flex-1 bg-canvas px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-between py-5">
        <Animated.View entering={FadeIn.duration(320)} style={{ alignItems: 'center', paddingTop: 20 }}>
          <UnfinishedMark size={58} />
          <Text className="mt-6 text-center text-[34px] font-bold leading-10 tracking-[-0.8px] text-ink">Return to life.</Text>
          <Text className="mt-3 text-center text-[17px] leading-6 text-muted">You left one percent unfinished.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(340)}>
          <BrandArt compact />
          <Card>
            <View className="flex-row items-center border-b border-line pb-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-sage-soft">
                <Ionicons name="arrow-forward" size={20} color={colors.sageDark} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[13px] text-muted">Return to life</Text>
                <Text className="mt-0.5 text-[16px] font-semibold text-ink">{latest.returnTo}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color={colors.sage} />
            </View>
            <View className="flex-row items-center pt-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-sand">
                <Ionicons name="trending-up-outline" size={20} color={colors.earth} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[13px] text-muted">Capability updated</Text>
                <Text className="mt-0.5 text-[16px] font-semibold text-ink">{capability}</Text>
              </View>
              <Text className="text-[16px] font-bold text-sage-dark">+1%</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(340)}>
          <PrimaryButton label="Done" onPress={() => router.replace('/')} />
          <Text className="mt-3 text-center text-[12px] text-muted">Close the app. Keep the capability.</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
