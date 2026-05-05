const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");
// const { notFound, errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

// Track every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("public")));

// API Routes
app.use("/api", routes);

app.get("/health", (req, res) => res.json({ ok: true }));

// app.use(notFound);
// app.use(errorMiddleware);

module.exports = app;