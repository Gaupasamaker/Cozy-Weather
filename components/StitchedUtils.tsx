import React from 'react';

export const StickerPath = ({ 
  d, 
  fillClass, 
  strokeClass, 
  className = "",
  style = {}
}: { d: string, fillClass: string, strokeClass: string, className?: string, style?: React.CSSProperties }) => (
  <g className={className} style={style}>
    {/* Sticker Border (Back) */}
    <path d={d} className="stroke-white fill-white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Main Fabric (Fill) */}
    <path d={d} className={`${fillClass} stroke-none`} />
    
    {/* Embroidery Stitches (Top) */}
    <path 
      d={d} 
      className={`${strokeClass} fill-none`} 
      strokeWidth="2" 
      strokeDasharray="4 3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </g>
);

export const StickerLine = ({ 
  x1, y1, x2, y2, 
  strokeClass, 
  className = "" 
}: { x1: string, y1: string, x2: string, y2: string, strokeClass: string, className?: string }) => (
  <g className={className}>
    {/* Sticker Border */}
    <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-white" strokeWidth="8" strokeLinecap="round" />
    {/* Thread */}
    <line 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      className={strokeClass} 
      strokeWidth="3" 
      strokeDasharray="3 2" 
      strokeLinecap="round" 
    />
  </g>
);

export const StickerCircle = ({ 
  cx, cy, r, 
  fillClass, 
  strokeClass,
  className = ""
}: { cx: string, cy: string, r: string, fillClass: string, strokeClass: string, className?: string }) => (
  <g className={className}>
    <circle cx={cx} cy={cy} r={r} className="stroke-white fill-white" strokeWidth="8" />
    <circle cx={cx} cy={cy} r={r} className={`${fillClass} stroke-none`} />
    <circle 
      cx={cx} cy={cy} r={r} 
      className={`${strokeClass} fill-none`} 
      strokeWidth="2" 
      strokeDasharray="4 3" 
    />
  </g>
);

// Common styles for shadows as an exported string to be injected via dangerouslySetInnerHTML
export const shadowFilter = `
  <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
    <feOffset in="blur" dx="2" dy="4" result="offsetBlur"/>
    <feComponentTransfer in="offsetBlur" result="shadowAlpha">
      <feFuncA type="linear" slope="0.3"/> 
    </feComponentTransfer>
    <feMerge>
      <feMergeNode in="shadowAlpha"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
`;