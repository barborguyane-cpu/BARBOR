import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BarbOrLogoProps {
  size?: number;
  variant?: 'gold' | 'dark' | 'mono';
}

/**
 * BARB'OR logo — double B monogram with circle (the "O" of OR).
 * Gold background with black mark, faithful to the original.
 */
export const BarbOrLogo: React.FC<BarbOrLogoProps> = ({
  size = 120,
  variant = 'gold',
}) => {
  const bg = variant === 'gold' ? '#D4AF37' : variant === 'dark' ? '#0A0A0A' : '#1A1A1A';
  const mark = variant === 'gold' ? '#0A0A0A' : '#D4AF37';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#F0D060" />
            <Stop offset="0.5" stopColor="#D4AF37" />
            <Stop offset="1" stopColor="#A08828" />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx="100"
          cy="100"
          r="98"
          fill={variant === 'gold' ? 'url(#goldGrad)' : bg}
        />

        {/* Outer decorative circle ring */}
        <Circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke={mark}
          strokeWidth="5"
          strokeDasharray="380 50"
          strokeDashoffset="-25"
        />

        {/* === DOUBLE-B MONOGRAM === */}
        {/* Left B — vertical bar */}
        <Rect
          x="42"
          y="44"
          width="18"
          height="112"
          rx="6"
          fill={mark}
        />

        {/* Left B — top bump */}
        <Path
          d="M60 44 Q105 44 105 68 Q105 92 60 92 Z"
          fill={mark}
        />
        {/* Left B — top bump inner cutout */}
        <Path
          d="M68 54 Q96 54 96 68 Q96 82 68 82 Z"
          fill={variant === 'gold' ? '#D4AF37' : bg}
        />

        {/* Left B — bottom bump */}
        <Path
          d="M60 92 Q112 92 112 120 Q112 148 60 148 Z"
          fill={mark}
        />
        {/* Left B — bottom bump inner cutout */}
        <Path
          d="M68 102 Q102 102 102 120 Q102 138 68 138 Z"
          fill={variant === 'gold' ? '#D4AF37' : bg}
        />

        {/* Right B — vertical bar (overlapping, offset) */}
        <Rect
          x="64"
          y="56"
          width="16"
          height="100"
          rx="5"
          fill={mark}
        />

        {/* Right B — top bump */}
        <Path
          d="M80 56 Q130 56 130 80 Q130 104 80 104 Z"
          fill={mark}
        />
        {/* Right B — top bump cutout */}
        <Path
          d="M88 66 Q120 66 120 80 Q120 94 88 94 Z"
          fill={variant === 'gold' ? '#D4AF37' : bg}
        />

        {/* Right B — bottom bump */}
        <Path
          d="M80 104 Q136 104 136 132 Q136 158 80 158 Z"
          fill={mark}
        />
        {/* Right B — bottom bump cutout */}
        <Path
          d="M88 114 Q126 114 126 132 Q126 148 88 148 Z"
          fill={variant === 'gold' ? '#D4AF37' : bg}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: 'hidden',
  },
});

export default BarbOrLogo;
