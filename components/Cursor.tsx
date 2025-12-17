import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import useMousePosition from '../hooks/useMousePosition';

const Cursor: React.FC = () => {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth spring animation for the cursor
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    cursorX.set(x - (isHovering ? 32 : 8));
    cursorY.set(y - (isHovering ? 32 : 8));
  }, [x, y, isHovering, cursorX, cursorY]);

  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add listeners for hover effects on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          x: x - 4,
          y: y - 4,
          width: 8,
          height: 8,
        }}
      />
      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-[#8A2BE2] rounded-full pointer-events-none z-[90]"
        style={{
          x: cursorX,
          y: cursorY,
          width: isHovering ? 64 : 16,
          height: isHovering ? 64 : 16,
          opacity: 0.6,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
            type: "spring",
            damping: 20,
            stiffness: 300
        }}
      />
    </>
  );
};

export default Cursor;