interface Props {
  variant?: 'default' | 'gold' | 'danger';
}

export function AuroraBackground({ variant = 'default' }: Props) {
  const orbs =
    variant === 'gold'
      ? [
          { color: '#92400E', size: 600, blur: 120, opacity: 0.3, cls: 'aurora-orb-1' },
          { color: '#78350F', size: 500, blur: 100, opacity: 0.25, cls: 'aurora-orb-2' },
          { color: '#451A03', size: 400, blur: 80,  opacity: 0.2,  cls: 'aurora-orb-3' },
        ]
      : variant === 'danger'
      ? [
          { color: '#9F1239', size: 600, blur: 120, opacity: 0.28, cls: 'aurora-orb-1' },
          { color: '#7F1D1D', size: 500, blur: 100, opacity: 0.22, cls: 'aurora-orb-2' },
          { color: '#450A0A', size: 400, blur: 80,  opacity: 0.18, cls: 'aurora-orb-3' },
        ]
      : [
          { color: '#1D4ED8', size: 600, blur: 120, opacity: 0.35, cls: 'aurora-orb-1' },
          { color: '#7C3AED', size: 500, blur: 100, opacity: 0.3,  cls: 'aurora-orb-2' },
          { color: '#0E7490', size: 400, blur: 80,  opacity: 0.25, cls: 'aurora-orb-3' },
        ];

  return (
    <div className="aurora-bg" aria-hidden>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`aurora-orb ${orb.cls}`}
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
          }}
        />
      ))}
      <div className="aurora-grain" />
    </div>
  );
}
