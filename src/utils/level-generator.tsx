interface GameObject {
  id: string;
  x: number;
  y: number;
  isHit: boolean;
  type?: string;
}

export const generateLevelLayout = (
  level: number
): { targets: GameObject[]; obstacles: GameObject[] } => {
  const targets: GameObject[] = [];
  const obstacles: GameObject[] = [];

  switch (level) {
    case 0:
      // Tutorial level - simple layout
      targets.push(
        { id: "t1", x: 700, y: 400, isHit: false },
        { id: "t2", x: 800, y: 400, isHit: false },
        { id: "t3", x: 750, y: 300, isHit: false }
      );
      obstacles.push(
        { id: "o1", x: 650, y: 400, type: "wood", isHit: false },
        { id: "o2", x: 650, y: 350, type: "glass", isHit: false }
      );
      break;
    case 1:
      // Pyramid formation
      targets.push(
        { id: "t1", x: 750, y: 400, isHit: false },
        { id: "t2", x: 700, y: 350, isHit: false },
        { id: "t3", x: 800, y: 350, isHit: false },
        { id: "t4", x: 750, y: 300, isHit: false }
      );
      obstacles.push(
        { id: "o1", x: 650, y: 400, type: "wood", isHit: false },
        { id: "o2", x: 850, y: 400, type: "wood", isHit: false },
        { id: "o3", x: 750, y: 250, type: "glass", isHit: false }
      );
      break;
    case 2:
      // Two towers
      targets.push(
        { id: "t1", x: 600, y: 400, isHit: false },
        { id: "t2", x: 600, y: 300, isHit: false },
        { id: "t3", x: 800, y: 400, isHit: false },
        { id: "t4", x: 800, y: 300, isHit: false }
      );
      obstacles.push(
        { id: "o1", x: 600, y: 350, type: "glass", isHit: false },
        { id: "o2", x: 800, y: 350, type: "wood", isHit: false },
        { id: "o3", x: 700, y: 400, type: "wood", isHit: false }
      );
      break;
    default:
      // Random generated levels for higher levels

      const baseCount = 3 + Math.floor(level / 2);
      for (let i = 0; i < baseCount; i++) {
        targets.push({
          id: `t${i}`,
          x: 600 + Math.random() * 300,
          y: 200 + Math.random() * 250,
          isHit: false,
        });
      }
      for (let i = 0; i < baseCount - 1; i++) {
        obstacles.push({
          id: `o${i}`,
          x: 550 + Math.random() * 350,
          y: 200 + Math.random() * 250,
          type: Math.random() > 0.5 ? "wood" : "glass",
          isHit: false,
        });
      }
  }
  return { targets, obstacles };
};
