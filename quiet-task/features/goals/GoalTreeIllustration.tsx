/** 目標 → ステップ → その下、の構造を示すミニ図 */
export function GoalTreeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="goalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 目標 */}
      <circle cx="100" cy="22" r="18" fill="url(#goalGrad)" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="100" cy="22" r="6" fill="#3b82f6" />
      <text x="100" y="52" textAnchor="middle" className="fill-[#737373] text-[10px]">
        目標
      </text>

      {/* 枝 */}
      <path
        d="M 100 40 L 100 58 M 100 58 L 52 58 L 52 72 M 100 58 L 148 58 L 148 72"
        stroke="#d4d4d4"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* ステップ（大） */}
      <rect x="32" y="72" width="40" height="28" rx="8" fill="#fafafa" stroke="#e5e5e5" strokeWidth="1.5" />
      <rect x="36" y="80" width="20" height="3" rx="1.5" fill="#a3a3a3" />
      <rect x="36" y="87" width="28" height="3" rx="1.5" fill="#d4d4d4" />

      <rect x="128" y="72" width="40" height="28" rx="8" fill="#fafafa" stroke="#e5e5e5" strokeWidth="1.5" />
      <rect x="132" y="80" width="20" height="3" rx="1.5" fill="#a3a3a3" />
      <rect x="132" y="87" width="28" height="3" rx="1.5" fill="#d4d4d4" />

      {/* 下のステップ（小） */}
      <path d="M 52 100 L 52 92 L 68 92" stroke="#d4d4d4" strokeWidth="1.5" fill="none" />
      <rect x="68" y="84" width="32" height="22" rx="6" fill="#fff" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="72" y="91" width="18" height="2.5" rx="1" fill="#d4d4d4" />

      <text x="52" y="115" textAnchor="middle" className="fill-[#a3a3a3] text-[9px]">
        ステップ
      </text>
      <text x="148" y="115" textAnchor="middle" className="fill-[#a3a3a3] text-[9px]">
        ステップ
      </text>
      <text x="84" y="115" textAnchor="middle" className="fill-[#a3a3a3] text-[9px]">
        下のステップ
      </text>
    </svg>
  );
}
