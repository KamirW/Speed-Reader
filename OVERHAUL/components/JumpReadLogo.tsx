import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Line,
  Filter,
  FeGaussianBlur,
  FeComposite,
} from 'react-native-svg';

interface JumpReadLogoProps {
  size?: number;
  className?: string;
}

export function JumpReadLogo({ size = 32, className = "" }: JumpReadLogoProps) {
  const id = `lg-${size}`;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
    >
      <Defs>
        <LinearGradient id={`${id}-bg`} x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#7c3aed" />
          <Stop offset="100%" stopColor="#1d4ed8" />
        </LinearGradient>
        <LinearGradient id={`${id}-flash`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
          <Stop offset="100%" stopColor="#e0d7ff" stopOpacity={0.9} />
        </LinearGradient>
        <Filter id={`${id}-glow`}>
          <FeGaussianBlur stdDeviation={1.5} result="blur" />
          <FeComposite in="SourceGraphic" in2="blur" operator="over" />
        </Filter>
      </Defs>

      {/* Background */}
      <Rect width="80" height="80" rx={20} fill={`url(#${id}-bg)`} />

      {/* Subtle inner glow ring */}
      <Rect width="80" height="80" rx={20} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={2} />

      {/* Left book page */}
      <Path
        d="M14 22 C14 22 22 20 40 21 L40 58 C22 57 14 59 14 59 Z"
        fill="white"
        opacity={0.92}
      />
      {/* Right book page */}
      <Path
        d="M40 21 C58 20 66 22 66 22 L66 59 C66 59 58 57 40 58 Z"
        fill="white"
        opacity={0.72}
      />

      {/* Book spine shadow */}
      <Line x1="40" y1="20" x2="40" y2="59" stroke="#6d28d9" strokeWidth={1} strokeOpacity={0.25} />

      {/* Subtle page lines left */}
      <Line x1="19" y1="31" x2="36" y2="31" stroke="#7c3aed" strokeWidth={1.2} strokeOpacity={0.2} strokeLinecap="round" />
      <Line x1="19" y1="37" x2="36" y2="37" stroke="#7c3aed" strokeWidth={1.2} strokeOpacity={0.2} strokeLinecap="round" />
      <Line x1="19" y1="43" x2="36" y2="43" stroke="#7c3aed" strokeWidth={1.2} strokeOpacity={0.2} strokeLinecap="round" />
      <Line x1="19" y1="49" x2="32" y2="49" stroke="#7c3aed" strokeWidth={1.2} strokeOpacity={0.15} strokeLinecap="round" />

      {/* Subtle page lines right */}
      <Line x1="44" y1="31" x2="61" y2="31" stroke="#1e40af" strokeWidth={1.2} strokeOpacity={0.2} strokeLinecap="round" />
      <Line x1="44" y1="37" x2="61" y2="37" stroke="#1e40af" strokeWidth={1.2} strokeOpacity={0.2} strokeLinecap="round" />
      <Line x1="44" y1="43" x2="61" y2="43" stroke="#1e40af" strokeWidth={1.2} strokeOpacity={0.2} strokeLinecap="round" />
      <Line x1="44" y1="49" x2="57" y2="49" stroke="#1e40af" strokeWidth={1.2} strokeOpacity={0.15} strokeLinecap="round" />

      {/* RSVP focal point bar */}
      <Rect x="35.5" y="18" width="9" height="44" rx="4.5" fill={`url(#${id}-flash)`} opacity={0.97} />

      {/* Lightning bolt / jump arrow overlay on focal bar */}
      <Path
        d="M42 26 L38 36 L41.5 36 L38 52 L46 38 L42 38 Z"
        fill={`url(#${id}-bg)`}
        opacity={0.85}
      />

      {/* Top speed chevron */}
      <Path
        d="M30 15 L40 10 L50 15"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.9}
      />
    </Svg>
  );
}
