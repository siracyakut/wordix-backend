import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoute from "./routes/auth.js";
import questionsRoute from "./routes/questions.js";
import leaderboardRoute from "./routes/leaderboard.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/questions", questionsRoute);
app.use("/leaderboard", leaderboardRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONN_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`)),
  )
  .catch((err) => {
    throw err;
  });
