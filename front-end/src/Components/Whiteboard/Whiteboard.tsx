import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

enum canvasInputMethod {
  None,
  Pen,
  Brush,
  Shape,
}
class ExtendedPencilBrush extends fabric.PencilBrush {
  id: string;
  constructor(canvas: fabric.Canvas, id: string) {
    super(canvas);
    this.id = id;
  }
}

interface WhiteboardProps {}
const socket = io(`${process.env.REACT_APP_SERVER_LINK}`);
const Whiteboard: React.FC<WhiteboardProps> = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [inputMethod, setInputMethod] = useState<canvasInputMethod>(
    canvasInputMethod.None
  );

  const setBlankCanvas = () => {
    // if (!canvas) return;
    // canvas.remove(...canvas.getObjects());

    setCanvas(
      new fabric.Canvas("whiteboard", {
        height: 1000,
        width: 1000,
        backgroundColor: "white",
      })
    );
  };
  useEffect(() => {
    setBlankCanvas();
  }, []);

  useEffect(() => {
    if (!canvas) return;
    if (inputMethod === canvasInputMethod.Brush) {
      let uuid = uuidv4();
      console.log(uuid);
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "#000000";
      brush.width = 10;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;

      canvas.on("path:created", (e: any) => {
        console.log(canvas);
        const path = e.path as fabric.Path;
        if (path) {
          socket.emit("drawing", path);
        }
      });
    } else {
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }
  }, [inputMethod, canvas]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("clearCanvas", (data) => {
      setBlankCanvas();
    });
    socket.on("drawing", (data: fabric.Path) => {
      if (!canvas) return;
      const path = new fabric.Path(data.path, { ...data });
      canvas.add(path);
      // canvas.renderAll();
    });
  }, [canvas]);

  const setBrush = () => {
    if (!canvas) return;
    setInputMethod(canvasInputMethod.Brush);
  };

  return (
    <div>
      <div>
        <button type="button" name="pen" onClick={setBrush}>
          PEN
        </button>
        <button
          type="button"
          name="Clear"
          onClick={() => {
            socket.emit("clearCanvas");
            setBlankCanvas();
          }}
        >
          Clear Canvas
        </button>
        <button
          type="button"
          name="Select"
          onClick={() => {
            setInputMethod(canvasInputMethod.None);
          }}
        >
          Select
        </button>
      </div>
      <canvas id="whiteboard"></canvas>
    </div>
  );
};

export default Whiteboard;
