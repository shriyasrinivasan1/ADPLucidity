import React, { useState } from 'react';

const EmotionHeatmap = () => {
  const [hoveredPosition, setHoveredPosition] = useState(null);
  
  const getEmotionFromPosition = (y) => {
    const normalizedY = Math.min(Math.max(y, 0), 100);
    const value = Math.round(100 - normalizedY);
    
    if (value >= 70) return { name: 'Happy', value };
    if (value >= 30) return { name: 'Neutral', value };
    return { name: 'Sad', value };
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoveredPosition(getEmotionFromPosition(y));
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
  };

  return (
    <div className="w-full h-full">  {/* Match parent container dimensions */}
    <h2 className="text-lg font-medium text-gray-900 mb-4 flex flex-col items-center">Team Emotions</h2>
    
    <div 
      className="relative h-[60px] w-full rounded-lg overflow-hidden cursor-pointer"  // Match height of circle cards
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-300 to-blue-400 blur-sm" />
        
        {/* Randomizing overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-transparent blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-400/20 via-orange-300/30 to-red-400/30 blur-sm" />
        <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-gradient-to-br from-red-400/20 to-transparent rotate-45 blur-[2px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-tl from-blue-400/30 to-transparent -rotate-12 blur-[2px]" />
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-to-bl from-orange-300/20 to-transparent rotate-45 blur-[2px]" />
        <div className="absolute bottom-1/3 left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-blue-400/20 to-transparent -rotate-12 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/10 to-transparent blur-[2px]" />
        
        {/* Hover indicator */}
        {hoveredPosition && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              {hoveredPosition.name}: {hoveredPosition.value}%
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-600">Sad</span>
          <span className="text-sm text-orange-600">Neutral</span>
          <span className="text-sm text-red-600">Happy</span>
        </div>
        <div className="relative h-2 w-full mt-1 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-orange-300 to-red-400 blur-[2px]" />
        </div>
      </div>
    </div>
  );
};

export default EmotionHeatmap;