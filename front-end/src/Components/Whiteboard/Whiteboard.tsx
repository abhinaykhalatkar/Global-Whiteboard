import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Object } from "fabric/fabric-impl";
import { UUID } from "crypto";

interface WhiteboardProps {}
interface MyObject {
  [key: string]: any;
}

interface CustomFabricObject extends fabric.Object {
  uuidv4: UUID;
  target: UUID;
}
type CustomFabricEvent = {
  target: { uuidv4: UUID };
  transform: {
    target: any;
  };
};
type recivedObjectData = {
  target: UUID;
  newPosition: fabric.Path;
};
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

  function findObjectByUuid(array: MyObject[], uuidv4: string) {
    return array.find((obj) => obj["uuidv4"] === uuidv4);
  }
  function setUuidOnObject(object: MyObject) {
    let uuid = uuidv4();
    object.set("uuidv4", uuid);
    return uuid;
  }
  useEffect(() => {
    setBlankCanvas();
  }, []);
  useEffect(() => {
    //canvas event

    canvas.on(
      "object:modified",
      (e: fabric.IEvent<MouseEvent> | CustomFabricEvent) => {
        canvas.renderAll();
        if (e?.transform?.target?._objects) {
          //for multi object
          let objects: CustomFabricObject[] = e.transform.target
            ._objects as CustomFabricObject[];
          socket.emit(
            "drawMoved",
            objects.map((el, i) => {
              if (i === 0) {
                console.log(el);
              }
              return { target: el.uuidv4, newPosition: el };
            })
          );
        } else if (!e.transform?.target._objects) {
          //for single object
          if (!(e.target && "uuidv4" in e.target)) return;
          console.log(e.transform?.target);
          socket.emit("drawMoved", {
            target: e.target.uuidv4,
            newPosition: e.transform?.target,
          });
        }
      }
    );
    //event socket listener
    socket.on("drawMoved", (data: recivedObjectData[] | recivedObjectData) => {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          findObjectByUuid(canvas.getObjects("path"), data[i].target)?.set({
            ...data[i].newPosition,
          });
          canvas.renderAll();
          console.log(
            findObjectByUuid(canvas.getObjects("path"), data[i].target)
          );
        }
      } else {
        let objToMove = findObjectByUuid(
          canvas.getObjects("path"),
          data.target
        );
        console.log({ ...data.newPosition });

        objToMove?.set({ ...data.newPosition });
        canvas.renderAll();
      }
    });
    //canvas event
    canvas.on("path:created", (e: any) => {
      canvas.renderAll();
      let uuid = setUuidOnObject(
        canvas.item(canvas.getObjects().length - 1) as MyObject
      );
      const path = e.path as fabric.Path;
      if (path) {
        socket.emit("drawing", { path: path, uuid: uuid });
      }
    });
    //event socket listener
    socket.on("drawing", (data: { path: fabric.Path; uuid: string }) => {
      const path = new fabric.Path(data.path.path, { ...data.path });
      canvas.add(path);
      canvas.renderAll();
      (canvas.item(canvas.getObjects().length - 1) as any).set(
        "uuidv4",
        data.uuid
      );
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
