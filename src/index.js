import express from "express";
import { bootstrap } from "./app.controller.js";

const app = express();

bootstrap(app, express);

export default app;