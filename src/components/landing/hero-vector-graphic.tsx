import React from "react";

export function HeroVectorGraphic() {
  return (
    <div
      className="absolute top-0 right-0 w-full max-w-[620px] lg:max-w-[740px] xl:max-w-[840px] h-[480px] sm:h-[560px] pointer-events-none select-none overflow-hidden -z-0 opacity-80 sm:opacity-95"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 740 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-right-top"
        preserveAspectRatio="xMaxYMin meet"
      >
        <defs>
          {/* Subtle gradient for primary connecting paths */}
          <linearGradient id="vectorLineGrad" x1="100" y1="50" x2="680" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D97745" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#D97745" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#C46332" stopOpacity="0.3" />
          </linearGradient>

          {/* Radial glow for hero nodes */}
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D97745" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D97745" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background node halos */}
        <circle cx="505" cy="275" r="48" fill="url(#nodeGlow)" />
        <circle cx="630" cy="205" r="36" fill="url(#nodeGlow)" />
        <circle cx="380" cy="235" r="40" fill="url(#nodeGlow)" />

        {/* Connecting Network Lines matching wireframe geometry */}
        {/* Main upper constellation branches */}
        <line x1="380" y1="235" x2="505" y2="275" stroke="#D97745" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="505" y1="275" x2="630" y2="205" stroke="#D97745" strokeWidth="1.75" strokeOpacity="0.6" />
        <line x1="505" y1="275" x2="560" y2="390" stroke="#D97745" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="630" y1="205" x2="710" y2="265" stroke="#D97745" strokeWidth="1.25" strokeOpacity="0.4" />
        <line x1="560" y1="390" x2="675" y2="360" stroke="#D97745" strokeWidth="1.5" strokeOpacity="0.45" />
        <line x1="630" y1="205" x2="675" y2="360" stroke="#D97745" strokeWidth="1.25" strokeOpacity="0.35" />

        {/* Radiating branches towards the hero mockup & edges */}
        <line x1="380" y1="235" x2="310" y2="340" stroke="#D97745" strokeWidth="1.25" strokeOpacity="0.35" />
        <line x1="310" y1="340" x2="420" y2="445" stroke="#D97745" strokeWidth="1.25" strokeOpacity="0.3" strokeDasharray="4 4" />
        <line x1="420" y1="445" x2="560" y2="390" stroke="#D97745" strokeWidth="1.25" strokeOpacity="0.35" />
        <line x1="505" y1="275" x2="445" y2="155" stroke="#D97745" strokeWidth="1.2" strokeOpacity="0.3" />
        <line x1="445" y1="155" x2="545" y2="95" stroke="#D97745" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="3 3" />
        <line x1="630" y1="205" x2="650" y2="90" stroke="#D97745" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />

        {/* Subtle horizontal marker accents per wireframe R01 / landing.jpeg */}
        <g stroke="#D97745" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45">
          <line x1="465" y1="230" x2="485" y2="230" />
          <line x1="465" y1="236" x2="480" y2="236" />

          <line x1="660" y1="235" x2="680" y2="235" />
          <line x1="660" y1="241" x2="676" y2="241" />

          <line x1="600" y1="415" x2="624" y2="415" strokeOpacity="0.3" />
          <line x1="600" y1="421" x2="618" y2="421" strokeOpacity="0.3" />
        </g>

        {/* Nodes - Circles with borders and warm fills */}
        {/* Central Hub Node */}
        <circle cx="505" cy="275" r="13" fill="#D97745" />
        <circle cx="505" cy="275" r="22" stroke="#D97745" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="505" cy="275" r="6" fill="#F5F2EC" />

        {/* Upper Right Primary Node */}
        <circle cx="630" cy="205" r="10" fill="#D97745" />
        <circle cx="630" cy="205" r="18" stroke="#D97745" strokeWidth="1.25" strokeOpacity="0.35" strokeDasharray="2 3" />

        {/* Mid-Left Supporting Node */}
        <circle cx="380" cy="235" r="8" fill="#ECC9B6" stroke="#D97745" strokeWidth="2" />

        {/* Lower Hub Node */}
        <circle cx="560" cy="390" r="9" fill="#D97745" />
        <circle cx="560" cy="390" r="15" stroke="#D97745" strokeWidth="1" strokeOpacity="0.4" />

        {/* Far Right Lower Node */}
        <circle cx="675" cy="360" r="7" fill="#F9ECE5" stroke="#D97745" strokeWidth="1.75" />

        {/* Outer Perimeter Micro-Nodes */}
        <circle cx="710" cy="265" r="4.5" fill="#D97745" fillOpacity="0.65" />
        <circle cx="310" cy="340" r="5" fill="#ECC9B6" stroke="#D97745" strokeWidth="1.5" />
        <circle cx="420" cy="445" r="4" fill="#D97745" fillOpacity="0.5" />
        <circle cx="445" cy="155" r="4" fill="#D97745" fillOpacity="0.4" />
        <circle cx="545" cy="95" r="3.5" fill="#ECC9B6" />
        <circle cx="650" cy="90" r="3" fill="#D97745" fillOpacity="0.4" />

        {/* Tiny constellation dust particles */}
        <circle cx="470" cy="310" r="2" fill="#D97745" fillOpacity="0.4" />
        <circle cx="575" cy="245" r="2.5" fill="#D97745" fillOpacity="0.5" />
        <circle cx="620" cy="305" r="2" fill="#D97745" fillOpacity="0.35" />
        <circle cx="530" cy="340" r="1.5" fill="#D97745" fillOpacity="0.3" />
        <circle cx="350" cy="270" r="2" fill="#D97745" fillOpacity="0.35" />
      </svg>
    </div>
  );
}
