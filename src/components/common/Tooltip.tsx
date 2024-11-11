import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: '-translate-x-1/2 -translate-y-full left-1/2 bottom-[calc(100%+5px)]',
    right: 'translate-y-[-50%] left-[calc(100%+5px)] top-1/2',
    bottom: '-translate-x-1/2 translate-y-full left-1/2 top-[calc(100%+5px)]',
    left: 'translate-y-[-50%] right-[calc(100%+5px)] top-1/2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap ${positions[position]}`}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};