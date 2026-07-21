import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandArt } from '@/components/BrandArt';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useLeaveOne } from '@/state/LeaveOneProvider';

function dayLabel(iso: string) {
  const value = new Date(iso);
  const today = new Date();
  if (value.toDateString() === today.toDateString()) {
    return value.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return value.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function HomeScreen() {
  const router = useRouter();
  const { history, isHydrated } = useLeaveOne();
  const latest = history[0];
  const latestAction = latest
    ? latest.leaveOnePercentAction ?? (latest as typeof latest & { leavePlan?: string }).leavePlan
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(320)} style={{ paddingTop: 12 }}>
          <View className="h-[92px] overflow-hidden" accessible accessibilityLabel="Leave 1%. Leave the uncertainty. Keep what matters.">
            <Image
              source={require('../assets/leave1-logo.png')}
              resizeMode="contain"
              style={{ width: '100%', height: 233, marginTop: -66 }}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(340)}>
          <Text className="mt-7 text-[34px] font-bold leading-[40px] tracking-[-0.8px] text-ink">Today</Text>
          <Text className="mt-2 text-[16px] text-muted">One small choice. Then back to life.</Text>

          <Card className="mt-6 overflow-hidden p-0">
            <View className="px-5 pt-5">
              <Text className="text-[20px] font-semibold leading-6 text-ink">Did something trigger you?</Text>
              <Text className="mt-2 text-[15px] leading-5 text-muted">Interrupt one compulsion. Leave a little uncertainty.</Text>
            </View>
            <BrandArt compact />
            <View className="px-5 pb-5">
              <PrimaryButton
                label="I got triggered"
                disabled={!isHydrated}
                onPress={() => router.push('/intervention')}
              />
            </View>
          </Card>

          <View className="mt-7 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-ink">Capability</Text>
            <Text className="text-[13px] font-semibold text-sage-dark">BUILT, NOT SCORED</Text>
          </View>
          <Card className="mt-3">
            <View className="flex-row">
              <View className="flex-1 border-r border-line pr-5">
                <Text className="text-[13px] text-muted">1% choices</Text>
                <Text className="mt-1 text-[28px] font-bold tracking-[-0.5px] text-ink">{isHydrated ? history.length : '—'}</Text>
              </View>
              <View className="flex-1 pl-5">
                <Text className="text-[13px] text-muted">Returned to life</Text>
                <Text className="mt-1 text-[28px] font-bold tracking-[-0.5px] text-ink">{isHydrated ? history.length : '—'}</Text>
              </View>
            </View>
            <View className="mt-5 h-2 overflow-hidden rounded-full bg-sage-soft">
              <View
                className="h-full rounded-full bg-sage"
                style={{ width: history.length === 0 ? '0%' : `${Math.min(100, history.length * 8)}%` }}
              />
            </View>
            <Text className="mt-3 text-[13px] leading-5 text-muted">Capability grows each time you choose fewer rules—not when anxiety disappears.</Text>
          </Card>

          <Text className="mt-7 text-[20px] font-semibold text-ink">History</Text>
          {latest ? (
            <Card className="mt-3">
              <View className="flex-row items-start justify-between">
                <View className="mr-4 flex-1">
                  <Text className="text-[12px] font-medium uppercase tracking-[1.2px] text-muted">{dayLabel(latest.completedAt)}</Text>
                  <Text className="mt-2 text-[17px] font-semibold text-ink">{latest.triggerKind}</Text>
                  <Text className="mt-1 text-[14px] leading-5 text-muted" numberOfLines={2}>{latestAction}</Text>
                </View>
                <View className="rounded-full bg-sage-soft px-3 py-1.5">
                  <Text className="text-[12px] font-semibold text-sage-dark">Returned</Text>
                </View>
              </View>
            </Card>
          ) : (
            <View className="mt-3 rounded-card border border-dashed border-line px-5 py-6">
              <Text className="text-[15px] leading-6 text-muted">Your completed 1% choices will appear here. No streaks. No perfection.</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
