import React from 'react';

/**
 * High-fidelity Vector Artworks crafted to match the exact visual identity
 * of "Saúde em Prática: Matemática, Alimentação e Movimento"
 */

// Mascot Robot CETi
export const CetiRobot: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 110,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="bodyGrad" x1="80" y1="50" x2="80" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.7" stopColor="#E2E8F0" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="80" y1="65" x2="80" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F172A" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="glowCyan" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
      <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Green leaf sprout antenna on top */}
    <path
      d="M80 44 C80 32 72 20 62 18 C64 28 72 38 78 43"
      fill="#22C55E"
      stroke="#16A34A"
      strokeWidth="1.5"
    />
    <path
      d="M80 44 C82 30 94 22 102 24 C98 34 88 40 81 44"
      fill="#4ADE80"
      stroke="#16A34A"
      strokeWidth="1.5"
    />
    <circle cx="80" cy="44" r="3.5" fill="#0284C7" />

    {/* Robot Head (Rounded Pill) */}
    <rect
      x="35"
      y="48"
      width="90"
      height="64"
      rx="24"
      fill="url(#bodyGrad)"
      stroke="#0284C7"
      strokeWidth="3.5"
    />

    {/* Ear Nodes */}
    <rect x="25" y="66" width="10" height="24" rx="5" fill="#0284C7" />
    <circle cx="30" cy="78" r="2.5" fill="#38BDF8" />
    <rect x="125" y="66" width="10" height="24" rx="5" fill="#0284C7" />
    <circle cx="130" cy="78" r="2.5" fill="#38BDF8" />

    {/* Screen Face */}
    <rect
      x="45"
      y="57"
      width="70"
      height="46"
      rx="14"
      fill="url(#screenGrad)"
      stroke="#0F172A"
      strokeWidth="2"
    />

    {/* Glowing Blue Digital Eyes (Cute Arc Smileys) */}
    <g filter="url(#eyeGlow)">
      {/* Left eye arc */}
      <path
        d="M56 78 C56 71 63 71 67 78"
        stroke="#38BDF8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Right eye arc */}
      <path
        d="M93 78 C93 71 100 71 104 78"
        stroke="#38BDF8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Happy small mouth arc */}
      <path
        d="M74 88 Q80 94 86 88"
        stroke="#38BDF8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>

    {/* Neck */}
    <rect x="70" y="112" width="20" height="8" rx="3" fill="#0284C7" />

    {/* Torso */}
    <rect
      x="44"
      y="118"
      width="72"
      height="36"
      rx="14"
      fill="url(#bodyGrad)"
      stroke="#0284C7"
      strokeWidth="3"
    />

    {/* Chest Emblem: CETi */}
    <rect x="58" y="126" width="44" height="18" rx="6" fill="#0284C7" />
    <text
      x="80"
      y="139"
      textAnchor="middle"
      fill="#FFFFFF"
      fontWeight="900"
      fontSize="11"
      fontFamily="sans-serif"
      letterSpacing="0.5"
    >
      CETi
    </text>

    {/* Left Arm Waving */}
    <path
      d="M44 125 C30 118 20 100 24 88 C26 84 32 86 32 90 C30 98 38 110 44 116"
      fill="#CBD5E1"
      stroke="#0284C7"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="86" r="6" fill="#0284C7" />

    {/* Right Arm Relaxed */}
    <path
      d="M116 125 C128 132 138 138 142 144"
      stroke="#0284C7"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

// Diverse 4 Students Artwork for "Peso e Saúde"
export const DiverseStudentsIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 340 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto ${className}`}
  >
    <defs>
      <linearGradient id="bgLight" x1="0" y1="0" x2="340" y2="190" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" />
        <stop offset="1" stopColor="#BAE6FD" />
      </linearGradient>
    </defs>

    {/* Background Soft Bubble */}
    <rect width="340" height="190" rx="16" fill="url(#bgLight)" opacity="0.6" />

    {/* Student 1 (Boy with Green Hoodie on Left) */}
    <g transform="translate(18, 24)">
      {/* Hair */}
      <path d="M28 22 C22 10 38 4 52 10 C62 14 66 26 64 34 C58 36 28 32 28 22Z" fill="#3E2723" />
      {/* Face */}
      <circle cx="45" cy="32" r="18" fill="#FBCFE8" />
      {/* Eyes & Smile */}
      <circle cx="39" cy="30" r="2.5" fill="#1E293B" />
      <circle cx="51" cy="30" r="2.5" fill="#1E293B" />
      <path d="M41 38 Q45 43 49 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      {/* Green Hoodie Body */}
      <path
        d="M20 70 C22 52 32 46 45 46 C58 46 68 52 70 70 C70 95 20 95 20 70Z"
        fill="#15803D"
      />
      {/* White Strings */}
      <line x1="42" y1="48" x2="40" y2="64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="48" x2="50" y2="64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Student 2 (Girl with Dark Curls & Yellow Headband) */}
    <g transform="translate(85, 12)">
      {/* Curly Dark Hair */}
      <circle cx="48" cy="38" r="26" fill="#171717" />
      <circle cx="28" cy="40" r="14" fill="#171717" />
      <circle cx="68" cy="40" r="14" fill="#171717" />
      {/* Yellow Headband */}
      <path d="M26 30 C36 18 60 18 70 30" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
      {/* Face (Deep warm skin tone) */}
      <circle cx="48" cy="40" r="18" fill="#9A3412" />
      {/* Warm facial details */}
      <circle cx="42" cy="38" r="2.5" fill="#FEF3C7" />
      <circle cx="54" cy="38" r="2.5" fill="#FEF3C7" />
      <path d="M43 47 Q48 53 53 47" stroke="#FEF3C7" strokeWidth="2.2" strokeLinecap="round" />
      {/* Yellow / Golden Shirt */}
      <path
        d="M24 82 C28 62 38 56 48 56 C58 56 68 62 72 82 C72 105 24 105 24 82Z"
        fill="#EAB308"
      />
    </g>

    {/* Student 3 (Boy with Glasses and Blue Shirt) */}
    <g transform="translate(165, 18)">
      {/* Hair */}
      <path d="M30 20 C34 10 54 8 62 18 C66 24 64 32 60 36 C48 38 32 34 30 20Z" fill="#292524" />
      {/* Face */}
      <circle cx="46" cy="34" r="18" fill="#FED7AA" />
      {/* Glasses */}
      <rect x="34" y="27" width="10" height="9" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="48" y="27" width="10" height="9" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <line x1="44" y1="31" x2="48" y2="31" stroke="#1E293B" strokeWidth="2" />
      {/* Smile */}
      <path d="M41 42 Q46 47 51 42" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      {/* Blue Shirt */}
      <path
        d="M22 75 C24 56 34 50 46 50 C58 50 68 56 70 75 C70 98 22 98 22 75Z"
        fill="#2563EB"
      />
    </g>

    {/* Student 4 (Girl with Purple Shirt on Right) */}
    <g transform="translate(235, 24)">
      {/* Hair (Long Brown) */}
      <path d="M26 24 C30 8 52 8 60 22 C66 34 66 58 64 64 C56 50 42 42 26 24Z" fill="#592A14" />
      <path d="M22 36 C22 56 24 66 28 72" stroke="#592A14" strokeWidth="7" strokeLinecap="round" />
      {/* Face */}
      <circle cx="44" cy="33" r="18" fill="#FDE047" opacity="0.4" />
      <circle cx="44" cy="33" r="18" fill="#FED7AA" />
      {/* Eyes & Smile */}
      <circle cx="38" cy="31" r="2.5" fill="#1E293B" />
      <circle cx="50" cy="31" r="2.5" fill="#1E293B" />
      <path d="M40 40 Q44 45 48 40" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      {/* Purple Shirt */}
      <path
        d="M20 72 C22 54 32 48 44 48 C56 48 66 54 68 72 C68 96 20 96 20 72Z"
        fill="#7C3AED"
      />
    </g>
  </svg>
);

// Diverse Youth Moving in Park for "Semana Ativa" (including wheelchair racer)
export const ActiveYouthIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 340 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto ${className}`}
  >
    <defs>
      <linearGradient id="skyParkGrad" x1="0" y1="0" x2="0" y2="190" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" />
        <stop offset="0.7" stopColor="#DCFCE7" />
        <stop offset="1" stopColor="#86EFAC" />
      </linearGradient>
    </defs>

    {/* Background Park Ground */}
    <rect width="340" height="190" rx="16" fill="url(#skyParkGrad)" />

    {/* Distant Trees & Path */}
    <path d="M0 145 Q90 120 180 135 T340 140 L340 190 L0 190 Z" fill="#BBF7D0" />
    <circle cx="30" cy="115" r="28" fill="#86EFAC" opacity="0.6" />
    <circle cx="310" cy="110" r="32" fill="#86EFAC" opacity="0.6" />

    {/* Runner 1 (Boy in Green Hoodie Running on Left) */}
    <g transform="translate(15, 35)">
      {/* Head */}
      <circle cx="28" cy="22" r="14" fill="#FED7AA" />
      <path d="M16 16 C20 8 38 8 40 16 C42 22 38 28 36 28 C26 26 18 22 16 16Z" fill="#3E2723" />
      {/* Green Hoodie Torso leaning forward */}
      <path d="M14 36 L38 32 L44 65 L20 68 Z" fill="#15803D" />
      {/* Running legs */}
      <line x1="22" y1="68" x2="8" y2="98" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <line x1="38" y1="65" x2="52" y2="92" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <line x1="52" y1="92" x2="62" y2="86" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
    </g>

    {/* Runner 2 (Girl in Pink Jogging) */}
    <g transform="translate(75, 25)">
      {/* Dark curly hair */}
      <circle cx="32" cy="26" r="18" fill="#171717" />
      {/* Head */}
      <circle cx="32" cy="28" r="13" fill="#9A3412" />
      {/* Pink Shirt */}
      <path d="M18 42 L42 40 L46 72 L22 74 Z" fill="#DB2777" />
      {/* Running legs */}
      <line x1="26" y1="74" x2="16" y2="104" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
      <line x1="40" y1="72" x2="48" y2="96" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    </g>

    {/* Athlete in Sports Wheelchair (Center Right, Arm Raised Celebrating!) */}
    <g transform="translate(150, 40)">
      {/* Wheelchair Big Wheel */}
      <circle cx="35" cy="72" r="30" stroke="#0284C7" strokeWidth="5" fill="#E0F2FE" />
      <circle cx="35" cy="72" r="6" fill="#0284C7" />
      {/* Spokes */}
      <line x1="35" y1="42" x2="35" y2="102" stroke="#0284C7" strokeWidth="2" />
      <line x1="5" y1="72" x2="65" y2="72" stroke="#0284C7" strokeWidth="2" />
      <line x1="14" y1="51" x2="56" y2="93" stroke="#0284C7" strokeWidth="2" />
      <line x1="14" y1="93" x2="56" y2="51" stroke="#0284C7" strokeWidth="2" />

      {/* Frame & Seat */}
      <path d="M22 62 L48 64 L54 84" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />

      {/* Boy in Blue Shirt Sitting & Pumping Arm Up */}
      <circle cx="44" cy="24" r="14" fill="#FED7AA" />
      <path d="M32 18 C36 8 54 8 58 18 C58 24 50 28 44 28 C34 26 32 20 32 18Z" fill="#1C1917" />
      {/* Blue Torso */}
      <rect x="34" y="38" width="22" height="26" rx="6" fill="#2563EB" />
      {/* Raised Arm (Celebrating!) */}
      <path d="M50 42 L66 22 L72 12" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
      <circle cx="73" cy="11" r="5" fill="#FED7AA" />
    </g>

    {/* Runner 4 (Girl in Purple with Headphones Jogging on Far Right) */}
    <g transform="translate(245, 42)">
      {/* Long hair */}
      <path d="M20 20 C24 8 46 8 50 20 C54 32 54 52 50 56 C42 42 34 38 20 20Z" fill="#451A03" />
      {/* Face */}
      <circle cx="34" cy="24" r="13" fill="#FED7AA" />
      {/* Headphones */}
      <path d="M23 20 C23 10 45 10 45 20" stroke="#0F766E" strokeWidth="3" fill="none" />
      <rect x="20" y="18" width="5" height="10" rx="2" fill="#0F766E" />
      <rect x="43" y="18" width="5" height="10" rx="2" fill="#0F766E" />
      {/* Purple Shirt */}
      <path d="M22 38 L44 36 L48 66 L26 68 Z" fill="#9333EA" />
      {/* Jogging legs */}
      <line x1="28" y1="68" x2="20" y2="94" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
      <line x1="42" y1="66" x2="52" y2="88" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    </g>

    {/* Green Badge Sticker: "MOVIMENTO INCLUI TODOS!" */}
    <g transform="translate(200, 95)">
      <rect
        x="0"
        y="0"
        width="130"
        height="28"
        rx="8"
        fill="#065F46"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <text
        x="65"
        y="18"
        textAnchor="middle"
        fill="#FFFFFF"
        fontWeight="900"
        fontSize="9.5"
        fontFamily="sans-serif"
        letterSpacing="0.4"
      >
        MOVIMENTO INCLUI TODOS!
      </text>
    </g>
  </svg>
);

// 3D-styled Blue Calculator Icon/Graphic
export const Calculator3D: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Body Shadow */}
    <rect x="14" y="16" width="52" height="58" rx="14" fill="#1E3A8A" />
    {/* Main Blue Body */}
    <rect x="14" y="12" width="52" height="58" rx="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
    {/* Screen */}
    <rect x="20" y="18" width="40" height="14" rx="4" fill="#0F172A" />
    <text x="56" y="29" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="end">
      23.5
    </text>

    {/* Buttons Grid */}
    <rect x="21" y="38" width="10" height="8" rx="2" fill="#DBEAFE" />
    <rect x="35" y="38" width="10" height="8" rx="2" fill="#DBEAFE" />
    <rect x="49" y="38" width="10" height="8" rx="2" fill="#F59E0B" />

    <rect x="21" y="49" width="10" height="8" rx="2" fill="#DBEAFE" />
    <rect x="35" y="49" width="10" height="8" rx="2" fill="#DBEAFE" />
    <rect x="49" y="49" width="10" height="8" rx="2" fill="#10B981" />

    <rect x="21" y="60" width="10" height="7" rx="2" fill="#DBEAFE" />
    <rect x="35" y="60" width="24" height="7" rx="2" fill="#2563EB" />
  </svg>
);

// Yellow Tape Measure Roll Graphic
export const MeasuringTapeGraphic: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 56,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Tape Roll Base */}
    <circle cx="35" cy="38" r="26" fill="#D97706" />
    <circle cx="35" cy="35" r="26" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    <circle cx="35" cy="35" r="14" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="35" cy="35" r="5" fill="#92400E" />

    {/* Unrolled strip extending */}
    <path d="M50 48 L65 52 L62 58 L46 54 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
    {/* Tick marks */}
    <line x1="53" y1="49" x2="52" y2="52" stroke="#92400E" strokeWidth="1.5" />
    <line x1="57" y1="50" x2="56" y2="53" stroke="#92400E" strokeWidth="1.5" />
    <line x1="61" y1="51" x2="60" y2="54" stroke="#92400E" strokeWidth="1.5" />
  </svg>
);

// Spiral Checklist Notepad Graphic
export const SpiralNotepadGraphic: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 110,
}) => (
  <svg
    width={size}
    height={size * 1.05}
    viewBox="0 0 110 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Paper Shadow */}
    <rect x="18" y="14" width="80" height="92" rx="8" fill="#CBD5E1" />
    {/* Paper Sheet */}
    <rect x="16" y="10" width="80" height="92" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

    {/* Spiral Rings */}
    {[22, 34, 46, 58, 70, 82].map((x) => (
      <g key={x}>
        <rect x={x - 2} y="7" width="4" height="8" rx="2" fill="#94A3B8" />
        <circle cx={x} cy="14" r="2.5" fill="#475569" />
      </g>
    ))}

    {/* Lines with Checked Boxes */}
    {[
      { label: 'Calcule', y: 32 },
      { label: 'Compare', y: 50 },
      { label: 'Reflita', y: 68 },
      { label: 'Aprenda', y: 86 },
    ].map((item, idx) => (
      <g key={idx} transform={`translate(26, ${item.y})`}>
        {/* Checkbox */}
        <rect x="0" y="0" width="12" height="12" rx="3" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        {/* Checkmark */}
        <path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Label */}
        <text x="18" y="10" fill="#1E293B" fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
          {item.label}
        </text>
      </g>
    ))}
  </svg>
);
