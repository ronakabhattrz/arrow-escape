export function DeepSpaceBg() {
  return (
    <div
      className="dsc-bg"
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Orb 1 — iris-a cyan, top-left */}
      <div className="dsc-orb dsc-orb-1" />
      {/* Orb 2 — iris-b purple, bottom-right */}
      <div className="dsc-orb dsc-orb-2" />
      {/* Orb 3 — iris-c pink, top-right */}
      <div className="dsc-orb dsc-orb-3" />
      {/* Horizontal scan line */}
      <div className="dsc-scan" />
      {/* SVG grain noise */}
      <div className="dsc-grain" />
      {/* Iridescent edge shimmer */}
      <div className="dsc-shimmer" />
    </div>
  );
}
