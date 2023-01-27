import express, { urlencoded } from "express";
import "./db/config.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { response } from "express";
import path from "path";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());

app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);

//routes
import userRoute from "../server/routes/user.js";
app.use("/api/v1", userRoute);

//serving the frontend
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
