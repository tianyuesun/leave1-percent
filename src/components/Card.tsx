import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <View
      className={`rounded-card border border-line bg-paper p-5 ${className}`}
      style={{
        shadowColor: '#42513F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}
