"use client";

import { useEffect, useRef } from "react";

interface PixelatedEmojiProps {
  emoji: string;
  size?: number;
  className?: string;
}

export function PixelatedEmoji({ emoji, size = 64, className = "" }: PixelatedEmojiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = size;
    canvas.height = size;

    // Create temporary canvas to render emoji
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Draw emoji on temporary canvas
    tempCtx.font = `${size * 0.8}px Arial`;
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillText(emoji, size / 2, size / 2);

    // Pixelate by drawing at a lower resolution
    const pixelSize = 4;
    ctx.imageSmoothingEnabled = false;

    // Draw pixelated version
    ctx.drawImage(tempCanvas, 0, 0, size, size, 0, 0, size / pixelSize, size / pixelSize);
    ctx.drawImage(canvas, 0, 0, size / pixelSize, size / pixelSize, 0, 0, size, size);

    // Add pixelated effect
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    // Add some noise and pixelation effect
    for (let i = 0; i < data.length; i += 4) {
      // Skip transparent pixels
      if (data[i + 3] < 50) continue;

      // Add some noise
      if (Math.random() > 0.9) {
        data[i] = Math.max(0, data[i] - 20);
        data[i + 1] = Math.max(0, data[i + 1] - 20);
        data[i + 2] = Math.max(0, data[i + 2] - 20);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [emoji, size]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} style={{ width: size, height: size }} />;
}
