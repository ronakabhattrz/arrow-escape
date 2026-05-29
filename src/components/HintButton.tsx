import { IconHint } from './Icons';

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
        <IconHint size={16} />
        <span className="hint-count">{disabled ? '—' : count}</span>
      </div>
      <span className="hint-label">HINTS</span>
    </button>
  );
}
