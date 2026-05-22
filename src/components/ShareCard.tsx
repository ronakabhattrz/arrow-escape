import { Share } from '@capacitor/share';

interface Props { date: string; stars: number; streak: number; onClose: () => void; }

export function ShareCard({ date, stars, streak, onClose }: Props) {
  const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  const text = `Arrow Escape — Daily Puzzle ${date}\n${starStr}\n🔥 ${streak}-day streak\n\nClear the grid. No collisions. No timer.`;

  const handleShare = async () => {
    try {
      await Share.share({ title: 'Arrow Escape Daily Puzzle', text, dialogTitle: 'Share your result' });
    } catch {
      await navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-pill" />
        <div className="share-card-wrapper">
          <div className="share-card-game">Arrow Escape</div>
          <div className="share-card-date">Daily Puzzle · {date}</div>
          <div className="share-card-stars">{starStr}</div>
          <div className="share-card-streak">🔥 {streak}-day streak</div>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleShare}>Share Result</button>
        <button className="btn btn-ghost btn-full btn-sm" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
