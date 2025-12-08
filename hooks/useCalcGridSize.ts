import { useState, useEffect } from 'react';

export const useCalcGridSize = () => {
  const [gridSize, setGridSize] = useState(6);

  // calc grid size
  useEffect(() => {
    const event = () => {
      setGridSize(Math.floor((window.innerWidth - 50) / 245));
    };
    event();
    window.addEventListener('resize', event);
    return () => {
      window.removeEventListener('resize', event);
    };
  }, []);

  return { gridSize };
};
