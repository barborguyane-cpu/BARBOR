export const Logo = ({ size = 80, variant = 'gold' }) => {
  const bg    = variant === 'gold' ? 'url(#goldGrad)' : '#0A0A0A';
  const mark  = variant === 'gold' ? '#0A0A0A' : '#D4AF37';
  const inner = variant === 'gold' ? '#D4AF37'  : '#0A0A0A';

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0"   stopColor="#F0D060" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1"   stopColor="#A08828" />
        </linearGradient>
      </defs>
      {/* Background */}
      <circle cx="100" cy="100" r="98" fill={bg} />
      {/* Ring */}
      <circle cx="100" cy="100" r="88" fill="none" stroke={mark} strokeWidth="5"
        strokeDasharray="380 50" strokeDashoffset="-25" />
      {/* Left B — vertical */}
      <rect x="42" y="44" width="18" height="112" rx="6" fill={mark} />
      {/* Left B — top bump */}
      <path d="M60 44 Q105 44 105 68 Q105 92 60 92 Z" fill={mark} />
      <path d="M68 54 Q96 54 96 68 Q96 82 68 82 Z" fill={inner} />
      {/* Left B — bottom bump */}
      <path d="M60 92 Q112 92 112 120 Q112 148 60 148 Z" fill={mark} />
      <path d="M68 102 Q102 102 102 120 Q102 138 68 138 Z" fill={inner} />
      {/* Right B — vertical */}
      <rect x="64" y="56" width="16" height="100" rx="5" fill={mark} />
      {/* Right B — top bump */}
      <path d="M80 56 Q130 56 130 80 Q130 104 80 104 Z" fill={mark} />
      <path d="M88 66 Q120 66 120 80 Q120 94 88 94 Z" fill={inner} />
      {/* Right B — bottom bump */}
      <path d="M80 104 Q136 104 136 132 Q136 158 80 158 Z" fill={mark} />
      <path d="M88 114 Q126 114 126 132 Q126 148 88 148 Z" fill={inner} />
    </svg>
  );
};
