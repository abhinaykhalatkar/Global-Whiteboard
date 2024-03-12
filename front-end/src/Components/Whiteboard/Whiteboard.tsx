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
  const [isAlreadyRan, setIsAlreadyRan] = useState(false);

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
    if (!canvas) return;
    const brush = new fabric.PencilBrush(canvas);
    brush.color = color;
    brush.width = width;
    canvas.selection = false;
    canvas.freeDrawingBrush = brush;
    canvas.isDrawingMode = true;
  };
  const setSelect = () => {
    if (!canvas) return;
    canvas.isDrawingMode = false;
    canvas.selection = true;
  };
  const handleClearCanvas = () => {
    canvas.remove(...canvas.getObjects());
    canvas.renderAll();
  };
  interface MyObject {
    [key: string]: any;
  }
  function findObjectByUuid(array: MyObject[], uuidv4: string) {
    return array.find((obj) => obj["uuidv4"] === uuidv4);
  }
  useEffect(() => {
    setBlankCanvas();
  }, []);
  useEffect(() => {
    // if (!canvas) return;
    canvas.on("object:modified", (e: any) => {
      // canvas.renderAll();
      socket.emit("drawMoved", {
        target: e.target.uuidv4,
        newPosition: e.transform.target,
      });
    });
    socket.on("drawMoved", (data) => {
      let objToMove: any = findObjectByUuid(
        canvas.getObjects("path"),
        data.target
      );
      objToMove?.set({ ...data.newPosition });
      canvas.renderAll();
    });
    canvas.on("path:created", (e: any) => {
      canvas.renderAll();
      let uuid = uuidv4();
      (canvas.item(canvas.getObjects().length - 1) as any).set("uuidv4", uuid);
      const path = e.path as fabric.Path;
      if (path) {
        socket.emit("drawing", { path, uuid });
      }
    });
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("clearCanvas", () => {
      handleClearCanvas();
    });

    socket.on("drawing", (data: { path: fabric.Path; uuid: string }) => {
      const path = new fabric.Path(data.path.path, { ...data.path });
      canvas.add(path);
      canvas.renderAll();
      (canvas.item(canvas.getObjects().length - 1) as any).set(
        "uuidv4",
        data.uuid
      );
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
