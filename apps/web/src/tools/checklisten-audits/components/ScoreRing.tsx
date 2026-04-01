interface Props {
  score: number; // 0-100
  size?: number;
}

export function ScoreRing({ score, size = 100 }: Props) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(score, 100) / 100) * circumference;

  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={8}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute font-display text-h3 text-kore-ink">
        {Math.round(score)}%
      </span>
    </div>
  );
}
