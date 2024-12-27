const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors")
const morgan = require("morgan")
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middlewares/errorHandler.mdlwr");


const swaggerSpecs = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "swagger.json"), "utf8")
);

const connectDB = require("./db");
const logger = require("./logger/");
const app = express();
connectDB();
app.use(cors())
app.use(
    morgan("short", {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);


// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", require("./routes/index.routes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// app.use(errorHandler);
module.exports = app;
