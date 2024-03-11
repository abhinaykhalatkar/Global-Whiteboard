export default function socketRoutes(socket: any) {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("drawing", (data: any) => {
    socket.broadcast.emit("drawing", data);
  });
  socket.on("clearCanvas", (data: any) => {
    socket.broadcast.emit("clearCanvas", data);
  });
  socket.on("drawMoved", (data: any) => {
    socket.broadcast.emit("drawMoved", data);
  });
}
