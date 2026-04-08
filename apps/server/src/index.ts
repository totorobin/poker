import express, { type Express } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { IoServer } from './ioserver';
import path from 'node:path';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT ?? '3000', 10);
const host: string = process.env.HOST ?? '0.0.0.0';
const server = createServer(app);

const publicPath = path.resolve('public');
console.log(`Serving static files from: ${publicPath}`);
app.use(express.static(publicPath));
app.get('/room/:id', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const io = new IoServer(server);
if (io.io != null) {
  console.log('Websocket Server initiated');
}

server.listen(port, host, () => {
  console.log(`Server v2.0.1 is running at http://${host}:${port}`);
});
