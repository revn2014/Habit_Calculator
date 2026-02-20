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

    // Serve static files with explicit caching and types
    app.use(express.static(distPath, {
      maxAge: '1d',
      index: false // We handle index manually below
    }));
    
    // Handle SPA routing
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send(`
          <h1>Application Not Ready</h1>
          <p>The build files were not found in <code>/dist</code>.</p>
          <p>Please ensure <code>npm run build</code> has completed successfully on the server.</p>
        `);
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
