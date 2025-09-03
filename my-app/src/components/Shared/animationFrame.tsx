import React, { useState, useEffect } from "react";

const LoopAnimation: React.FC = () => {
  const [frame, setFrame] = useState(0);

  const frames = [
    "/frame1.png",
    "/frame1-2.jpg",
    "/frame2.png",
    "/frame3.png",
    "/frame4.jpg",
    "/frame5.jpg",
    "/frame6.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 300); 
    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden shadow-xl mx-auto mt-10">
      <img
        src={frames[frame]}
        alt={`Frame ${frame}`}
        className="w-full h-full object-cover rounded-full transition-all duration-500 ease-in-out"
      />
    </div>
  );
};

export default LoopAnimation;
