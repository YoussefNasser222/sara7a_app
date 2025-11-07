import { connectDB } from "./DB/connection.js";
import fs from "node:fs";
import * as Auth from "./modules/index.js";
import cors from "cors";
import { globalErrorHandler } from "./utils/error/index.js";
import  rateLimit  from "express-rate-limit";
export function bootstrap(app, express) {
  // handle rate limit
  const limiter = rateLimit({
    windowMs : 60 * 100, // 1 min
    limit: 3,
    skipSuccessfulRequests: true,
    handler: (req, res, next, options) => {
      throw new Error(options.message, { cause: options.statusCode });
    },
  });
  app.use("/auth", limiter);
  // parse data from req {row json}
  app.use(express.json());
  // to get file static
  app.use("/upload", express.static("upload"));
  // connect DB
  connectDB();
  // cors
  app.use(
    cors({
      origin: "*",
    })
  );
  // router
  app.use("/auth", Auth.authRouter);
  app.use("/user", Auth.userRouter);
  app.use("/message", Auth.messageRouter);
  //   global handler
  app.use(globalErrorHandler);
}
