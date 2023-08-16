import express from "express";
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

import db from "./config/database";
db.connect();

import userRoutes from "./routes/userRoutes";
app.use("/users", userRoutes);

export default app;
