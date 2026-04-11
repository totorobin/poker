import express, { type Express } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { IoServer } from './ioServer';
import path from 'node:path';
import fs from 'node:fs';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT ?? '3000', 10);
const host: string = process.env.HOST ?? '0.0.0.0';

process.argv.forEach(function (val, index, array) {
  if (val.startsWith('--')) {
    process.env[val.substring(2)] = array[index + 1];
    console.log(`process.env.${val.substring(2)}: ${process.env[val.substring(2)]}`);
  }
});

const publicPath = path.resolve(__dirname, process.env.PUBLIC_PATH ?? '../public');
console.log(`Checking publicPath: ${publicPath}`);
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath);
  console.log(`publicPath exists. Content: ${files.join(', ')}`);
} else {
  console.error(`ERROR: publicPath does not exist: ${publicPath}`);
}

// Global request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(publicPath, { index: 'index.html' }));

// Express 5 compatible catch-all for SPA (requires named parameters with wildcard)
app.get('*path', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const server = createServer(app);
const io = new IoServer(server);
if (io.io != null) {
  console.log('Websocket Server initiated');
}

server.listen(port, host, () => {
  console.log(`Server v2.0.2 is running at http://${host}:${port}`);
});
