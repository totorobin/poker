import express , { type Express } from "express"
import dotenv from "dotenv"
import { createServer } from 'node:http';
import {ioServer} from "./ioServer";
import path from "node:path";

dotenv.config()

const app: Express = express()
const port =  process.env.PORT || 3000
const server = createServer(app);

app.use(express.static('public'));
app.get('/room/:id', (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const io = new ioServer(server);


server.listen(port, () => {
    console.log(`server is running a http://localhost:${port}`)
})