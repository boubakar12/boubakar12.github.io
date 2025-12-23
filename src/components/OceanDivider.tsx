interface OceanDividerProps {
  variant?: 'wave' | 'depth' | 'discovery';
}

export const OceanDivider = ({ variant = 'wave' }: OceanDividerProps) => {
  if (variant === 'wave') {
    return (
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-8 opacity-40">
          <span className="text-2xl animate-float" style={{ animationDelay: '0s' }}>🐠</span>
          <span className="text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🪼</span>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-bioluminescent to-transparent" />
          <span className="text-4xl animate-float" style={{ animationDelay: '1s' }}>⚓</span>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-bioluminescent to-transparent" />
          <span className="text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🦑</span>
          <span className="text-2xl animate-float" style={{ animationDelay: '2s' }}>🐡</span>
        </div>
      </div>
    );
  }

  if (variant === 'depth') {
    return (
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-bioluminescent/50" />
            <span className="text-bioluminescent text-sm tracking-widest">DIVING DEEPER</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-bioluminescent/50" />
          </div>
          <div className="flex gap-2 opacity-60">
            <span className="text-xl">🫧</span>
            <span className="text-lg">🫧</span>
            <span className="text-sm">🫧</span>
          </div>
        </div>
        <svg className="absolute bottom-0 w-full h-8" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q150,40 300,20 T600,20 T900,20 T1200,20 L1200,40 L0,40 Z"
            fill="hsl(var(--abyss))"
            opacity="0.3"
          />
        </svg>
      </div>
    );
  }

  // Discovery variant
  return (
    <div className="relative h-40 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Sonar rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-bioluminescent/20 animate-sonar" />
            <div className="absolute w-24 h-24 rounded-full border border-bioluminescent/30 animate-sonar" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-16 h-16 rounded-full border border-bioluminescent/40 animate-sonar" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* Center icon */}
          <div className="relative z-10 w-16 h-16 rounded-full bg-abyss/80 border border-bioluminescent/50 flex items-center justify-center">
            <span className="text-2xl">🔱</span>
          </div>
        </div>
        
        {/* Floating discoveries */}
        <div className="absolute left-1/4 top-1/4 animate-float opacity-50">
          <span className="text-xl">🏺</span>
        </div>
        <div className="absolute right-1/4 bottom-1/4 animate-float opacity-50" style={{ animationDelay: '1s' }}>
          <span className="text-xl">💎</span>
        </div>
      </div>
    </div>
  );
};
