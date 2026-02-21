import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  
  // Force production if NODE_ENV is set or if we're not in a dev environment
  const isProduction = process.env.NODE_ENV === "production";
  const distPath = path.resolve(__dirname, "dist");

  console.log(`--- Server Startup ---`);
  console.log(`Mode: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`Directory: ${__dirname}`);
  console.log(`Dist Path: ${distPath}`);

  // Health check / Debug endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mode: isProduction ? "production" : "development",
      distExists: fs.existsSync(distPath),
      indexExists: fs.existsSync(path.join(distPath, "index.html")),
      time: new Date().toISOString()
    });
  });

  if (!isProduction) {
    console.log("Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    if (!fs.existsSync(distPath)) {
      console.error("CRITICAL: 'dist' directory not found! Did you run 'npm run build'?");
    }

    // Serve static files with explicit MIME types and paths
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));

    // Serve other static files from dist root (like favicon, etc)
    app.use(express.static(distPath));
    
    // Handle SPA routing
    app.get("*", (req, res) => {
      // Don't serve index.html for missing assets
      if (req.path.startsWith('/assets/')) {
        return res.status(404).send("Asset not found");
      }

      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application Not Ready - index.html missing in /dist");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
