import express, {type Express} from 'express'
import dotenv from 'dotenv'
import {createServer} from 'node:http'
import path from 'node:path'
import {createApplication} from "./api/app";

dotenv.config()

const app: Express = express()
const port: string | number = process.env.PORT ?? 3000
const server = createServer(app)

app.use(express.static('public'))
app.get('/room/:id', (_req, res) => {
  res.sendFile(path.resolve('public', 'index.html'))
})

createApplication(server)

server.listen(port, () => {
  console.log(`server is running a http://localhost:${port}`)
})
