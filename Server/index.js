const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const Authp = require("./routes/productRouter.js");
require("dotenv").config();
require("./models/db");
app.use(bodyParser.json());
app.use(cors()); // when client is on 3030 port and backend is on different port we use this to allow ports of different connection

const PORT = process.env.PORT || 8080;

app.get("/", (req, resp) => {
  resp.send("hello");
});
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log("server is running");
});
