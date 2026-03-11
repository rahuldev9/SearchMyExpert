const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/expertRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/applications", applicationRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
