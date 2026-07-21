import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { UnfinishedMark } from '@/components/UnfinishedMark';
import type { Intervention } from '@/types';

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-[10px] font-semibold uppercase tracking-[2px] text-sage-dark">
      {children}
    </Text>
  );
}

export function InterventionCard({ intervention }: { intervention: Intervention }) {
  return (
    <Animated.View
      entering={FadeInUp.delay(80).duration(520).springify().damping(24)}
      style={{
        borderRadius: 30,
        shadowColor: '#344B32',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.1,
        shadowRadius: 32,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={['#FFFEFB', '#F3F6EE']}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          overflow: 'hidden',
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#DEE7D9',
          paddingHorizontal: 22,
          paddingVertical: 20,
        }}
      >
        <View pointerEvents="none" style={{ position: 'absolute', right: -54, top: -58, opacity: 0.5 }}>
          <Svg width={190} height={190} viewBox="0 0 190 190">
            <Circle
              cx="95"
              cy="95"
              r="67"
              fill="none"
              stroke="#DCE8D8"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="370 52"
              transform="rotate(-42 95 95)"
            />
          </Svg>
        </View>

        <View className="flex-row items-center border-b border-line pb-4">
          <UnfinishedMark size={34} />
          <View className="ml-3 flex-1 pr-8">
            <SectionLabel>Safety</SectionLabel>
            <View className="mt-2 flex-row items-start">
              <View className="mr-2.5 mt-1.5 h-2 w-2 rounded-full bg-sage" />
              <Text className="flex-1 text-[15px] font-medium leading-[21px] text-ink">
                {intervention.safetyMessage}
              </Text>
            </View>
          </View>
        </View>

        <View className="border-b border-line py-4">
          <SectionLabel>What is happening</SectionLabel>
          <Text className="mt-2.5 text-[17px] leading-[25px] text-ink">
            {intervention.mechanism}
          </Text>
        </View>

        <View className="border-b border-line py-4">
          <SectionLabel>Leave 1%</SectionLabel>
          <Text
            className="mt-3 text-[21px] leading-[30px] tracking-[-0.2px] text-ink"
            style={{ fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' }) }}
          >
            {intervention.uncertaintyMessage}
          </Text>
        </View>

        <View className="mt-4 rounded-[20px] border border-[#D7E4D2] bg-sage-soft p-4">
          <SectionLabel>Your next action</SectionLabel>
          <Text className="mt-3 text-[20px] font-semibold leading-[27px] tracking-[-0.25px] text-sage-dark">
            {intervention.leaveOnePercentAction}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
