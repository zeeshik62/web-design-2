const express = require("express");
const cors = require("cors");

const routes = require("./routes");
// const { notFound, errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", routes);

// app.use(notFound);
// app.use(errorMiddleware);

module.exports = app;