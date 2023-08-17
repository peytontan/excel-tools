const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
const cors = require("cors");
const userRouter = require("./routers/user_router");
const cloudinary = require('cloudinary').v2;
require('dotenv').config() //.config will look for the .env file and load all the var inside into the runtime environment. runtime env is contained in process.env
const toolsRouter = require("./routers/tools_router")
const fileUpload = require('express-fileupload');

// middleware to handle URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  useTempFiles : true, //so that we can get the path to upload
}));

// handle cors pre-flight requests
app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());

// API endpoint routes
app.use("/api/users", userRouter);
app.use("/api/tools", toolsRouter);

app.get("/api/test", (req, res) => {
  res.json("server works!");
});

// LISTENER
mongoose
  .connect(`mongodb://localhost:27017/excel-tools`) //to change when its done
//   .connect(
//     `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
//   )
  .then(() => {
    console.log("DB connected");

    // boot up app
    app.listen(port, () => {
      console.log("excel tools running on port: ", port);
    });
  })
  .catch((err) => {
    console.log("err when connecting: " + err);
  });
