require('dotenv').config()
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require('mongoose');

// const authenticate = require("../auth/auth-middleware");
// const issueRouter = require("../issues/issue-router.js");
// const authRouter = require("../auth/auth-router.js");
// const userRouter = require("../user/user-router.js");

mongoose.connect(process.env.DATABASE_URL, { useNewURLParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database'));
const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

const usersRouter = require('../users/users-router.js');

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use("/users", usersRouter);
// server.use("/auth", authRouter);
// server.use("/api/users", authenticate, userRouter);

module.exports = server;