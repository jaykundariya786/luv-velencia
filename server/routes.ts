import { createServer, Server } from "http";
import { Express } from "express";
import { setupBackendProxy } from "./proxy";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Setup proxy to LV Backend - this handles all the real API calls
  setupBackendProxy(app);

  // Health check endpoint for the proxy server
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "LUV VALENCIA proxy server is running",
      timestamp: new Date().toISOString()
    });
  });

  // Catch-all for any remaining API routes - redirect to LV Backend
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      message: "Please check if the LV Backend is running on port 5001",
      suggestedUrl: req.originalUrl.replace("/api", "/lv-api")
    });
  });

  return server;
}