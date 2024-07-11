const { log } = require("console");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];

let crudData = [];

io.on("connection", (socket) => {
  socket.on("scores", (scores) => {
    console.log(scores);
    playerScores.push({ ...scores, id: socket.id });

    socket.emit("playerScores", playerScores);
  });
  socket.on("data", (data) => {
    crudData.push(data);
    socket.emit("crudData", crudData);
  });
  socket.on("editData", (response) => {
    console.log(response);
    let currentIndex = crudData.findIndex((data) => data.id === response);
    if (currentIndex !== -1) {
      crudData[currentIndex] = { ...crudData[currentIndex], ...response };
    }
  });
  socket.on("deleteData",(id) => {
    let currentIndex = crudData.findIndex(data => data.id === id)
    if(currentIndex !== -1){
      crudData.splice(currentIndex,1);
    }
  })

  setInterval(() => {
    socket.emit("playerScores", playerScores);
    socket.emit("crudData", crudData);
  }, 1000);
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
