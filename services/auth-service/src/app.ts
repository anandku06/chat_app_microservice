import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*", // Allow all origins for development; adjust in production
      credentials: true, // Allow cookies to be sent with requests
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // for routes that are not defined, return a 404 response
  app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  return app;
};
