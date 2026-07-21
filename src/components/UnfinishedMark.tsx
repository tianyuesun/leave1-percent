import Svg, { Circle, Path } from 'react-native-svg';

export function UnfinishedMark({ size = 44 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      accessibilityLabel="An open circle with a growing leaf"
    >
      <Circle
        cx="32"
        cy="32"
        r="23"
        fill="none"
        stroke="#DCE8D8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="122 23"
        transform="rotate(-48 32 32)"
      />
      <Path
        d="M42 51 C42 42 45 35 51 29"
        fill="none"
        stroke="#4F804A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M50 30 C51 20 58 17 59 20 C60 25 56 30 50 33Z"
        fill="#75A66D"
      />
      <Circle cx="43" cy="51" r="2.4" fill="#4F804A" />
    </Svg>
  );
}
