import express, {type Express} from 'express';
import dotenv from 'dotenv';
import {createServer} from 'node:http';
import {IoServer} from './ioServer';
import path from 'node:path';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT ?? 3000;
const server = createServer(app);

app.use(express.static('public'));
app.get('/room/:id', (_req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

const io = new IoServer(server);
if (io.io != null) {
  console.log('websocket Server initiated');
}

server.listen(port, () => {
  console.log(`server is running a http://localhost:${port}`);
});
