import React, { useEffect, useRef, useState } from "react";
import { Bird, Target, Obstacle } from "./components/game-objects";
import { checkCollision, calculateTrajectory } from "./utils/game-utils";
import { generateLevelLayout } from "./utils/level-generator";

const AngryBirdsGame: React.FC = () => {
  const [birdPosition, setBirdPosition] = useState({ x: 200, y: 400 });
  const [birdVelocity, setBirdVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [shotsLeft, setShotsLeft] = useState(3);
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const [objects, setObjects] = useState([]);
  const [targets, setTargets] = useState([]);
  const animationRef = useRef<number>();

  const audioRef = useRef(
    new Audio(
      "https://kappa.vgmsite.com/soundtracks/angry-birds/mskxllhbbp/25.%20Main%20Theme.mp3"
    )
  );

  useEffect(() => {
    audioRef.current.loop = true;
    const playAudio = () => {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    };
    document.addEventListener("click", playAudio, { once: true });
    return () => {
      audioRef.current.pause();
      document.removeEventListener("click", playAudio);
    };
  }, []);

  useEffect(() => {
    const layout = generateLevelLayout(level);
    setTargets(layout.targets);
    setObjects(layout.obstacles);
  }, [level]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gameStarted && shotsLeft > 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      const maxDrag = 200;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance > maxDrag ? maxDrag / distance : 1;

      const newX = 200 + dx * scale;
      const newY = 400 + dy * scale;

      setBirdPosition({
        x: newX,
        y: newY,
      });

      const velocityX = -(newX - 200) * 0.2;
      const velocityY = -(newY - 400) * 0.2;
      const trajectoryPoints = calculateTrajectory(
        newX,
        newY,
        velocityX,
        velocityY
      );
      setTrajectoryPoints(trajectoryPoints);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const dx = birdPosition.x - 200;
      const dy = birdPosition.y - 400;

      setBirdVelocity({
        x: -dx * 0.2,
        y: -dy * 0.2,
      });

      setIsDragging(false);
      setGameStarted(true);
      setShotsLeft((prev) => prev - 1);
      setTrajectoryPoints([]);
    }
  };

  const handleObjectPhysics = (object: any, birdX: number, birdY: number) => {
    if (!object.isHit) {
      const dx = object.x - birdX;
      const dy = object.y - birdY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 40) {
        const force = object.type === "glass" ? 2 : 1;
        return {
          ...object,
          isHit: true,
          velocityX: (dx / distance) * 10 * force,
          velocityY: (dy / distance) * 10 * force - 5,
        };
      }
    } else if (object.velocityX || object.velocityY) {
      return {
        ...object,
        x: object.x + object.velocityX,
        y: object.y + object.velocityY,
        velocityY: object.velocityY + 0.5,
        velocityX: object.velocityX * 0.99,
      };
    }
    return object;
  };

  useEffect(() => {
    const updateGame = () => {
      if (gameStarted) {
        setBirdPosition((prev) => ({
          x: prev.x + birdVelocity.x,
          y: prev.y + birdVelocity.y,
        }));

        setBirdVelocity((prev) => ({
          x: prev.x * 0.99,
          y: prev.y * 0.99 + 0.5,
        }));

        setObjects((prev) => {
          const updatedObjects = prev.map((obj) =>
            handleObjectPhysics(obj, birdPosition.x, birdPosition.y)
          );

          updatedObjects.forEach((obj) => {
            if (obj.isHit && (obj.velocityX || obj.velocityY)) {
              setTargets((prevTargets) =>
                prevTargets.map((target) => {
                  if (
                    !target.isHit &&
                    checkCollision(obj.x, obj.y, target.x, target.y)
                  ) {
                    setScore((s) => s + 100);
                    return { ...target, isHit: true };
                  }
                  return target;
                })
              );
            }
          });

          return updatedObjects;
        });

        setTargets((prev) =>
          prev.map((target) => {
            if (
              !target.isHit &&
              checkCollision(birdPosition.x, birdPosition.y, target.x, target.y)
            ) {
              setScore((s) => s + 100);
              return { ...target, isHit: true };
            }
            return target;
          })
        );

        const allTargetsHit = targets.every((t) => t.isHit);
        const outOfBounds =
          birdPosition.y > 600 || birdPosition.x > 1000 || birdPosition.x < 0;

        if (outOfBounds) {
          if (shotsLeft === 0 && !allTargetsHit) {
            setScore((s) => Math.max(0, s - targets.length * 50));

            const layout = generateLevelLayout(level);
            setTargets(layout.targets);
            setObjects(layout.obstacles);
            setBirdPosition({ x: 200, y: 400 });
            setBirdVelocity({ x: 0, y: 0 });
            setGameStarted(false);
            setShotsLeft(3);
          } else {
            setGameStarted(false);
            setBirdPosition({ x: 200, y: 400 });
            setBirdVelocity({ x: 0, y: 0 });
          }
        }

        if (allTargetsHit) {
          setTimeout(() => {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            setBirdPosition({ x: 200, y: 400 });
            setBirdVelocity({ x: 0, y: 0 });
            setGameStarted(false);
            setShotsLeft(3);
            const newLayout = generateLevelLayout(nextLevel);
            setTargets(newLayout.targets);
            setObjects(newLayout.obstacles);
          }, 2000);
        }
      }
      animationRef.current = requestAnimationFrame(updateGame);
    };

    animationRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameStarted, birdVelocity, targets]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-300 to-blue-500"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/2c/24/ba/2c24ba2e0e1a2455cccc366a96efcbf0.jpg')",
          filter: "blur(3px)",
        }}
      />

      <div className="relative z-10">
        <h1 className="text-center pt-4 text-4xl font-bold text-white shadow-lg">
          Angry Birds Game
        </h1>

        <div className="absolute top-4 left-4 space-y-2 bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-800">Level: {level}</div>
          <div className="text-2xl font-bold text-green-700">
            Score: {score}
          </div>
          <div className="text-2xl font-bold text-red-600">
            Shots Left: {shotsLeft}
          </div>
        </div>

        {trajectoryPoints.map((point, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: point.x,
              top: point.y,
              opacity: 1 - index / trajectoryPoints.length,
            }}
          />
        ))}

        <Bird
          x={birdPosition.x}
          y={birdPosition.y}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
        />

        {targets.map((target) => (
          <Target
            key={target.id}
            x={target.x}
            y={target.y}
            isHit={target.isHit}
          />
        ))}

        {objects.map((object) => (
          <Obstacle
            key={object.id}
            x={object.x}
            y={object.y}
            type={object.type}
          />
        ))}

        {!gameStarted && !isDragging && shotsLeft > 0 && (
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <p className="text-3xl font-bold mb-4 text-blue-800">
              Level {level}
            </p>
            <p className="mb-2 text-lg text-gray-700">
              Drag the bird to launch!
            </p>
            <p className="text-lg text-gray-700">Hit all targets to advance</p>
            {level === 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  💡 Tip: Use wood and glass objects to hit multiple targets!
                </p>
                <p>🎯 Wood blocks move slower but are more sturdy</p>
                <p>✨ Glass shatters easily but flies faster</p>
              </div>
            )}
          </div>
        )}

        {targets.every((t) => t.isHit) && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-green-600">
              Level Complete!
            </h2>
            <p className="mb-4 text-xl text-gray-700">
              Moving to Level {level + 1}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AngryBirdsGame;
