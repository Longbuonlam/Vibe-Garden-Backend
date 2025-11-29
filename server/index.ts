import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import placeOrderRouter from "./routes/place-order.js";
import contactRouter from "./routes/contact.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Order placement route (sends email)
  app.use('/api/place-order', placeOrderRouter);

  // Contact form route (send email)
  app.use('/api/contact', contactRouter);

  return app;
}
