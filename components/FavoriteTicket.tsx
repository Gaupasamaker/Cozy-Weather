import React from 'react';

interface FavoriteTicketProps {
  name: string;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
  colorIndex: number;
}

const FavoriteTicket: React.FC<FavoriteTicketProps> = ({ name, onClick, onRemove, colorIndex }) => {
  // Pastel palette for tickets
  const colors = [
    'bg-pink-100 border-pink-200 text-pink-600',
    'bg-blue-100 border-blue-200 text-blue-600',
    'bg-purple-100 border-purple-200 text-purple-600',
    'bg-yellow-100 border-yellow-200 text-yellow-600',
    'bg-green-100 border-green-200 text-green-600',
  ];

  const colorClass = colors[colorIndex % colors.length];

  return (
    <div 
      onClick={onClick}
      className={`relative group flex items-center px-4 py-2 rounded-lg border-2 border-dashed ${colorClass} cursor-pointer transform hover:-translate-y-1 transition-all duration-300 shadow-sm min-w-max select-none`}
    >
      {/* Stitching effect holes */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50"></div>
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50"></div>

      <span className="font-bold text-sm tracking-wide mr-2">{name}</span>
      
      {/* Remove Button (visible on hover or always on touch) */}
      <button 
        onClick={onRemove}
        className="opacity-60 hover:opacity-100 hover:bg-white/50 rounded-full p-0.5 transition-all"
        aria-label="Remove favorite"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
};

export default FavoriteTicket;