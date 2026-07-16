import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  inverse?: boolean;
}

export default function Logo({ className = '', iconOnly = false, inverse = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic SVG Icon matching the User's Image precisely */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Exact color gradient matching the uploaded MoneyMarketCap logo */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5c2a" />
            <stop offset="35%" stopColor="#d1259a" />
            <stop offset="70%" stopColor="#8a1be5" />
            <stop offset="100%" stopColor="#241ecc" />
          </linearGradient>
        </defs>

        {/* Outer Circular Gradient Border - Upper-Left Arc */}
        <path
          d="M 21 74 A 38 38 0 0 1 74 21"
          stroke="url(#logoGradient)"
          strokeWidth="8.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Outer Circular Gradient Border - Lower-Right Arc */}
        <path
          d="M 87 43 A 38 38 0 0 1 43 87"
          stroke="url(#logoGradient)"
          strokeWidth="8.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inside rising trend line wave */}
        <path
          d="M 22 68 
             C 24 45, 30 45, 34 52
             C 38 59, 41 65, 45 56
             C 49 47, 53 45, 57 52
             C 61 59, 66 65, 75 41"
          stroke="url(#logoGradient)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrowhead at the end of the trend line pointing up-right */}
        <path
          d="M 63 41 L 75 41 L 75 53"
          stroke="url(#logoGradient)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {!iconOnly && (
        <span className="font-display tracking-tight text-2xl font-black bg-gradient-to-r from-[#ff5c2a] via-[#d1259a] via-[#8a1be5] to-[#241ecc] bg-clip-text text-transparent">
          MoneyMarketCap
        </span>
      )}
    </div>
  );
}
