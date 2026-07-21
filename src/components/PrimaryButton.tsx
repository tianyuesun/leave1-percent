import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = ComponentProps<typeof Pressable> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'quiet';
};

export function PrimaryButton({ label, variant = 'primary', disabled, onPress, ...props }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const container =
    variant === 'primary'
      ? 'bg-sage'
      : variant === 'secondary'
        ? 'border border-line bg-paper'
        : 'bg-transparent';
  const text = variant === 'primary' ? 'text-white' : variant === 'quiet' ? 'text-sage-dark' : 'text-ink';

  return (
    <Animated.View style={[animatedStyle, disabled && { opacity: 0.42 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        className={`min-h-14 items-center justify-center rounded-full px-6 ${container}`}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withTiming(0.985, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 140 });
        }}
        onPress={(event) => {
          void Haptics.selectionAsync();
          onPress?.(event);
        }}
        {...props}
      >
        <Text className={`text-[17px] font-semibold ${text}`}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
