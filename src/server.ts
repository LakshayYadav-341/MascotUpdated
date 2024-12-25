import { NextFunction } from "express";
import "module-alias/register";
import path from "path";

if (__filename.endsWith(".js")) {
    require("module-alias/register");
    const { addAliases } = require("module-alias");
    addAliases({
        "@*": `build/src/*`,
    });
}

import { ErrorHandler } from "./handlers/error";
import { DB_URL, PORT } from "./server/config";
import loggerMw from "./server/logger";
import logger from "./server/logger/winston";
import apiRouter from "./server/routes";
import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import { ValueDeterminingMiddleware, rateLimit } from "express-rate-limit";
import { createServer } from "http";
import mongoose from "mongoose";
import { mw as requestIP } from "request-ip";
import { Server } from "socket.io";
import { initializeSocketIOTest } from "./server/socket/socket";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: [
            "*",
            "https://mascot-lilac.vercel.app",
            "http://localhost:5173"
        ],
        credentials: true,
    },
});

app.use(
    cors({
        origin: (origin, callback) => {
            console.log("Incoming request origin:", origin);
            const allowedOrigins = [
                "http://localhost:5173",
                "https://pslv-react-jsx.vercel.app/",
                "https://zt7q67.tunnel.pyjam.as/",
                "http://localhost:80/",
                "http://172.235.25.83:80",
                "http://172.235.25.83:6969",
                "http://172.235.25.83:5173",
                "https://mascot-lilac.vercel.app",
            ];
            console.log(origin);

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS policy error: Origin not allowed"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Handle OPTIONS preflight requests for all routes
app.options("*", cors());

// Your rate limiting and other middlewares go here
const createRateLimit = () =>
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5000,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: ((req: Request) =>
            req?.clientIp) as ValueDeterminingMiddleware<string>,
        handler: (_, res, ___, options) => {
            const _handler = new ErrorHandler("rate limit");
            return res
                .status(429)
                .send(
                    _handler.error(
                        "Rate Limit Exceeded! " +
                            `You are only allowed ${options.limit}/${Math.floor(
                                options.windowMs / 60_000
                            )} minutes`
                    )
                );
        },
    });

app.set("io", io);

app.use(requestIP());
app.use(createRateLimit());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMw);

app.use("/api", apiRouter);
app.use("/static/files", express.static(path.join(__dirname, "..", "public")));

app.get("/docker", (_, res) => res.send("This works"));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API",
        },
        servers: [
            {
                url: "http://localhost:6969",
            },
        ],
        components: {
            securitySchemes: {
                jwt: {
                    type: "apiKey",
                    name: "Authorization",
                    in: "header",
                },
            },
        },
    },
    apis: ["./src/server/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Generic error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

mongoose
    .connect(DB_URL)
    .then(() => {
        initializeSocketIOTest(io);
        logger.info("Connected to the database");
    })
    .catch(logger.error);


server.listen(PORT, "0.0.0.0", () => {
    logger.info(`App listening on port: ${PORT}`);
});

// Export the app and server for both development and serverless environments
export { app, server };
