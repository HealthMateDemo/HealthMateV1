import React from "react";
import { motion } from "framer-motion";

interface AnimatedCloudProps {
  className?: string;
  delay?: number;
  duration?: number;
  xRange?: [number, number, number];
  yRange?: [number, number, number];
}

const AnimatedCloud: React.FC<AnimatedCloudProps> = ({
  className = "",
  delay = 0,
  duration = 8,
  xRange = [0, 30, 0],
  yRange = [0, -10, 0]
}) => {
  return (
    <motion.div
      className={`bg-white/40 rounded-full ${className}`}
      animate={{ 
        x: xRange, 
        y: yRange 
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default AnimatedCloud; 