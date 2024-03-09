import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

const Whiteboard: React.FC = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas("whiteboard", {
      width: 800,
      height: 800,
      backgroundColor: "#ffffff",
    });
    setCanvas(canvasInstance);
  }, []);

  useEffect(() => {
    if (canvas) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "#000000";
      brush.width = 2;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;
    }
    console.log(canvas);
  }, [canvas]);
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvas) {
      const pointer = canvas.getPointer(event.nativeEvent);
      const circle = new fabric.Circle({
        radius: 20,
        fill: "red",
        left: pointer.x,
        top: pointer.y,
      });
      canvas.add(circle);
    }
  };
  //   const handleDrawing = () => {
  //     if (canvas) {
  //       const brush = new fabric.PencilBrush(canvas);
  //       brush.color = "#000000"; // Set pen color
  //       brush.width = 2; // Set pen width
  //       canvas.freeDrawingBrush = brush;
  //       canvas.isDrawingMode = true;
  //     }
  //   };

  return (
    <div>
      <canvas id="whiteboard" onMouseDown={handleMouseDown}></canvas>
    </div>
  );
};

export default Whiteboard;
