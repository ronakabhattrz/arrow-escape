import { IconHint } from './Icons';

interface Props { count: number; onUse: () => void; disabled?: boolean; }

export function HintButton({ count, onUse, disabled }: Props) {
  const inactive = disabled || count <= 0;
  return (
    <button
      className={`hint-btn${inactive ? ' disabled' : ''}`}
      onClick={inactive ? undefined : onUse}
    >
      <IconHint size={22} style={{ color: inactive ? 'var(--text3)' : 'var(--hint)' }} />
      <span className="hint-count">{disabled ? 'OFF' : count}</span>
    </button>
  );
}
