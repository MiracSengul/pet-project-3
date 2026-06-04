import { startServer } from "./server.js";
import { connectMongoDB } from "./db/connectMongoDB.js";   

const bootstrap = async () => {
    await connectMongoDB()
    startServer()
}

bootstrap()