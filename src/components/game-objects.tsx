import React from "react";

interface ObjectProps {
  x: number;
  y: number;
  isHit?: boolean;
  type?: string;
}

export const Bird: React.FC<
  ObjectProps & { isDragging: boolean; onMouseDown: () => void }
> = ({ x, y, isDragging, onMouseDown }) => (
  <div
    className={`absolute w-12 h-12 rounded-full cursor-pointer transition-transform ${
      isDragging ? "cursor-grabbing scale-110" : "cursor-grab hover:scale-105"
    }`}
    style={{
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      backgroundImage:
        "url('https://static.wikia.nocookie.net/angrybirdsfanon/images/9/9b/20190923_110954.png')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))",
    }}
    onMouseDown={onMouseDown}
  />
);

export const Target: React.FC<ObjectProps> = ({ x, y, isHit }) => (
  <div
    className={`absolute w-12 h-12 rounded-full transition-opacity ${
      isHit ? "opacity-50" : "opacity-100"
    }`}
    style={{
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      backgroundImage: isHit
        ? "url('https://static.wikia.nocookie.net/angrybirds/images/2/20/Pig_scared_3.png')"
        : "url('https://static.wikia.nocookie.net/angrybirds/images/0/0a/Piggy_medium.png')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))",
    }}
  />
);

export const Obstacle: React.FC<ObjectProps> = ({ x, y, type }) => (
  <div
    className={`absolute w-14 h-14 rounded-md transition-transform hover:scale-105 ${
      type === "wood" ? "bg-yellow-700" : "bg-blue-300 bg-opacity-80"
    }`}
    style={{
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }}
  />
);
