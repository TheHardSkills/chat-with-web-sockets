exports.handleConnection = (socket) => {
  socket.on("chat message", (msg) => {
    socket.emit("message", msg);
    socket.broadcast.emit("message", msg);
  });
};
