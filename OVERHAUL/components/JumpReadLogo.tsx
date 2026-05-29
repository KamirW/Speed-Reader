import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
} from 'react-native-svg';

interface Props {
  size?: number;
}

export function JumpReadLogo({ size = 32 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <LinearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#9333ea" />
          <Stop offset="1" stopColor="#2563eb" />
        </LinearGradient>
      </Defs>
      <Rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
      <Path d="M8 14 C11 13 15 12.5 20 13 L20 25 C15 24.5 11 24.5 8 26 Z" fill="white" opacity="0.9" />
      <Path d="M20 13 C25 12.5 29 13 32 14 L32 26 C29 24.5 25 24.5 20 25 Z" fill="white" opacity="0.75" />
      <Path d="M20 12 L20 25" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <Path d="M22 9 L18 16 L21 16 L17 23 L25 14 L21.5 14 Z" fill="white" opacity="0.95" />
    </Svg>
  );
}
