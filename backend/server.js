import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app=express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/api/user', userRoutes);

app.use(express.static(path.join(__dirname, '../frontend/dist')));
const resolvedPath = path.resolve(__dirname, '../frontend/dist/index.html');
//console.log("✅ Path to index.html:", resolvedPath);

app.get('*', (req, res) => {
  // console.log("✅ Wildcard route reached");
  res.sendFile(resolvedPath);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));