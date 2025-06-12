import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';

export function setupBackendProxy(app: Express) {
  // Proxy API requests to LV Backend
  app.use('/lv-api', createProxyMiddleware({
    target: 'http://localhost:5001/api',
    changeOrigin: true,
    pathRewrite: {
      '^/lv-api': '', // Remove /lv-api prefix
    },
    onError: (err, req, res) => {
      console.error('LV Backend Proxy Error:', err.message);
      res.status(502).json({ error: 'Backend service unavailable' });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[LV Backend Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    }
  }));

  // Handle preflight requests for CORS
  app.options('/lv-api/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.sendStatus(200);
  });
}