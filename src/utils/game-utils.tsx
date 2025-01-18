export const checkCollision = (x1: number, y1: number, x2: number, y2: number): boolean => {
    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return distance < 40;
  };
  
  export const calculateTrajectory = (startX: number, startY: number, velocityX: number, velocityY: number) => {
    const points = [];
    const gravity = 0.5;
    const steps = 30;
    let x = startX;
    let y = startY;
    const vx = velocityX;
    let vy = velocityY;
  
    for (let i = 0; i < steps; i++) {
      points.push({ x, y });
      x += vx;
      y += vy;
      vy += gravity;
    }
  
    return points;
  };
  
  