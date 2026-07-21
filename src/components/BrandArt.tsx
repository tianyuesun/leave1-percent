import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export function BrandArt({ compact = false }: { compact?: boolean }) {
  const height = compact ? 138 : 190;
  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 360 190"
      accessibilityLabel="An open circle becoming a path and a growing leaf"
    >
      <Defs>
        <LinearGradient id="openPath" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#9EBE94" />
          <Stop offset="1" stopColor="#4F804A" />
        </LinearGradient>
      </Defs>
      <Circle cx="180" cy="93" r="71" fill="#F0F4EB" />
      <Circle
        cx="180"
        cy="93"
        r="54"
        fill="none"
        stroke="#D6E3D1"
        strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray="298 42"
        transform="rotate(-48 180 93)"
      />
      <Circle
        cx="180"
        cy="93"
        r="54"
        fill="none"
        stroke="url(#openPath)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="298 42"
        transform="rotate(-48 180 93)"
      />
      <Path
        d="M198 144 C202 127 214 115 229 103 C241 93 244 77 246 62"
        fill="none"
        stroke="#4F804A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path d="M246 66 C249 45 263 38 268 43 C270 52 261 64 246 70Z" fill="#73A46C" />
      <Path d="M235 89 C224 77 215 82 218 91 C224 98 231 96 239 95Z" fill="#A4C397" />
      <Circle cx="199" cy="145" r="4" fill="#4F804A" />
    </Svg>
  );
}
