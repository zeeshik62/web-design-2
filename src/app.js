const express = require("express");
const cors = require("cors");

const routes = require("./routes");
// const { notFound, errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");
app.use(express.static(path.resolve("public")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("public", "index.html"));
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", routes);

// app.use(notFound);
// app.use(errorMiddleware);

module.exports = app;