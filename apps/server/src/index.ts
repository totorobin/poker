import express, { type Express } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { IoServer } from './ioserver';
import './user';
import './room';
import './roomstore';
import path from 'node:path';
import fs from 'node:fs';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT ?? '3000', 10);
const host: string = process.env.HOST ?? '0.0.0.0';
const server = createServer(app);

const publicPath = path.resolve(__dirname, '../public');
console.log(`Checking publicPath: ${publicPath}`);
if (fs.existsSync(publicPath)) {
  console.log(`publicPath exists. Content: ${fs.readdirSync(publicPath).join(', ')}`);
} else {
  console.error(`ERROR: publicPath does not exist: ${publicPath}`);
}

// Global request logger to debug incoming traffic
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(publicPath, { index: 'index.html' }));

// Route fallback for SPA (Express 5 syntax requires named parameters with wildcard)
app.get('*path', (req, res) => {
  console.log(`Fallback for SPA hit: ${req.url}`);
  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    console.error(`Error sending index.html for ${req.url}: ${err.message}`);
  });
});

const io = new IoServer(server);
if (io.io != null) {
  console.log('Websocket Server initiated');
}

server.listen(port, host, () => {
  console.log(`Server v2.0.1 is running at http://${host}:${port}`);
});
