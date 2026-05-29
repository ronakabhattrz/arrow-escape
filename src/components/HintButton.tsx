interface Props { count: number; onUse: () => void; disabled?: boolean; }

export function HintButton({ count, onUse, disabled }: Props) {
  const inactive = disabled || count <= 0;
  const hasHints = !disabled && count > 0;
  return (
    <button
      className={`hint-btn${inactive ? ' inactive' : ''}${hasHints ? ' hint-ring' : ''}`}
      onClick={inactive ? undefined : onUse}
    >
      <div className="hint-btn-row">
        {/* Hexagon unicode + count */}
        <span style={{ fontSize: 14, lineHeight: 1 }}>⬡</span>
        <span className="hint-count">{disabled ? '—' : count}</span>
      </div>
    </button>
  );
}
