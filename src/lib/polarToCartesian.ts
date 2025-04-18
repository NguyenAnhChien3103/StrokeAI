export function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (Math.PI / 180) * angle;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  }
  