require("dotenv").config();
const express = require("express"); // Import thư viện Express
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connect");

const authRoutes = require("./routes/authRoute");
const potholeRoutes = require("./routes/potholeRoute");

const potholeHandler = require("./sockets/potholeHandler");

const app = express(); // Tạo một instance của Express
const server = createServer(app);
// const io = new Server(server);

const io = new Server(server, {
  cors: {
    origin: "*", // Hoặc URL của client
    methods: ["GET", "POST"],
  },
});

// Middleware cơ bản để parse JSON
app.use(express.json());

// Định nghĩa một route cơ bản tại đường dẫn `/`
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pothole", potholeRoutes);

const onConnection = (socket) => {
  potholeHandler(io, socket);
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
  socket.onAny((event, ...args) => {
    console.log("\n", event, args);
  });
};

io.on("connection", onConnection);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () => {
      console.log(`SERVER IS LISTENING ON PORT ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
