import React, { useMemo } from 'react';

export const ProgressCircle = ({ percentage, color = 'purple' }) => {
  const { radius, circumference, strokeDashoffset } = useMemo(() => {
    const r = 40;
    const c = 2 * Math.PI * r;
    // Calculate the offset based on the percentage (reversed because of SVG rotation)
    const offset = ((100 - percentage) / 100) * c;
    return {
      radius: r,
      circumference: c,
      strokeDashoffset: offset
    };
  }, [percentage]);

  const progressStyle = useMemo(() => ({
    strokeDasharray: circumference,
    strokeDashoffset: strokeDashoffset,
    transition: 'stroke-dashoffset 0.3s ease'
  }), [circumference, strokeDashoffset]);

  const backgroundCircleStyle = useMemo(() => ({
    strokeDasharray: circumference,
    strokeDashoffset: 0
  }), [circumference]);

  const getGradientColors = () => {
    switch(color) {
      case 'blue':
        return { start: '#60A5FA', end: '#3B82F6' };
      case 'green':
        return { start: '#34D399', end: '#10B981' };
      default:
        return { start: '#C084FC', end: '#818CF8' }; // purple default
    }
  };

  const { start, end } = getGradientColors();

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className={`text-${color}-900/30`}
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
          style={backgroundCircleStyle}
        />
        <circle
          className={`text-gradient-to-r from-${color}-400 to-${color}-500`}
          strokeWidth="8"
          strokeLinecap="round"
          stroke={`url(#gradient-${color})`}
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
          style={progressStyle}
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-semibold text-${color}-200`}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};