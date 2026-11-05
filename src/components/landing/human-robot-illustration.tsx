import React from "react";

export function HumanRobotIllustration({ className = "w-44 h-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration of a human recruiter collaborating with an AI assistant"
    >
      {/* Background warm glow pill */}
      <rect x="15" y="20" width="210" height="145" rx="20" fill="#FAF8F5" stroke="#E2DDD5" strokeWidth="1.5" />

      {/* Ambient shadow underneath laptop & figures */}
      <ellipse cx="120" cy="155" rx="85" ry="8" fill="#E8E3DA" fillOpacity="0.8" />

      {/* --- HUMAN RECRUITER (LEFT) --- */}
      {/* Head */}
      <circle cx="78" cy="58" r="16" fill="#F9ECE5" stroke="#242522" strokeWidth="2" />
      {/* Hair */}
      <path
        d="M62 58 C62 44 72 38 84 40 C94 42 96 50 94 56 C90 52 82 52 74 54 C66 56 63 60 62 58 Z"
        fill="#242522"
      />
      {/* Human Eye & Smile */}
      <circle cx="83" cy="57" r="1.5" fill="#242522" />
      <path d="M80 64 Q84 67 87 64" stroke="#242522" strokeWidth="1.5" strokeLinecap="round" />

      {/* Body / Torso */}
      <path
        d="M58 135 L62 90 C62 82 70 78 78 78 C86 78 94 82 94 90 L98 135 Z"
        fill="#FFFFFF"
        stroke="#242522"
        strokeWidth="2"
      />
      {/* Tie / Accent */}
      <path d="M78 78 L80 98 L78 112 L76 98 Z" fill="#D97745" />

      {/* --- AI ROBOT ASSISTANT (RIGHT) --- */}
      {/* Robot Antenna */}
      <line x1="162" y1="36" x2="162" y2="44" stroke="#D97745" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="162" cy="34" r="4" fill="#D97745" />

      {/* Robot Head */}
      <rect
        x="142"
        y="44"
        width="40"
        height="32"
        rx="8"
        fill="#FAF8F5"
        stroke="#242522"
        strokeWidth="2"
      />
      {/* Robot Screen/Face */}
      <rect x="147" y="49" width="30" height="22" rx="4" fill="#242522" />
      {/* Robot Eyes (Glowing Terracotta) */}
      <circle cx="155" cy="59" r="3" fill="#D97745" />
      <circle cx="169" cy="59" r="3" fill="#D97745" />
      {/* Robot Friendly Smile */}
      <path d="M158 65 Q162 67 166 65" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Robot Ears/Bolts */}
      <rect x="138" y="55" width="4" height="10" rx="1.5" fill="#D97745" />
      <rect x="182" y="55" width="4" height="10" rx="1.5" fill="#D97745" />

      {/* Robot Torso */}
      <path
        d="M144 88 C144 82 152 78 162 78 C172 78 180 82 180 88 L184 135 L140 135 Z"
        fill="#FFFFFF"
        stroke="#242522"
        strokeWidth="2"
      />
      {/* Robot Chest Plate Gauge */}
      <rect x="152" y="92" width="20" height="16" rx="3" fill="#F9ECE5" stroke="#ECC9B6" strokeWidth="1.5" />
      <line x1="156" y1="97" x2="168" y2="97" stroke="#D97745" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="156" y1="102" x2="164" y2="102" stroke="#3D784A" strokeWidth="1.5" strokeLinecap="round" />

      {/* --- COLLABORATIVE LAPTOP IN FRONT --- */}
      {/* Laptop Screen */}
      <path
        d="M96 112 L144 112 L140 142 L100 142 Z"
        fill="#FFFFFF"
        stroke="#242522"
        strokeWidth="2"
      />
      <rect x="103" y="117" width="34" height="20" fill="#242522" rx="2" />
      {/* Code/Graph lines on screen */}
      <line x1="107" y1="123" x2="124" y2="123" stroke="#D97745" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="107" y1="128" x2="131" y2="128" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="107" y1="133" x2="119" y2="133" stroke="#3D784A" strokeWidth="1.2" strokeLinecap="round" />

      {/* Laptop Base */}
      <path
        d="M86 142 L154 142 L148 148 L92 148 Z"
        fill="#E8E3DA"
        stroke="#242522"
        strokeWidth="2"
      />

      {/* Sparkle of AI Intelligence */}
      <path
        d="M198 42 L200 48 L206 50 L200 52 L198 58 L196 52 L190 50 L196 48 Z"
        fill="#D97745"
      />
    </svg>
  );
}
