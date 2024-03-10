import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

interface WhiteboardProps {}
const socket = io(`${process.env.REACT_APP_SERVER_LINK}`);
const Whiteboard: React.FC<WhiteboardProps> = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>(
    new fabric.Canvas("whiteboard", {
      height: 1000,
      width: 1000,
      backgroundColor: "gray",
    })
  );

  const setBlankCanvas = () => {
    setCanvas(
      new fabric.Canvas("whiteboard", {
        height: 1000,
        width: 1000,
        backgroundColor: "gray",
      })
    );
  };
  const setBrush = (color: string = "#000000", width: number = 5) => {
    console.log(canvas);
    if (!canvas) return;
    const brush = new fabric.PencilBrush(canvas);
    brush.color = color;
    brush.width = width;
    canvas.freeDrawingBrush = brush;
    canvas.isDrawingMode = true;
  };
  const setSelect = () => {
    if (!canvas) return;
    canvas.isDrawingMode = false;
  };
  const handleClearCanvas = () => {
    canvas.remove(...canvas.getObjects());
    canvas.renderAll();
  };

  useEffect(() => {
    setBlankCanvas();
  }, []);
  useEffect(() => {
    if (!canvas) return;

    canvas.on("path:created", (e: any) => {
      console.log(canvas);
      const path = e.path as fabric.Path;
      if (path) {
        socket.emit("drawing", path);
      }
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("clearCanvas", (data) => {
      handleClearCanvas();
    });
    socket.on("drawing", (data: fabric.Path) => {
      if (!canvas) return;
      const path = new fabric.Path(data.path, { ...data });
      canvas.add(path);
      canvas.renderAll();
    });
  }, [canvas]);

  return (
    <div>
      <div>
        <button
          type="button"
          name="pen"
          onClick={() => {
            setBrush("red", 7);
          }}
        >
          PEN
        </button>
        <button
          type="button"
          name="Clear"
          onClick={() => {
            socket.emit("clearCanvas");
            handleClearCanvas();
          }}
        >
          Clear Canvas
        </button>
        <button type="button" name="Select" onClick={setSelect}>
          Select
        </button>
      </div>
      <canvas id="whiteboard"></canvas>
    </div>
  );
};

export default Whiteboard;
