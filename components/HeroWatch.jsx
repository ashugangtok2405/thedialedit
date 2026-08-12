export default function HeroWatch() {
  return (
    <svg viewBox="0 0 320 320" width="320" height="320" role="img" aria-label="Illustration of a luxury wristwatch">
      <defs>
        <radialGradient id="caseGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f3d98a" />
          <stop offset="45%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8a6d1a" />
        </radialGradient>
        <radialGradient id="faceGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1f1f1f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
        <linearGradient id="strapGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="50%" stopColor="#3d3d3d" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
      </defs>

      {/* strap */}
      <rect x="132" y="0" width="56" height="88" rx="10" fill="url(#strapGrad)" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="132" y="232" width="56" height="88" rx="10" fill="url(#strapGrad)" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="140" y="16" width="40" height="6" rx="3" fill="#151515" opacity="0.6" />
      <rect x="140" y="34" width="40" height="6" rx="3" fill="#151515" opacity="0.6" />
      <rect x="140" y="280" width="40" height="6" rx="3" fill="#151515" opacity="0.6" />
      <rect x="140" y="298" width="40" height="6" rx="3" fill="#151515" opacity="0.6" />

      {/* crown */}
      <rect x="270" y="150" width="18" height="20" rx="3" fill="url(#caseGrad)" stroke="#6b5410" strokeWidth="1.5" />

      {/* case */}
      <circle cx="160" cy="160" r="110" fill="url(#caseGrad)" />
      <circle cx="160" cy="160" r="98" fill="#0a0a0a" stroke="#3a2f0d" strokeWidth="2" />

      {/* face */}
      <circle cx="160" cy="160" r="88" fill="url(#faceGrad)" stroke="#c9a227" strokeWidth="2" />

      {/* hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const outer = 78;
        const inner = i % 3 === 0 ? 62 : 68;
        const x1 = 160 + outer * Math.sin(angle);
        const y1 = 160 - outer * Math.cos(angle);
        const x2 = 160 + inner * Math.sin(angle);
        const y2 = 160 - inner * Math.cos(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8c766" strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />;
      })}

      {/* brand text */}
      <text x="160" y="122" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" letterSpacing="2" fill="#e8c766" opacity="0.85">
        THE DIAL EDIT
      </text>

      {/* hands */}
      <line x1="160" y1="160" x2="160" y2="108" stroke="#f2ede1" strokeWidth="5" strokeLinecap="round" />
      <line x1="160" y1="160" x2="200" y2="178" stroke="#f2ede1" strokeWidth="4" strokeLinecap="round" />
      <line x1="160" y1="160" x2="140" y2="200" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" />
      <circle cx="160" cy="160" r="7" fill="#c9a227" stroke="#f2ede1" strokeWidth="1.5" />
    </svg>
  );
}
