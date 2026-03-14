require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const experts = require("./src/routes/ExpertsRoute");
const business = require("./src/routes/businessRoute");
const aiRoutes = require("./src/routes/ai");
const cookieParser = require("cookie-parser");
const passport = require("./src/config/passport");

const app = express();

/* create http server */
const server = http.createServer(app);

/* attach socket.io */
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

/* socket connection */
io.on("connection", (socket) => {
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.projectId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* allow controllers to use socket */
app.set("io", io);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(passport.initialize());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

/* routes */
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/notifications", notificationRoutes);
app.use("/reviews", reviewRoutes);
app.use("/chat", chatRoutes);
app.use("/expert", experts);
app.use("/business", business);
app.use("/api", aiRoutes);

/* database */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* start server */
server.listen(process.env.PORT, () => {
  console.log(`SearchMyExpert API running on ${process.env.PORT}`);
});
