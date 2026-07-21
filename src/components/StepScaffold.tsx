import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Props = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle?: string;
  step?: number;
  footer?: ReactNode;
  onBack?: () => void;
}>;

export function StepScaffold({ eyebrow, title, subtitle, step, footer, onBack, children }: Props) {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-full"
            hitSlop={8}
            onPress={onBack ?? (() => router.back())}
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
          {step ? (
            <View className="flex-row gap-2" accessibilityLabel={`Step ${step} of 5`}>
              {[1, 2, 3, 4, 5].map((dot) => (
                <View key={dot} className={`h-1.5 w-6 rounded-full ${dot <= step ? 'bg-sage' : 'bg-line'}`} />
              ))}
            </View>
          ) : (
            <View />
          )}
          <View className="w-11" />
        </View>

        <ScrollView
          key={`${step ?? 0}:${eyebrow}`}
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(260)} exiting={FadeOut.duration(160)}>
            <Text className="mt-5 text-[13px] font-semibold uppercase tracking-[1.8px] text-sage-dark">{eyebrow}</Text>
            <Text className="mt-3 text-[34px] font-bold leading-[40px] tracking-[-0.8px] text-ink">{title}</Text>
            {subtitle ? <Text className="mt-3 text-[17px] leading-6 text-muted">{subtitle}</Text> : null}
            <View className="mt-8">{children}</View>
          </Animated.View>
        </ScrollView>
        {footer ? <View className="border-t border-line bg-canvas px-6 pb-2 pt-4">{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
