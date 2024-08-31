import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"
import mongoose from 'mongoose'

dotenv.config();
const uri = "mongodb+srv://saisiri0919:wkSqvA0cVXCFUuXl@cluster0.wdinb.mongodb.net/recipe?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log(e);
    console.log("Database Can't Be Connected");
});